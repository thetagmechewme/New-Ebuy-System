import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCheckout from '../Layout/StripeCheckout';
import '../stripe.css';

//load stripe outside of components render to avoid recreating stripe object on every render
const promise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const Payment = () => {
    return (
        <div className='container p-5 text-center'>
            <h3>Stripe Payment API</h3>
            <hr/>
            <h4>Complete your purchase</h4>
            <small>Use 4242 4242 4242 4242 (default US card) No authentication required.</small>
            <Elements stripe={promise}>
                <div className='col-md-8 offset-md-2'>
                    <br/>
                    <StripeCheckout />
                </div>
            </Elements>
        </div>
    );
};
export default Payment;
