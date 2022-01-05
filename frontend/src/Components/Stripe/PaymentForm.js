import React, { useState } from 'react'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import axios from 'axios'
import PayButton from "../Button/PayButton";

export default function PaymentForm(props) {
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
                    amount: props.sum,
                    id
                })
                if (response.data.success) {
                    console.log('success payment')
                    setSuccess(true)
                    props.handlePurchase();
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
            {/* {!success ? */}
                <form onSubmit={handleSubmit}>
                    <fieldset>
                        <div >
                            {errorMessage}
                            <CardElement onChange={() => setErrosMessage('')} />
                        </div>
                    </fieldset>
                    <PayButton
                            text='Pay'
                            handleOnClick = {handleSubmit}
                        />
                </form>
                {/* :
                <div>
                    <h2>Thanks for your order</h2>
                </div>  */}
            {/* } */}

        </>
    )
}
