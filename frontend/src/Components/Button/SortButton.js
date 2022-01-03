import React from 'react'

// function Filter(props) {

//   return (
//     <div className="App">
//       <select onChange={(e) => setSortType(e.target.value)}>
//         <option value="tid">Filter</option>
//         <option value="members">Members</option>
//         <option value="formed">Formed in</option>
//       </select>

//       {data.map(band => (
//         <div key={band.id} style={{ margin: '30px' }}>
//           <select id="filter" onChange={(e) => setSortType(e.target.value)}> <option value="tid">Filter</option></select>
//           <div>{`Band: ${band.name}`}</div>
//           <div>{`Albums: ${band.albums}`}</div>
//           <div>{`Members: ${band.members}`}</div>
//           <div>{`Year of founding: ${band.formed_in}`}</div>
//         </div>
//       ))}
//     </div>
//   )
export default function SortButton(props) {
  return (
    <>
      <select className='btnSort'
        onChange={props.handleOnClick}>
        {props.text}
        <option value="tid">Tid</option>
        <option value="members">Tidigast Avgång</option>
        <option value="formed">Senaste Ankomst</option>
      </select>
    </>
  )
  }