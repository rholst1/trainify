import React, { useState } from 'react'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import axios from 'axios'
import PayButton from "../Button/PayButton";
import './PaymetForm.css'

export default function PaymentForm(props) {
    const [success, setSuccess] = useState('')
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrosMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('')
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
                    setSuccess('Betalningen är genomförd')
                    props.handlePurchase();
                    document.getElementsByClassName('ResultContainer')[0].style.setProperty("display", "none")
                    document.getElementsByClassName('ViewContainer')[0].style.setProperty("display", "none")
                    document.getElementsByClassName('Date')[0].style.setProperty("display", "none")
                    
                }
                else {
                    setSuccess('Betalningen misslyckades')
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
            <div>
                <h2>{success}</h2>
            </div>
        </>
    )
}
