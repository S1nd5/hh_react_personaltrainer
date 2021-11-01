import './App.css';
import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import TrainingIcon from '@mui/icons-material/RunCircle';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import StatisticIcon from '@mui/icons-material/BarChart';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';

import Customerlist from './components/Customerlist';
import Traininglist from './components/Traininglist';
import Calendar from './components/Calendar';
import Statistics from './components/Statistics';

function App() {

  const [value, setValue] = useState('customerlist');
  const [drawerOpen, setDrawer] = useState(false);

  const toggleDrawer = (value) => {
    setDrawer(value);
  }

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton onClick={() => toggleDrawer(true)} edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Drawer anchor="left"
            variant="temporary"
            open={drawerOpen}
            onClose={() => toggleDrawer(false)}
            onOpen={() => toggleDrawer(true)}
          >
            <Box>
              <Typography variant="h4" align="center" style={{ marginTop: '10px' }}>Menu</Typography>
              <List>
                <ListItem>
                  <Button onClick={() => setValue("customerlist")} color="primary"><ListItemIcon><PersonIcon /></ListItemIcon> Customers</Button>
                </ListItem>
                <ListItem>
                  <Button onClick={() => setValue("traininglist")} color="primary"><ListItemIcon><TrainingIcon /></ListItemIcon> Traininglist</Button>
                </ListItem>
                <ListItem>
                  <Button onClick={() => setValue("calendar")} color="primary"><ListItemIcon><CalendarIcon /></ListItemIcon> Calendar</Button>
                </ListItem>
                <ListItem>
                  <Button onClick={() => setValue("statistics")} color="primary"><ListItemIcon><StatisticIcon /></ListItemIcon> Statistics</Button>
                </ListItem>
              </List>
            </Box>
          </Drawer>
          <Typography variant="h6">
            Personal Trainer App
          </Typography>
        </Toolbar>
      </AppBar>
      {value === 'customerlist' && <Customerlist />}
      {value === 'traininglist' && <Traininglist />}
      {value === 'calendar' && <Calendar />}
      {value === 'statistics' && <Statistics />}
    </div>
  );
}

export default App;
