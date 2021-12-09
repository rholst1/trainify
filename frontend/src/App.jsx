import { useState,useEffect } from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  async function greeting() {
   
    let response = await fetch('/api/greeting')
   
  }

  return (
    <div className="App">
     <button onClick={greeting}>Click here</button>
    </div>
  )
}

export default App
