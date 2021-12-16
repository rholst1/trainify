import StripePayment from "../Stripe/StripePayment";
import React, {useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import './HomePage.css'
import Trafikverket from "../Api/Trafikverket";

const HomePage = () => {
    var date = new Date();
    console.log(date);
    const [value, setValue] = useState(date);


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
                />
            </div>
            <StripePayment />

            <Trafikverket/>
        </>

    )
}
export default HomePage
