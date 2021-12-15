//import React from "react";
import StripePayment from "../Stripe/StripePayment";
import Calendar from 'react-calendar';
import React, { useEffect, useState } from 'react';
import Clock from 'react-clock';
import 'react-calendar/dist/Calendar.css';
import './HomePage.css'

const HomePage = () => {

    const [value, onChange] = useState(new Date());
    const [value2, setValue] = useState(new Date());
    console.log(value)
    useEffect(() => {
        const interval = setInterval(
          () => setValue(new Date()),
          1000
        );
    
        return () => {
          clearInterval(interval);
        }
      }, []);

    
    return (
        <>
            Sök en resa
            Från <input typ="text"></input> 
            Till <input typ="text"></input>
            <button>Hitta resa</button>
            <div className="calender">
            <p>Current time:</p>
            <Clock value={value2}/>
                <Calendar
                    onChange={onChange}
                    value={value}
                />
            </div>
            <StripePayment />

        </>

    )
}

export default HomePage
