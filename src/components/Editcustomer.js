import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

export default function Editcustomer(props) {
    const [open, setOpen] = React.useState(false);
    const [customer, setCustomer] = React.useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        streetaddress: '',
        postcode: '',
        city: '',
        url: ''
    })

    const handleClickOpen = () => {
        setCustomer({ firstname: props.customer.firstname, lastname: props.customer.lastname, email: props.customer.email, phone: props.customer.phone, streetaddress: props.customer.streetaddress, postcode: props.customer.postcode, city: props.customer.city, url: props.customer.links[0].href });
        setOpen(true);
    }

    const handleClickClose = () => {
        setOpen(false);
    }

    const handleInputChange = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    }

    const save = () => {
        handleClickClose();
        props.updateCustomer(customer, customer.url);
    }

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
                Edit
            </Button>
            <Dialog open={open} onClose={handleClickClose}>
                <DialogTitle>Edit customer - {customer.firstname} {customer.lastname}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Let's you edit existing customer information and update it
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="firstname"
                        value={customer.firstname}
                        onChange={e => handleInputChange(e)}
                        label="Firstname"
                        type="text"
                        fullWidth
                        variant="standard"
                        required
                    />
                    <TextField
                        margin="dense"
                        name="lastname"
                        value={customer.lastname}
                        onChange={e => handleInputChange(e)}
                        label="Lastname"
                        type="text"
                        fullWidth
                        variant="standard"
                        required
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        value={customer.email}
                        onChange={e => handleInputChange(e)}
                        label="Email"
                        type="text"
                        fullWidth
                        variant="standard"
                        required
                    />
                    <TextField
                        margin="dense"
                        name="phone"
                        value={customer.phone}
                        onChange={e => handleInputChange(e)}
                        label="Phonenumber"
                        type="text"
                        fullWidth
                        variant="standard"
                        required
                    />
                    <TextField
                        margin="dense"
                        name="streetaddress"
                        value={customer.streetaddress}
                        onChange={e => handleInputChange(e)}
                        label="Street Address"
                        type="text"
                        fullWidth
                        variant="standard"
                        required
                    />
                    <TextField
                        margin="dense"
                        name="postcode"
                        value={customer.postcode}
                        onChange={e => handleInputChange(e)}
                        label="Postcode"
                        type="number"
                        fullWidth
                        variant="standard"
                        required
                    />
                    <TextField
                        margin="dense"
                        name="city"
                        value={customer.city}
                        onChange={e => handleInputChange(e)}
                        label="City"
                        type="text"
                        fullWidth
                        variant="standard"
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClickClose} color="error">Cancel</Button>
                    <Button variant="contained" onClick={save} color="success">Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}