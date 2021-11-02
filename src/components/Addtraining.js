import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

export default function Addtraining(props) {
    const [open, setOpen] = React.useState(false);
    const [customers, setCustomers] = React.useState([]);
    const [training, setTraining] = React.useState({
        date: new Date(),
        activity: "",
        duration: 0,
        customer: "",
    })

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClickClose = () => {
        setOpen(false);
    }

    const handleInputChange = (e) => {
        setTraining({ ...training, [e.target.name]: e.target.value });
    }

    const handleDateChange = (value) => {
        setTraining({ ...training, date: value })
    }

    const save = () => {
        handleClickClose();
        props.saveTraining(training);
    }

    const getCustomers = () => {
        fetch('https://customerrest.herokuapp.com/api/customers')
            .then(response => response.json())
            .then(data => setCustomers(data.content))
            .catch(err => console.error(err))
    }

    const activities = [
        "Gym Training",
        "Zumba",
        "Jogging",
        "Spinning",
        "Fitness",
        "Other",
    ]

    useEffect(() => {
        getCustomers();
    }, []);

    return (
        <div>
            <Button variant="contained" style={{ margin: 10 }} color="primary" onClick={handleClickOpen}>
                Add new tranining
            </Button>
            <Dialog open={open} onClose={handleClickClose}>
                <DialogTitle>New training</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Creates new training for a customer
                    </DialogContentText>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <InputLabel>Date and time</InputLabel>
                        <DateTimePicker
                            renderInput={(props) => <TextField {...props} />}
                            name="date"
                            value={training.date}
                            onChange={(value) => handleDateChange(value)}
                            format="dd.mm.yyyy hh:mm"
                            variant="standard"
                            fullWidth
                            required
                        />
                    </LocalizationProvider>
                    <InputLabel>Activity</InputLabel>
                    <Select
                        name="activity"
                        id="activity"
                        label="Activity"
                        placeholder="Test"
                        value={training.activity}
                        onChange={e => handleInputChange(e)}
                        fullWidth
                    >
                    <MenuItem value="">
                        <em>Select activity</em>
                    </MenuItem>
                    {activities.map(activity => {
                        return <MenuItem value={activity}>{activity}</MenuItem>;
                    })}
                    </Select>
                    <InputLabel>Duration</InputLabel>
                    <TextField
                        margin="dense"
                        name="duration"
                        value={training.duration}
                        onChange={e => handleInputChange(e)}
                        label="Duration"
                        type="text"
                        fullWidth
                        variant="standard"
                        required
                    />
                    <InputLabel>Customer</InputLabel>
                    <Select
                        name="customer"
                        id="customer"
                        value={training.customer}
                        label="Customer"
                        onChange={e => handleInputChange(e)}
                        fullWidth
                        variant="standard"
                    >
                    <MenuItem value="">
                         <em>Select customer</em>
                    </MenuItem>
                    {customers.map(customer => {
                        return <MenuItem value={customer.links[0].href}>{customer.firstname} {customer.lastname}</MenuItem>;
                    })}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClickClose} color="error">Cancel</Button>
                    <Button variant="contained" onClick={save} color="success">Add training</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}