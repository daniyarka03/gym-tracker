import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FitnessTracker from './pages/FitnessTracker'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <FitnessTracker />
    </>
  )
}

export default App
