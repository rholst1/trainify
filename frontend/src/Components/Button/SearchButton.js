import React from 'react'
import './SearchButton.css'

export default function SearchButton(props) {
    
    function handleClick(e) {
        e.preventDefault();
        if(props.stationOne !== props.stationTwo) {

            props.setSearch(true)
            props.setStation('')
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
