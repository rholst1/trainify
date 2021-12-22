import StripePayment from "../Stripe/StripePayment";
import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import './HomePage.css'
import { promiseImpl } from "ejs";
import { FaBeer, FaArrowRight, FaRegArrowAltCircleRight} from 'react-icons/fa';

const HomePage = () => {
    var date = new Date();
    console.log(date);
    const [value, setValue] = useState(date);
    console.log(process.env.REACT_APP_TEST)

    return (
        <>
            <div className="Wrapper">
                <h2>Planera din resa</h2>
                <form>
                    <div className="InputContainer">

                        <input
                            typ="text"
                            placeholder="Från"
                        />
                        <div>

                           
                            <FaRegArrowAltCircleRight
                            fontSize='35px'
                            

                            />
                        </div>
                        <input
                            typ="text"
                            placeholder="Till"
                        />
                    </div>
                    <button type="submit">Hitta resa</button>
                    <div>
                        <DateTimePicker
                            onChange={setValue}
                            value={value}
                            locale="se"
                            disableClock="true"
                        />
                    </div>
                </form>
            </div>
            <StripePayment />

        </>

    )
}
export default HomePage
