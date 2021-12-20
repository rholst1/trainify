import StripePayment from "../Stripe/StripePayment";
import React, {useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import './HomePage.css'
import { promiseImpl } from "ejs";

const HomePage = () => {
    var date = new Date();
    console.log(date);
    const [value, setValue] = useState(date);
    console.log(process.env.REACT_APP_TEST)

    return (
        <>
            <p>Planera din resa</p>
            Från <input typ="text"></input>
            Till <input typ="text"></input>
            <button>Hitta resa</button>
            <div>
                <DateTimePicker
                    onChange={setValue}
                    value={value}
                    locale="se"
                    disableClock="true"
                />
            </div>
            <StripePayment />

        </>

    )
}
export default HomePage
