import React from 'react'
import './SearchButton.css'

export default function SearchButton(props) {
    
    function handleClick(e) {
        e.preventDefault();
        if(props.stattionOne !== props.stattionOne) {

            props.setSearch(true)
        }
        else{
            props.setStation('Resemålen för vald resa är samma avgång som destination')
        }
    }
    return (
        <>
            <button className='btnSearch'
            onClick = {handleClick}
            >
            {props.text}      
            </button>
        </>
    )
}
