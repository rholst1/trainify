import StripePayment from "../Components/Stripe/StripePayment";
import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import './HomePage.css';
import SearchStation from "../Components/Search/SearchStation";
import { FaRegArrowAltCircleRight } from 'react-icons/fa';
import SearchButton from "../Components/Button/SearchButton"

import Image from "../Components/Image/Image";
import Booking from "../Components/Booking/Booking";
import { handle } from "express/lib/application";

const HomePage = () => {
    var date = new Date();
    const [value, setValue] = useState(date);
    const [stationOne, setStationOne] = useState("stationOne");
    const [stationTwo, setStationTwo] = useState("stationTwo");
    const [search, setSearch] = useState(false)
    // console.log(process.env.REACT_APP_STRIPE_KEY)
    console.log(search)



    return (
        <>
            <div className="Wrapper">
                <div className='Section'>
                    <div>
                        <p>Trainify</p>
                    </div>
                    <div>
                        <img src="Train.png" alt="HEJSAN" height={'90px'} width={'300px'} />
                    </div>
                </div>
             
                <Image />
                {!search ?
                    <div>
                        <div className="PageHeader" >
                            <h1>Planera din resa </h1>
                        </div>

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
                        <SearchButton
                         text='Hitta Resa'
                         setSearch = {setSearch}
                         />
                    </div>
                    :
                    <p></p>
                }
                {search ?
                    <Booking
                        fromStation={stationOne}
                        toStation={stationTwo}
                        d={value}
                        setSearch={setSearch}
                    />
                    :
                <div></div>
                }
            </div>
        </>
    )
}
export default HomePage
