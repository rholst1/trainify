import { useState } from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  function pets() {
    fetch('/api/pets')
  }
  return (
    <div className="App">
      
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
       
          <button type="button" onClick={pets}>
            
          </button>
       
    </div>
  )
}

export default App
