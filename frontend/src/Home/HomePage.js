import StripePayment from "../Components/Stripe/StripePayment";
import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import axios from "axios";
import './HomePage.css'
import Trafikverket from "../Api/Trafikverket";
import { FaRegArrowAltCircleRight } from 'react-icons/fa';
import SearchButton from "../Components/Button/SearchButton";


const HomePage = () => {
    var date = new Date();
    const [value, setValue] = useState(date);
    // console.log(process.env.REACT_APP_STRIPE_KEY)

    return (
        <>

            <div className="Wrapper">
                <h2>Planera din resa</h2>
                <form>
                    <div className="InputContainer">

                        <input
                            typ="text"
                            placeholder="Från:"
                        />
                        <div className="IconContainer">
                            <FaRegArrowAltCircleRight
                                fontSize='35px'
                            />
                        </div>
                        <input
                            typ="text"
                            placeholder="Till:"
                        />
                    </div>
                    <div className="DateTimeContainer">
                        <DateTimePicker
                            className='DateTime'
                            onChange={setValue}
                            value={value}
                            locale="se"
                            disableClock= "true"
                        />
                    </div>
                    <div className="Btn">
                        <SearchButton
                            type='submit'
                            text='Hitta resa'
                        />
                    </div>
                </form>

            </div>
            <StripePayment />

            <Trafikverket/>
        </>

    )
}
export default HomePage
