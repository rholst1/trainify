import React, { useState } from 'react';
import StripeCheckout from 'react-stripe-checkout'



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

        return fetch('http://localhost:3001/payment', {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        }).then(res => {
            console.log(res)
            const { status } = res;
            console.log(status)
        })
            .catch(error => console.log(error))
    }

    return (
        <>
            <StripeCheckout
                stripeKey='pk_test_51K6WavLuMgncR3MOChxwZs8AmBuPekI45L0kvP16HW6TDuFKEojrJ1OjkEUWWJZLTnMCpBiUK9zY8UyshaJP2aTC00rVyiRaqm'
                token={makePayment}
                name='By Ticket '
            >
                <button>{product.price}KR </button>
            </StripeCheckout>
        </>
    )

}

export default StripePayment
