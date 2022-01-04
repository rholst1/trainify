import React from 'react'
import './SortButton.css'


export default function SortButton(props) {
  return (
    <>
      <button className='btnSort'
        onClick={props.handleOnClick}>
        {props.text}
      </button>
    </>
  )
}