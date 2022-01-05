import React from 'react'
import './PayButton.css'

export default function PayButton(props) {
    
    return (
        <>
            <button className='btnPay'
            >
            {props.text}      
            </button>
        </>
    )
}