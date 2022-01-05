import React, { useState } from 'react'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import axios from 'axios'
import PayButton from "../Button/PayButton";
import './PaymetForm.css'

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
                      <p className='ErrorColumn'>
                          {errorMessage}
                          </p>  
                <fieldset>
                    <div >
                        <CardElement onChange={() => setErrosMessage('')} />
                    </div>
                </fieldset>
                <div className='Paybtn'>
                    <PayButton
                        text='Pay'
                        handleOnClick={handleSubmit}
                    />
                </div>
            </form>
            {/* :
                <div>
                    <h2>Thanks for your order</h2>
                </div>  */}
            {/* } */}

        </>
    )
}
