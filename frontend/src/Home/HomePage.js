import StripePayment from "../Components/Stripe/StripePayment";
import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import './HomePage.css';
import SearchStation from "../Components/Search/SearchStation";
import { FaRegArrowAltCircleRight } from 'react-icons/fa';
import SearchButton from "../Components/Button/SearchButton";


const HomePage = () => {
    var date = new Date();
    const [value, setValue] = useState(date);
    const [stationOne, setStationOne] = useState("stationOne");
    const [stationTwo, setStationTwo] = useState("stationTwo");
    // console.log(process.env.REACT_APP_STRIPE_KEY)


    return (
        <>
            <div className="Wrapper">
                <h2>Planera din resa</h2>
                <form>
                    <div className="InputContainer">
                        <SearchStation
                            input="Från:"
                            setValue={setStationOne}
                        />
                        <div className="IconContainer">
                            <FaRegArrowAltCircleRight
                                fontSize='35px'
                            />
                        </div>
                        <SearchStation
                            input="Till:"
                            setValue={setStationTwo}
                        />
                    </div>
                    <div className="DateTimeContainer">
                        <DateTimePicker
                            className='DateTime'
                            onChange={setValue}
                            value={value}
                            locale="se"
                            disableClock="true"
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

        </>

    )
}
export default HomePage
