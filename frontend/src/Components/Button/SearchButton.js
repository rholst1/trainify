import React from 'react'
import './SearchButton.css'

export default function SearchButton(props) {
    return (
        <>
            <button className='btnSearch'
                type={props.type}>
                {props.text}
            </button>
        </>
    )
}
