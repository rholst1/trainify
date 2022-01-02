// import React, { useState } from 'react';
// import StripeCheckout from 'react-stripe-checkout'
// import { json } from 'body-parser';
// import axios from 'axios'
import PaymentForm from './PaymentForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const StripePayment = (props) => {
  // const [product, setProduct] = useState({
  //     price: 10,
  // })

  // const makePayment = token => {
  //     const body = {
  //         token,
  //         product
  //     }
  //     const headers = {
  //         'Content-Type': 'application/json'
  //     }

  //     return axios.post('/payment', body, {
  //         headers: headers
  //     })
  //     .then(res => {
  //             console.log(res)
  //             const { status } = res;
  //             console.log(status)
  //         })
  //         .catch(error => console.log(error))
  // }
  const {sum, email, handlePurchase} = props;
  const s = loadStripe(`${process.env.REACT_APP_STRIPE_KEY}`);
  return (
    <>
      {/* <StripeCheckout
                stripeKey={process.env.REACT_APP_STRIPE_KEY}
                token={makePayment}
                name='By Ticket '
                label='Pay'
                
            >
                <button>{product.price}KR </button>
            </StripeCheckout> */}
      <div hidden= {email===''}>
        <Elements stripe={s}>
          <PaymentForm
          sum ={sum}
          email={email}
          handlePurchase = {handlePurchase}
          />
        </Elements>
      </div>
    </>
  );
};

export default StripePayment;
