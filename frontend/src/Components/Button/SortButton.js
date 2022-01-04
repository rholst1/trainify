import React from 'react'


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