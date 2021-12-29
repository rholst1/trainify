import React from 'react'
import SearchButton from "../Button/SearchButton";


class Booking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seats: [],
            info: ''
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();

        var day = this.formatDate(this.props.d);
        var path = "/api/db/getunoccupiedseats?from='" + this.props.fromStation + "'&to='" + this.props.toStation + "'&day=" + day;
        console.log(path);
        fetch(path)
            .then(response => response.json())
            .then(response => {
                this.setState({
                    seats: response,
                    info: this.props.fromStation + "-" + this.props.toStation + "-" + this.formatDate(this.props.d.toString())
                })
            })
            .catch(err => {
                console.log(err);
            });

    }
    handleCheck = (seatToCheck) => {
        seatToCheck.checked = !seatToCheck.checked;
        this.setState({
            seats: this.state.seats
        });
    }
    handlePurchase = (event) => {
        event.preventDefault();
        this.state.seats.forEach(seat => {
            console.log(seat.checked);

            if (seat.checked === true) {
                fetch("/api/db/post/Ticket", {
                    "method": "POST",
                    "headers": {
                        "content-type": "application/json",
                        "accept": "application/json"
                    },
                    "body": JSON.stringify({
                        email: "frontend@test.com",
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
            }
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
    render() {
        return (
            <>
                <div className="Wrapper">
                    <form>
                        {/* SearchButton: onClick doesn't work, use the usual button for now */}
                        {/* <SearchButton
                            type='submit'
                            text='Hitta resa'
                            onClick={this.handleSubmit}
                        /> */}
                        <button onClick = {this.handleSubmit}>Hitta resa</button>
                        
                        <div>{this.state.info}</div>
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

                        <button onClick={this.handlePurchase}>Köp</button>
                    </form>
                </div>
            </>
        )
    }
}
export default Booking