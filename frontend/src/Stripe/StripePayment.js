import React, { useState } from 'react';
import StripeCheckout from 'react-stripe-checkout'
import instance from '../Api/Axios';
import { json } from 'body-parser';
import axios from 'axios';



const StripePayment = () => {
    const [product, setProduct] = useState({
        price: 10,
    })

    const makePayment = token => {
        const body = {
            token,
            product
        }
        const headers = {
            'Content-Type': 'application/json'
        }

        return axios.post('/payment', body, {
            headers: headers
        })
        .then(res => {
                console.log(res)
                const { status } = res;
                console.log(status)
            })
            .catch(error => console.log(error))
    }
    // console.log(process.env.REACT_APP_STRIPE_KEY)
    return (
        <>
            <StripeCheckout
                stripeKey={process.env.REACT_APP_STRIPE_KEY}
                token={makePayment}
                name='By Ticket '
            >
                <button>{product.price}KR </button>
            </StripeCheckout>
        </>
    )

}

export default StripePayment
