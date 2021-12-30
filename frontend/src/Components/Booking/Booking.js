import React from 'react'
import SearchButton from "../Button/SearchButton";
import StripePayment from "../Stripe/StripePayment";

class Booking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seats: [],
            info: '',
            selectedSeats: [],
            sum: 0,
            email: ''
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({
            info: ''
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
    }
    handlePurchase = (event) => {
        event.preventDefault();
        this.state.selectedSeats.forEach(seat => {

            fetch("/api/db/post/Ticket", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json"
                },
                "body": JSON.stringify({
                    email: this.state.email,
                    ScheduleId: seat.ScheduleId,
                    Price: 10,
                    SeatGuid: seat.SeatGuid
                })
            })
                .then(response => response.json())
                .then(response => {
                    console.log(response)
                })
                .catch(err => {
                    console.log(err);
                });
        });

        this.setState({
            seats: [],
            info: 'Köpet slutfört. Köpbekräftelse har skickats till din email.',
            selectedSeats: [],
            sum: 0,
            email: ''
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
    render() {
        return (
            <>
                {/* SearchButton: onClick doesn't work, use the usual button for now */}
                {/* <SearchButton
                            type='submit'
                            text='Hitta resa'
                            onClick={this.handleSubmit}
                        /> */}
                <button onClick={this.handleSubmit}>Hitta resa</button>
                <div>{this.state.info}</div>
                <div className="Wrapper" hidden={this.state.seats.length === 0}>
                    <form>


                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>DepartureTime</th>
                                    <th>ArrivalTime</th>
                                    <th>Name</th>
                                    <th>WagonNr</th>
                                    <th>SeatNr</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.seats.map(seat =>
                                    <tr key={seat.UniqueSeatId}>
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

                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div>
                            <p>Översikt</p>
                            {this.state.selectedSeats.map(seat =>
                                <li key={"Guid" + seat.SeatGuid + "ScheduleId" + seat.ScheduleId}>
                                    {seat.DepartureTime} - {seat.ArrivalTime} - Tåg: {seat.Name} - Wagon: {seat.WagonNr} - Seat: {seat.SeatNr}
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
                    />
                    <button onClick={this.handlePurchase} hidden={this.state.email === ''}>Köp</button>
                </div>
            </>
        )
    }
}
export default Booking