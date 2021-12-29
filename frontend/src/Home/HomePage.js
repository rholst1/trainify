import StripePayment from "../Components/Stripe/StripePayment";
import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import './HomePage.css';
import SearchStation from "../Components/Search/SearchStation";
import { FaRegArrowAltCircleRight } from 'react-icons/fa';
import SearchButton from "../Components/Button/SearchButton";
import Image from "../Components/Image/Image";


const HomePage = () => {
    var date = new Date();
    const [value, setValue] = useState(date);
    const [stationOne, setStationOne] = useState("stationOne");
    const [stationTwo, setStationTwo] = useState("stationTwo");
    // console.log(process.env.REACT_APP_STRIPE_KEY)


    return (
        <>
            <div className="Wrapper">
                <div className='Section'>
                    <p>
                        Trainify
                    </p>
                </div>

                <Image />
                <div className="PageHeader" >
                    <h1>Planera din resa </h1>
                </div>
                <form>
                    <div className="InputContainer">
                        <SearchStation
                            input="Från:"
                            setValue={setStationOne}
                        />
                        <div className="IconContainer">
                            <FaRegArrowAltCircleRight
                                className="Icon"
                                fontSize='43px'
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

                <div className='Separator' ></div>
            </div>
            {/* <StripePayment /> */}

        </>

    )
}
export default HomePage
