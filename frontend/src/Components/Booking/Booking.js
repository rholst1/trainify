import React, { useEffect } from 'react'
import SearchButton from "../Button/SearchButton";
import SortButton from "../Button/SortButton";
import StripePayment from "../Stripe/StripePayment";
import './Booking.css';

class Booking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seats: [],
            info: '',
            selectedSeats: [],
            sortedSeats: [],
            sum: 0,
            email: '',
            error: false,
            didMount: false
        };
    }


    componentDidMount = () => {
        console.log('DENNA KÖRS')
        this.setState({
            seats: [],
            info: '',
            date: '',
            selectedSeats: [],
            sum: 0,
            email: '',
            error: false
        })
        var day = this.formatDate(this.props.d);
        var path = `/api/db/getunoccupiedseats?from='${this.props.fromStation}'&to='${this.props.toStation}'&day=${day}`;

        fetch(path)
            .then(response => response.json())
            .then(response => {
                this.setState({
                    seats: response
                })
                if (this.state.seats.length === 0) {
                    this.props.setSearch(false)
                    this.props.setStation('Inga resor för valt datum finns.')
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
            sortedSeats: this.state.seats.sort((a, b) => a.Price - b.Price)
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
            sortedSeats: this.state.seats.sort((a, b) => { return new Date(a.DepartureTime).getTime() - new Date(b.DepartureTime).getTime() }).reverse()
        });

    }

    handleSortDepartureDesc = () => {

        this.setState({
            seats: this.state.seats,
            sortedSeats: this.state.seats.sort((a, b) => { return new Date(b.DepartureTime).getTime() - new Date(a.DepartureTime).getTime() }).reverse()
        });

    }


    handlePurchase = () => {

        this.state.selectedSeats.forEach((seat) => {

            fetch("/api/db/post/Ticket", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json"
                },
                "body": JSON.stringify({
                    email: this.state.email,
                    ScheduleId: seat.ScheduleId,
                    Price: this.calculatePrice(seat.Price, seat.DepartureTime),
                    SeatGuid: seat.SeatGuid
                })
            })
                .then(response => {
                    console.log(response.status);
                    if (response.status !== 200) this.setState({ error: true });
                    var infoString = '';
                    if (this.state.error === true) {
                        infoString = 'Förlåt, köpet var inte slutfört. Kontakta kundtjänst.';
                    }
                    else {
                        infoString = 'Köpet slutfört. Köpbekräftelse har skickats till din email.';
                    }

                    this.setState({
                        seats: [],
                        info: infoString,
                        selectedSeats: [],
                        sum: 0,
                        email: '',
                        error: false
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        });
    }
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }
    handleInputMailChange = (event) => {
        this.setState({
            email: event.target.value
        });
    }
    calculatePrice(basePrice, departure) {
        var today = new Date();
        var departureDate = new Date(departure);

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
    render() {
        return (
            <>
                {this.state.didMount ?
                    <div className="ResultWrapper">
                        <div className='ResultContainer' hidden={this.state.seats.length === 0}>
                            <div className='InfoCotainer'>
                                <p>{this.state.info}
                                    <p className='Date'>{this.state.date}</p>
                                </p>
                            </div>
                            <div className='SortContainer'>
                                <SortButton
                                    text='Avgång 🔼'
                                    handleOnClick={() => this.handleSortDepartureDesc()}
                                />
                                <SortButton
                                    text='Avgång 🔽'
                                    handleOnClick={() => this.handleSortDepartureAsc()}
                                />
                                <SortButton
                                    text='Pris 🔽'
                                    handleOnClick={() => this.handleSortPriceAsc()}
                                />
                                <SortButton
                                    text='Pris 🔼'
                                    handleOnClick={() => this.handleSortPriceDesc()}
                                />

                            </div>
                            <form >
                                <div>

                                    <table >
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Avgång </th>
                                                <th>Ankomst</th>
                                                <th>Tåg</th>
                                                <th>Vagn</th>
                                                <th>Plats</th>
                                                <th>Pris</th>
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

                                                    <th><label className="seat-info" htmlFor={seat.checked}>{seat.DepartureTime}</label></th>
                                                    <th>{seat.ArrivalTime}</th>
                                                    <th>{seat.Name}</th>
                                                    <th>{seat.WagonNr}</th>
                                                    <th>{seat.SeatNr}</th>
                                                    <th>{this.calculatePrice(seat.Price, seat.DepartureTime)}</th>

                                                </tr>

                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </form>
                        </div>

                        <div className='ViewContainer'>
                            <p >Översikt</p>
                            {this.state.selectedSeats.map(seat =>
                                <li key={"Guid" + seat.SeatGuid + "ScheduleId" + seat.ScheduleId}>
                                    {seat.DepartureTime} - {seat.ArrivalTime} - Tåg: {seat.Name} - Vagn: {seat.WagonNr} - Plats: {seat.SeatNr}- Pris
                                    :  {this.calculatePrice(seat.Price, seat.DepartureTime)} kr
                                </li>
                            )}
                            <p>Att betala: {this.state.sum} kr</p>
                            <input hidden={this.state.selectedSeats.length === 0}
                                type="text"
                                placeholder="example@gmail.com"
                                value={this.state.email}
                                onChange={this.handleInputMailChange} />

                            <StripePayment
                                sum={this.state.sum}
                                email={this.state.email}
                                handlePurchase={() => this.handlePurchase()}
                            />
                        </div>
                    </div>
                    :
                    <div></div>
                }

            </>
        )
    }
}
export default Booking