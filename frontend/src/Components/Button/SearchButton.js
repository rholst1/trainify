import React from 'react'
import './SearchButton.css'

export default function SearchButton(props) {
    
    function handleClick(e) {
        e.preventDefault();
        props.setSearch(true)
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
