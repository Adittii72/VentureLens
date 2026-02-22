import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Companies from './components/Companies';
import SavedList from './components/SavedList';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <About />
      <Companies />
      <SavedList />
    </div>
  );
}

export default App;
