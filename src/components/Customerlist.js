import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

import Addcustomer from './Addcustomer';
import Editcustomer from './Editcustomer';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Customerlist() {
    const [customers, setcustomers] = useState([]);
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
        { field: 'firstname', sortable: true, filter: true },
        { field: 'lastname', sortable: true, filter: true },
        { field: 'email', sortable: true, filter: true },
        { field: 'phone', sortable: true, filter: "agNumberColumnFilter" },
        { field: 'streetaddress', sortable: true, filter: true },
        { field: 'postcode', sortable: true, filter: "agNumberColumnFilter" },
        { field: 'city', sortable: true, filter: "agTextColumnFilter" },
        {
            field: 'mofidy', cellRendererFramework: function (params) {
                return (
                    <Editcustomer variant="contained" customer={params.data} updateCustomer={updateCustomer} />
                );
            }
        },
        {
            field: 'delete', cellRendererFramework: function (params) {
                return (
                    <Button variant="contained" onClick={() => deleteCustomer(params.data.links[0].href)} color="error">Delete</Button>
                );
            }
        },
    ]

    function onBtnExpot() {
        gridApi.exportDataAsCsv();
    }

    const fetchData = () => {
        fetch('https://customerrest.herokuapp.com/api/customers')
            .then(response => response.json())
            .then(data => setcustomers(data.content))
            .catch(err => console.error(err))
    }

    const updateCustomer = (customer, link) => {
        if (!customer.firstname || !customer.lastname || !customer.email || !customer.phone || !customer.streetaddress || !customer.postcode || !customer.city) {
            return setNotification({ baseMsg: "Error during submit", message: "Please provide all details for customer.", type: "Error", severity: "error" });
        }
        fetch(link, { method: 'PUT', headers: { 'Content-type': 'application/json' }, body: JSON.stringify(customer) })
            .then(response => response.json())
            .then(data => { fetchData(); setNotification({ baseMsg: "Operation successful", message: "Customer has been updated.", type: "Success", severity: "success" }) })
            .catch(err => console.error(err))
    }

    const saveCustomer = (customer) => {
        if (!customer.firstname || !customer.lastname || !customer.email || !customer.phone || !customer.streetaddress || !customer.postcode || !customer.city) {
            return setNotification({ baseMsg: "Error during submit", message: "Please provide all details for customer.", type: "Error", severity: "error" });
        }
        fetch('https://customerrest.herokuapp.com/api/customers', { method: 'POST', headers: { 'Content-type': 'application/json' }, body: JSON.stringify(customer) })
            .then(response => response.json())
            .then(data => { fetchData(); setNotification({ baseMsg: "Operation successful", message: "Customer has been saved.", type: "Success", severity: "success" }) })
            .catch(err => console.error(err))
    }

    const deleteCustomer = (link) => {
        if (window.confirm("Would you like to delete the selected customer?")) {
            fetch(link, { method: 'DELETE' })
                .then(res => { fetchData(); setNotification({ baseMsg: "Operation successful", message: "Customer has been deleted.", type: "Success", severity: "success" }) })
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
            <h3>Customers</h3>
            <div style={{ width: '100%', display: 'inline-block' }}>
                <Addcustomer saveCustomer={saveCustomer} />
                <Button variant="contained" color="success" onClick={onBtnExpot}>Export customers</Button>
            </div>
            <TextField style={{ marginTop: '10px' }} label="Search..." variant="outlined" onChange={(e) => gridApi.setQuickFilter(e.target.value)} />
            <div className="ag-theme-material" style={{ width: '100%', marginTop: 20, height: 800, margin: 'auto' }}>
                <AgGridReact
                    rowData={customers}
                    columnDefs={columns}
                    pagination="true"
                    paginationPageSize="14"
                    editType="fullRow"
                    gridOptions={gridOptions}
                    onGridReady={onGridReady}>
                </AgGridReact>
            </div>
        </div>
    );
}