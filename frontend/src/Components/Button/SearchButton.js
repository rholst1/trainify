import React from 'react'
import './SearchButton.css'

export default function SearchButton(props) {
    return (
        <>
            <button className='btnSearch'
            onClick = {props.handleOnClick}>
            {props.text}      
            </button>
        </>
    )
}
