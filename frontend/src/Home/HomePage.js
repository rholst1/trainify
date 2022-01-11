import StripePayment from '../Components/Stripe/StripePayment';
import React, { useState } from 'react';
import DatePicker from 'react-date-picker';
import './HomePage.css';
import SearchStation from '../Components/Search/SearchStation';
import { FaRegArrowAltCircleRight } from 'react-icons/fa';
import SearchButton from '../Components/Button/SearchButton';

import Image from '../Components/Image/Image';
import Booking from '../Components/Booking/Booking';
import { handle } from 'express/lib/application';

const HomePage = () => {
  var date = new Date();
  const [value, setValue] = useState(date);
  const [stationOne, setStationOne] = useState('Från:');
  const [stationTwo, setStationTwo] = useState('Till:');
  const [search, setSearch] = useState(false);
  const [station, setStation] = useState('');

  let today = new Date();

  return (
    <>
      <div className="Wrapper">
        <div className="Section"></div>
        <Image />
        {!search ? (
          <div>
            <div className="PageHeader">
              <h1>Planera din resa </h1>
            </div>

            <div className="InputContainer">
              <div className="Station1">   
                <SearchStation input={stationOne} setValue={setStationOne} />
              </div>
              <div className="IconContainer">
                <FaRegArrowAltCircleRight className="Icon" fontSize="43px" />
              </div>
              <div className="Station2"> 
                 <SearchStation input={stationTwo} setValue={setStationTwo} />
              </div>
            </div>

            <div className="DateTimeContainer">
              <DatePicker
                className="DateTime"
                onChange={setValue}
                value={value}
                locale="sv"
                minDate={today}
              />
            </div>
            <SearchButton
              text="Hitta Resa"
              setSearch={setSearch}
              stationOne={stationOne}
              stationTwo={stationTwo}
              setStation={setStation}
            />
          </div>
        ) : (
          <p></p>
        )}
        {search ? (
          <Booking
            fromStation={stationOne}
            toStation={stationTwo}
            d={value}
            setSearch={setSearch}
            setStation={setStation}
          />
        ) : (
          <div>
            <p>{station} </p>
          </div>
        )}
      </div>
    </>
  );
};
export default HomePage;
