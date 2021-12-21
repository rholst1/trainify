import React, { useState } from 'react'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import axios from 'axios'

export default function PaymentForm() {
    const [success, setSuccess] = useState(false)
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrosMessage] = useState('')

    const handleSubmit = async (e) => {
        console.log('hejsan')
        e.preventDefault();
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)
        })

        if (!error) {
            try {
                const { id } = paymentMethod;
                const response = await axios.post('/paymentTwo', {
                    amount: 1000,
                    id
                })
                if (response.data.success) {
                    console.log('success payment')
                    setSuccess(true)
                }
                return response
            } catch (error) {
                console.log('Error')

            }
        } else {
            setErrosMessage(error.message)
            console.log(error.message)
        }
    }
    return (
        <>
            {!success ?
                <form onSubmit={handleSubmit}>
                    <fieldset>
                        <div >
                            {errorMessage}
                            <CardElement onChange={() => setErrosMessage('')} />
                        </div>
                    </fieldset>
                    <button type='submit'>Pay</button>
                </form>
                :
                <div>
                    <h2>Thanks for your order</h2>
                </div>
            }

        </>
    )
}
