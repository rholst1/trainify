import React from "react";
import StripePayment from "../Stripe/StripePayment";

const HomePage = () => {

    return (
        <>
            Hello page
            <input typ="text"></input>
            <input typ="text"></input>

            <StripePayment/>
        </>
    )
}

export default HomePage