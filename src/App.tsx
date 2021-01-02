import React, { useState } from 'react';
import './App.css';

function App() {
  const [stocks, setStocks] = useState('');
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Portfolio Balancer
        </h1>

        <h3>Current Market Values</h3>
        <div>
          <label>
            Canadian Stocks:
            <input type="text" value={stocks} onChange={(e) => setStocks(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Canadian Bonds:
            <input type="text" value={stocks} onChange={(e) => setStocks(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            USA Stocks:
            <input type="text" value={stocks} onChange={(e) => setStocks(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Intl Stocks:
            <input type="text" value={stocks} onChange={(e) => setStocks(e.target.value)} />
          </label>
        </div>

        <h3>Amount to purchase</h3>
        <label>
          <input type="text" value={stocks} onChange={(e) => setStocks(e.target.value)} />
        </label>

        <h3>Therefore...</h3>
        <p>You want $x per fund</p>
        <p>Deposit $x into Canadian Stocks</p>
        <p>Deposit $x into Canadian Bonds</p>
        <p>Deposit $x into USA Stocks</p>
        <p>Deposit $x into Intl Stocks</p>
      </header>
    </div>
  );
}

export default App;
