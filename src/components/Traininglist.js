import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { format, parseISO } from 'date-fns';
import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

import Addtraining from './Addtraining';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Traininglist() {

    const [trainings, settrainings] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [notification, setNotification] = useState({ message: "", type: "" });

    const gridOptions = [
        { suppressSizeToFit: true },
        { sizeColumnsToFit: true },
        { exportDataAsExcel: true }
    ]

    const onGridReady = (params) => {
        setGridApi(params.api);
    }

    const columns = [
        { field: 'activity', sortable: true, filter: true },
        {
            field: 'date', sortable: true, filter: true, cellRendererFramework: function (params) {
                return (
                    <p>{format(parseISO(params.data.date), 'dd.MM.yyyy hh:mm a', { timeZone: "UTC" })}</p>
                );
            }, getQuickFilterText: function (params) {
                return format(parseISO(params.data.date), 'dd.MM.yyyy hh:mm a', { timeZone: "UTC" });
            }
        },
        { field: 'duration', sortable: true, filter: true },
        {
            field: 'customer', sortable: true, filter: true, cellRendererFramework: function (params) {
                let fullname = "";
                if (params.data.customer) {
                    fullname = params.data.customer.firstname + " " + params.data.customer.lastname;
                }
                return (
                    <p key={fullname} value={fullname}>{fullname}</p>
                );
            }, getQuickFilterText: function (params) {
                return params.data.customer.firstname + " " + params.data.customer.lastname;
            }
        },
        {
            field: 'delete', cellRendererFramework: function (params) {
                return (
                    <Button variant="contained" onClick={() => deleteTraining(params.data.id)} color="error">Delete</Button>
                );
            }
        },
    ]

    function onBtnExpot() {
        gridApi.exportDataAsCsv();
    }

    const fetchData = () => {
        fetch('https://customerrest.herokuapp.com/gettrainings')
            .then(response => response.json())
            .then(data => settrainings(data))
            .catch(err => console.error(err))
    }

    const saveTraining = (training) => {
        if (!training.customer || !training.activity) {
            return setNotification({ baseMsg: "Error during submit", message: "Please provide all details for training.", type: "Error", severity: "error" });
        }
        console.log(JSON.stringify(training));
        fetch('https://customerrest.herokuapp.com/api/trainings', { method: 'POST', headers: { 'Content-type': 'application/json' }, body: JSON.stringify(training) })
            .then(response => { response.json(); console.log(response); })
            .then(data => { fetchData(); setNotification({ baseMsg: "Operation successful", message: "Training added for a customer.", type: "Success", severity: "success" }) })
            .catch(err => console.error(err))
    }

    const deleteTraining = (id) => {
        if (window.confirm("Would you like to delete the selected training?")) {
            fetch('https://customerrest.herokuapp.com/api/trainings/' + id, { method: 'DELETE' })
                .then(res => { fetchData(); setNotification({ baseMsg: "Operation successful", message: "Training deleted.", type: "Success", severity: "success" }) })
                .catch(err => console.error(err));
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div style={{ agCell: { display: 'flex', alignItems: 'center' } }}>
            {notification.message && notification.message.length > 0 &&
                <Alert style={{ margin: 'auto', textAlign: 'center', alignItems: 'center' }} severity={notification.severity}>
                    <AlertTitle>{notification.type}</AlertTitle>
                    {notification.baseMsg} — <strong>{notification.message}</strong>
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setNotification({ message: "", type: "" });
                        }}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                </Alert>
            }
            <h3>Trainings</h3>
            <div style={{ width: '100%', display: 'inline-block' }}>
                <Addtraining saveTraining={saveTraining} />
                <Button variant="contained" color="success" onClick={onBtnExpot}>Export trainings</Button>
            </div>
            <TextField style={{ marginTop: '10px' }} label="Search..." variant="outlined" onChange={(e) => gridApi.setQuickFilter(e.target.value)} />
            <div className="ag-theme-material" style={{ marginTop: 20, height: 800, margin: 'auto' }}>
                <AgGridReact
                    rowData={trainings}
                    columnDefs={columns}
                    pagination="true"
                    paginationPageSize="14"
                    gridOptions={gridOptions}
                    onGridReady={onGridReady}>
                </AgGridReact>
            </div>
        </div>
    );
}