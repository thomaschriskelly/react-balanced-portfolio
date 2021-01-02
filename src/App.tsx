import React, { useState } from 'react';
import './App.css';

function App() {
  const [canadianIndex, setCanadianIndex] = useState('');
  const [usaIndex, setUsaIndex] = useState('');
  const [canadianBondIndex, setCanadianBondIndex] = useState('');
  const [internationalIndex, setInternationalIndex] = useState('');
  const [amountToPurchase, setAmountToPurchase] = useState('');

  const canadianIndexNum = parseFloat(canadianIndex) || 0;
  const canadianBondIndexNum = parseFloat(canadianBondIndex) || 0;
  const usaIndexNum = parseFloat(usaIndex) || 0;
  const internationalIndexNum = parseFloat(internationalIndex) || 0;
  const currentTotal = canadianIndexNum + canadianBondIndexNum + usaIndexNum + internationalIndexNum;
  const amountToPurchaseNum = parseFloat(amountToPurchase) || 0;
  const newTotal = currentTotal + amountToPurchaseNum;
  const desiredPer = Math.floor(newTotal / 4);

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Portfolio Balancer
        </h1>

        <h3>Current market values</h3>
        <div>
          <label>
            Canadian Index (TDB900):
            <input type="text" value={canadianIndex} onChange={(e) => setCanadianIndex(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            USA Stocks (TDB902):
            <input type="text" value={usaIndex} onChange={(e) => setUsaIndex(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Canadian Bond Index (TDB909):
            <input type="text" value={canadianBondIndex} onChange={(e) => setCanadianBondIndex(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            International Index (TDB911):
            <input type="text" value={internationalIndex} onChange={(e) => setInternationalIndex(e.target.value)} />
          </label>
        </div>

        <h3>Amount to buy</h3>
        <label>
          <input type="text" value={amountToPurchase} onChange={(e) => setAmountToPurchase(e.target.value)} />
        </label>

        <h3>Therefore...</h3>
        <p>You currently have ${currentTotal.toLocaleString()} in your portfolio</p>
        <p>With buys, you will have ${newTotal.toLocaleString()} in your portfolio</p>
        <p>You want ${desiredPer.toLocaleString()} per fund</p>
        <p>Buy ${Math.floor(desiredPer - canadianIndexNum).toLocaleString()} Canadian index (TDB900)</p>
        <p>Buy ${Math.floor(desiredPer - usaIndexNum).toLocaleString()} USA index (TDB902)</p>
        <p>Buy ${Math.floor(desiredPer - canadianBondIndexNum).toLocaleString()} Canadian bond index (TDB909)</p>
        <p>Buy ${Math.floor(desiredPer - internationalIndexNum).toLocaleString()} International index (TDB911)</p>
      </header>
    </div>
  );
}

export default App;
