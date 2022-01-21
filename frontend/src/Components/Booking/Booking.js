import React, { useEffect } from 'react'
import HomePage from '../../Home/HomePage';
import SearchButton from "../Button/SearchButton";
import SortButton from "../Button/SortButton";
import StripePayment from "../Stripe/StripePayment";
import { FaRegArrowAltCircleLeft } from 'react-icons/fa';
import './Booking.css';
import validator from 'validator'

class Booking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seats: [],
            info: '',
            infoString: '',
            selectedSeats: [],
            sortedSeats: [],
            sum: 0,
            email: '',
            emailError: '',
            error: false,
            didMount: false
        };
    }


    componentDidMount = () => {
        this.setState({
            seats: [],
            info: '',
            date: '',
            selectedSeats: [],
            sum: 0,
            email: '',
            error: false
        })
        var today = new Date();
        var day = this.formatDate(this.props.d)

        // if user is looking for tickets for today, then show only trains with departure time > now.
        // if user is looking for tickets for the following days, show all trains on that day
        if (this.formatDate(today) !== day) {
            day = day + ' 00:00';
        }
        else {
            day = day + ' ' + this.getTime(this.props.d);
        }

        var path = `/api/db/getunoccupiedseats?from='${this.props.fromStation}'&to='${this.props.toStation}'&day=${day}`;


        fetch(path)
            .then(response => response.json())
            .then(response => {
                this.setState({
                    seats: response
                })
                if (this.state.seats.length === 0) {
                    this.props.setSearch(false)
                    this.props.setStation('Inga resor för valt datum och stationer finns.')
                }
                else {
                    this.setState({
                        info: this.props.fromStation + " - " + this.props.toStation,
                        date: this.formatDate(this.props.d.toString()),
                        didMount: true
                    });
                    this.props.setSearch(true)
                    this.props.setStation('')
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
    handleCheck = (seatToCheck) => {
        seatToCheck.checked = !seatToCheck.checked;
        this.setState({
            seats: this.state.seats,
            selectedSeats: this.state.seats.filter(seat => seat.checked === true)
        });

        var totalSum = 0;
        this.state.seats.filter(seat => seat.checked === true).forEach(seat => {
            totalSum = totalSum + this.calculatePrice(seat.Price, seat.DepartureTime);
        });
        this.setState({
            sum: totalSum
        });
    }
    handleSortPriceAsc = () => {

        this.setState({
            seats: this.state.seats,
            sortedSeats: this.state.seats.sort(function (a, b) {
                return a.Price < b.Price ? -1 : 1;

            })
        });
    }

    handleSortPriceDesc = () => {

        this.setState({
            seats: this.state.seats,
            sortedSeats: this.state.seats.sort((a, b) => b.Price - a.Price)
        });
    }
    handleSortDepartureAsc = () => {

        this.setState({
            seats: this.state.seats,
            sortedSeats: this.state.seats.sort((a, b) => { return new Date(this.getJSDateString(a.DepartureTime)).getTime() - new Date(this.getJSDateString(b.DepartureTime)).getTime() })
        });

    }

    handleSortDepartureDesc = () => {

        this.setState({
            seats: this.state.seats,
            sortedSeats: this.state.seats.sort((a, b) => { return new Date(this.getJSDateString(b.DepartureTime)).getTime() - new Date(this.getJSDateString(a.DepartureTime)).getTime() })
        });

    }


    handlePurchase = async () => {
        var date = new Date(); 
        await Promise.all(
            this.state.selectedSeats.map(async(seat)=>{
                await fetch("/api/db/post/Ticket", {
                    "method": "POST",
                    "headers": {
                        "content-type": "application/json",
                        "accept": "application/json"
                    },
                    "body": JSON.stringify({
                        email: this.state.email,
                        ScheduleId: seat.ScheduleId,
                        Price: this.calculatePrice(seat.Price, seat.DepartureTime),
                        SeatGuid: seat.SeatGuid,
                        OrderId: this.state.email+'_'+this.formatDate(date)+'_'+this.getTime(date)
                    })
                })
                    .then(response => {
                        if (response.status !== 200) this.setState({ error: true });
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })    
        );

        this.sendConfirmation(this.state.email+'_'+this.formatDate(date)+'_'+this.getTime(date));

        
        if (this.state.error === true) {
            this.setState({
                infoString: 'Köpet har inte slutförts. Kontakta kundtjänst.',
                seats: [],
                selectedSeats: [],
                sum: 0,
                email: '',
                error: false
            });
        }
        else {
            this.setState({
                infoString: 'Köpet slutfört. Köpbekräftelse har skickats till ditt mejl.',
                seats: [],
                selectedSeats: [],
                sum: 0,
                email: '',
                error: false
            });
        }
    }

    // returns date in the format 'YYYY-MM-DD'
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    handleInputMailChange = (e) => {
        var email = e.target.value
        console.log(e)
        console.log(email)
        console.log(this.state.emailError)
        if (validator.isEmail(email)) {
            this.setState({
                emailError: 'Giltig e-postadress',
                email: email,
                error:false
            })
          } else {
            this.setState({
                emailError: 'Ange giltig e-postadress!',
                email: email,
                error: true
            })
          
          }

      
    }
    calculatePrice(basePrice, departure) {
        var today = new Date();
        var departureDate = new Date(this.getJSDateString(departure));

        var daysLeft = Math.round((departureDate - today) / (1000 * 60 * 60 * 24));
        var newPrice;
        if (daysLeft >= 90) {
            newPrice = Math.round(basePrice);
        }
        else {
            newPrice = Math.round(basePrice + (90 - daysLeft) / 90 * basePrice);
        }
        return newPrice;
    }
    // Extracts time from date,
    // t.ex. if date = '2022-02-01 07:05' getTime returns '07:05'
    getTime(date) {
        var dateCorrectFormat;
        if (typeof date === 'string') {
            dateCorrectFormat = this.getJSDateString(date);
        }
        else dateCorrectFormat = date;
        var dateObj = new Date(dateCorrectFormat);
        var hours = '' + dateObj.getHours();
        var minutes = '' + dateObj.getMinutes();

        if (hours.length < 2) hours = '0' + hours;
        if (minutes.length < 2) minutes = '0' + minutes;

        return [hours, minutes].join(':');
    }


    handleClick(e) {
        this.props.setSearch(false)
    }
    // T.ex. if departureDate= '2022-12-31 22:35' and arrivalDate= '2023-01-01 01:35'
    // getArrivalTime returns '01:35 (+1 dag)'
    getArrivalTime(departureDate, arrivalDate) {
        var departure = new Date(this.getJSDateString(departureDate));
        var arrival = new Date(this.getJSDateString(arrivalDate));
        var arrivalString = '' + this.getTime(arrivalDate);
        departure.setHours(0, 0, 0, 0);
        arrival.setHours(0, 0, 0, 0);
        var tripDuration = arrival.getTime() - departure.getTime();
        var days = tripDuration / 1000 / 60 / 60 / 24;
        if (days === 1) arrivalString = arrivalString + ' (+' + days + ' dag)';
        if (days > 1) arrivalString = arrivalString + ' (+' + days + ' dagar)';
        return arrivalString;
    }

    sendConfirmation(order){
        var path = `/api/db/gettickets?order=${order}`;
        fetch(path)
            .catch(err => {
                console.log(err);
            });
    }
    getJSDateString(date){
        return date.replace(" ", "T");
    }

    render() {
        return (
            <>
                {this.state.didMount ?
                    <div className='BookingWrapper'>
                        <div className='InfoCotainer'>
                            <div className='Back'>

                            
                            <button className='BackArrow' onClick={() => this.handleClick()}>{<FaRegArrowAltCircleLeft />}</button>
                            </div>
                            <p>{this.state.info}
                                
                                <p className='Date'>{this.state.date}</p>
                            </p>
                            
                        </div>
                        <div className="ResultWrapper">
                            <div className='ResultContainer' hidden={this.state.seats.length === 0}>
                                <div className='SortContainer'>
                                </div>
                                <table >
                                    <thead>
                                        <tr>
                                            <th></th>

                                            <div className='SortContainer'>
                                                <th>Avgång </th>
                                                <SortButton
                                                    text='▲'
                                                    handleOnClick={() => this.handleSortDepartureAsc()}
                                                />
                                                <SortButton
                                                    text='▼'
                                                    handleOnClick={() => this.handleSortDepartureDesc()}
                                                />

                                            </div>
                                            <th>Ankomst</th>
                                            <th>Tåg</th>
                                            <th>Vagn</th>
                                            <th>Plats</th>
                                            <div className='SortContainer'>
                                                <th>Pris</th>

                                                <SortButton
                                                    text='▲'
                                                    handleOnClick={() => this.handleSortPriceAsc()}
                                                />
                                                <SortButton
                                                    text='▼'
                                                    handleOnClick={() => this.handleSortPriceDesc()}
                                                />
                                            </div>
                                        </tr>

                                    </thead>
                                    <tbody>

                                        {this.state.seats.map(seat =>
                                            <tr key={"Guid" + seat.SeatGuid + "ScheduleId" + seat.ScheduleId}>
                                                <th>
                                                    <input
                                                        type="checkbox"
                                                        className="seat-checkbox"
                                                        id={"seat-" + seat.UniqueSeatId}
                                                        checked={seat.checked}
                                                        onChange={() => this.handleCheck(seat)}
                                                    />
                                                </th>

                                                <th><label className="seat-info" htmlFor={seat.checked}>{this.getTime(seat.DepartureTime)}</label></th>
                                                <th>{this.getArrivalTime(seat.DepartureTime, seat.ArrivalTime)}</th>
                                                <th>{seat.Name}</th>
                                                <th>{seat.WagonNr}</th>
                                                <th>{seat.SeatNr}</th>
                                                <th>{this.calculatePrice(seat.Price, seat.DepartureTime)}</th>

                                            </tr>

                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className='ViewContainer'>
                                <div>

                                    <p className='Text' >Översikt</p>
                                    {this.state.selectedSeats.map(seat =>
                                        <li key={"Guid" + seat.SeatGuid + "ScheduleId" + seat.ScheduleId}>
                                            {seat.DepartureTime}-{this.getArrivalTime(seat.DepartureTime, seat.ArrivalTime)}, Vagn {seat.WagonNr}, Plats {seat.SeatNr}, Pris {this.calculatePrice(seat.Price, seat.DepartureTime)}kr
                                        </li>
                                    )}
                                    <p className='Text'>Att betala: {this.state.sum} kr</p>
                                </div>

                                <div className='CardColumn' hidden={this.state.selectedSeats.length === 0}>
                                    <input className='EmailContainer' hidden={this.state.selectedSeats.length === 0}
                                        required
                                        type="mail"
                                        placeholder="example@gmail.com"
                                        value={this.state.email}
                                        onChange={e => this.handleInputMailChange(e)} />
                                        
                                    <p className='TextEmail'>{this.state.emailError}</p>

                                    <div hidden={this.state.error}>
                                        <StripePayment
                                            sum={this.state.sum}
                                            email={this.state.email}
                                            handlePurchase={() => this.handlePurchase()}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="purchaseinfo">{this.state.infoString}</p>
                    </div>
                    
                    :
                    <div></div>
                }


            </>
        )
    }
}
export default Booking