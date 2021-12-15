import StripePayment from "../Stripe/StripePayment";
import React, {useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import './HomePage.css'

const HomePage = () => {

    const [value, onChange] = useState(new Date());
    
    return (
        <>
            <p>Planera din resa</p>
            Från <input typ="text"></input> 
            Till <input typ="text"></input>
            <button>Hitta resa</button>
            <div> 
                 <DateTimePicker
            onChange={onChange}
            value={value}
        />
            </div>
            <StripePayment />

        </>

    )
}
export default HomePage
