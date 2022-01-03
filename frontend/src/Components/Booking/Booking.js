import React from 'react'
import SearchButton from "../Button/SearchButton";
import StripePayment from "../Stripe/StripePayment";
import './Booking.css';

class Booking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seats: [],
            info: '',
            selectedSeats: [],
            sum: 0,
            email: '',
            error: false
        };
        // this.handlePurchase = this.handlePurchase.bind(this);
        // this.handleSubmit =this.handleSubmit.bind(this);
        const sortTypes = {
            up: {
                class: 'sort-up',
                fn: (a, b) => a.Price - b.Price
            },
            down: {
                class: 'sort-down',
                fn: (a, b) => b.Price - a.Price
            },
            default: {
                class: 'sort',
                fn: (a, b) => a
            }
        };

    }

    handleSubmit = () => {

        this.setState({
            seats: [],
            info: '',
            selectedSeats: [],
            sum: 0,
            email: '',
            error: false
        })
        var day = this.formatDate(this.props.d);
        var path = "/api/db/getunoccupiedseats?from='" + this.props.fromStation + "'&to='" + this.props.toStation + "'&day=" + day;
        fetch(path)
            .then(response => response.json())
            .then(response => {
                this.setState({
                    seats: response
                })
                if (this.state.seats.length === 0) {
                    this.setState({
                        info: 'Förlåt. Det finns inga biljetter. Välj ett annat datum eller andra stationer.'
                    });
                }
                else {
                    this.setState({
                        info: this.props.fromStation + "-" + this.props.toStation + "-" + this.formatDate(this.props.d.toString())
                    });
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
                <SearchButton
                    text='Hitta resa'
                    handleOnClick={() => this.handleSubmit()}
                />
                {/* <button onClick={this.handleSubmit}>Hitta resa</button> */}
                <div className="Results">{this.state.info}</div>
                <div className="Results" hidden={this.state.seats.length === 0}>
                    <form className="Results">


                        <table className="Results">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>DepartureTime</th>
                                    <th>ArrivalTime</th>
                                    <th>Name</th>
                                    <th>WagonNr</th>
                                    <th>SeatNr</th>
                                    <th>Price</th>
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
                        <div>
                            <p className="Results">Översikt</p>
                            {this.state.selectedSeats.map(seat =>
                                <li key={"Guid" + seat.SeatGuid + "ScheduleId" + seat.ScheduleId}>
                                    {seat.DepartureTime} - {seat.ArrivalTime} - Tåg: {seat.Name} - Wagon: {seat.WagonNr} - Seat: {seat.SeatNr}- Price: {this.calculatePrice(seat.Price, seat.DepartureTime)} kr
                                </li>
                            )}
                            <p>Att betala: {this.state.sum} kr</p>
                        </div>
                    </form>
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
                    {/* <button onClick={this.handlePurchase} hidden={this.state.email === ''}>Köp</button> */}
                </div>
            </>
        )
    }
}
export default Booking