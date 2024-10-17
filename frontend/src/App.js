import React from 'react';
import Header from './components/Header';
import AIForm from './components/AIForm';
import './styles/App.css'; 

function App() {
  return (
    <div className="App">
      <Header />
      <main className="App-main">
        <AIForm />
      </main>
    </div>
  );
}

export default App;
