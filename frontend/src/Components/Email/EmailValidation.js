import React, { useState } from 'react';
import HomePage from '../../Home/HomePage';
import Booking from '../Booking/Booking';
import './EmailValidation.css';
import StripePayment from '../Stripe/StripePayment';

const EmailValidation = (props) => {
  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const emailRegex = /\S+@\S+\.\S+/;

  const validateEmail = (event) => {
    const email = event.target.value;
    if (emailRegex.test(email)) {
      setIsValid(true);
      setEmail(email)
      setMessage('');
    } else {
      setIsValid(false);
      setMessage('Please enter a valid email!');
    }
  };
  return (
    <div className="container">
      <input
        type="email"
        placeholder="Enter your email"
        className="email-input"
        onChange={validateEmail}
      />

      {/*If the entered email is valid, the message will be blue, otherwise it will be red. */}
      <div className={`message ${isValid ? 'success' : 'error'}`}>
        {message}
      </div>
      <div >
        <StripePayment
        sum = {props.sum}
        email = {email}
       

        />
      </div>
    </div>
  );
}
export default EmailValidation;
