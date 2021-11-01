import React, { useState, useEffect } from 'react'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function Calendar() {
    const [events, setEvents] = useState([{ title: "Testi", date: new Date() }]);

    const fetchData = () => {
        fetch('https://customerrest.herokuapp.com/gettrainings')
            .then(response => response.json())
            .then(data => {
                let calendarEvents = [];
                // eslint-disable-next-line
                data.map(training => {
                    let startTime = new Date(training.date);
                    let endTime = new Date(startTime.getTime() + training.duration * 60000);
                    let customerName = "";
                    if (training.customer != null) {
                        customerName = training.customer.firstname + " " + training.customer.lastname;
                    }
                    let title = "-" + endTime.getHours() + ":" + endTime.getMinutes() + " " + training.activity + " - " + customerName + " - (" + training.duration + " min)";
                    let newEvent = { title: title, date: training.date, start: startTime, end: endTime, duration: training.duration, displayEventEnd: true, displayEventTime: true };
                    calendarEvents.push(newEvent);
                })
                setEvents(calendarEvents);
            })
            .catch(err => console.error(err))
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div style={{ marginTop: '10px' }}>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                views={{
                    listDay: { buttonText: 'list day' },
                    listWeek: { buttonText: 'list week' },
                    listMonth: { buttonText: 'list month' }
                }}
                headerToolbar={{
                    left: "prev,next,today",
                    center: "title",
                    right: "dayGridMonth,dayGridWeek,dayGridDay"
                }}
                locale="fi"
                eventColor='#378006'
                eventBackgroundColor='#284b85'
                eventDisplay='block'
                events={events}
            />
        </div>
    )
}