import React, { useState, useEffect } from 'react'
import { BarChart, Bar, Legend, Tooltip, CartesianGrid, XAxis, YAxis } from 'recharts';
import _ from 'lodash';
import Typography from '@mui/material/Typography';

export default function Statistics() {
    const [data, setData] = useState([]);

    const fetchData = () => {
        fetch('https://customerrest.herokuapp.com/gettrainings')
            .then(response => response.json())
            .then(data => {
                let barData = [];
                // eslint-disable-next-line
                data.map(training => {
                    let newEntry = { name: training.activity, duration: training.duration };
                    barData.push(newEntry);
                })
                var result = _(data)
                    .groupBy("activity")
                    .map((name, id) => ({
                        name: id,
                        duration: _.sumBy(name, 'duration'),
                    }))
                    .value()
                console.log(result);
                setData(result);
            })
            .catch(err => console.error(err))
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <Typography variant="h4" align="left">Statistics</Typography>
            <BarChart style={{ marginTop: '10px' }} width={1000} height={500} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis dataKey="duration" label={{ value: 'Duration (min)', angle: -90, position: 'insideLeft' }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="duration" fill="#8884d8" />
            </BarChart>
        </div>
    )
}