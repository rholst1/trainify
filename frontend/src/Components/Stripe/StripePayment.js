import PaymentForm from './PaymentForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './StripePayment.css'

const StripePayment = (props) => {
  const { sum, email, handlePurchase } = props;
  const s = loadStripe(`pk_test_51K6WavLuMgncR3MOChxwZs8AmBuPekI45L0kvP16HW6TDuFKEojrJ1OjkEUWWJZLTnMCpBiUK9zY8UyshaJP2aTC00rVyiRaqm`);
  return (
    <>
      <div hidden={email === ''}>
        <Elements stripe={s}>
          <PaymentForm
            sum={sum}
            email={email}
            handlePurchase={handlePurchase}
          />
        </Elements>
      </div>
    </>
  );
};

export default StripePayment;
