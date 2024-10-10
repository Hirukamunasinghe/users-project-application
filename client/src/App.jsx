import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css'
import Home from './sections/Home';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
