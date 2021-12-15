//import React from "react";
import StripePayment from "../Stripe/StripePayment";
import Calendar from 'react-calendar';
import React, { useEffect, useState } from 'react';
import Clock from 'react-clock';
import 'react-calendar/dist/Calendar.css';
import './HomePage.css'

const HomePage = () => {

    const [value, onChange] = useState(new Date());
    console.log(value)
    return (
        <>
            Sök en resa
            Från <input typ="text"></input> 
            Till <input typ="text"></input>
            <button>Hitta resa</button>
            <div class="calender">
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
