import React, { useState } from 'react';
import './App.css';

function App() {
  const [canadianStocks, setCanadianStocks] = useState('');
  const [canadianBonds, setCanadianBonds] = useState('');
  const [usaStocks, setUsaStocks] = useState('');
  const [intlStocks, setIntlStocks] = useState('');
  const [amountToPurchase, setAmountToPurchase] = useState('');

  const canadianStocksNum = parseFloat(canadianStocks) || 0;
  const canadianBondsNum = parseFloat(canadianBonds) || 0;
  const usaStocksNum = parseFloat(usaStocks) || 0;
  const intlStocksNum = parseFloat(intlStocks) || 0;
  const currentTotal = canadianStocksNum + canadianBondsNum + usaStocksNum + intlStocksNum;
  const amountToPurchaseNum = parseFloat(amountToPurchase)
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
            Canadian Stocks:
            <input type="text" value={canadianStocks} onChange={(e) => setCanadianStocks(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Canadian Bonds:
            <input type="text" value={canadianBonds} onChange={(e) => setCanadianBonds(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            USA Stocks:
            <input type="text" value={usaStocks} onChange={(e) => setUsaStocks(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Intl Stocks:
            <input type="text" value={intlStocks} onChange={(e) => setIntlStocks(e.target.value)} />
          </label>
        </div>

        <h3>Amount to purchase</h3>
        <label>
          <input type="text" value={amountToPurchase} onChange={(e) => setAmountToPurchase(e.target.value)} />
        </label>

        <h3>Therefore...</h3>
        <p>You currently have ${currentTotal} in your portfolio</p>
        <p>With deposit, you will have ${newTotal} in your portfolio</p>
        <p>You want ${desiredPer} per fund</p>
        <p>Deposit ${Math.floor(desiredPer - canadianStocksNum)} into Canadian Stocks</p>
        <p>Deposit ${Math.floor(desiredPer - canadianBondsNum)} into Canadian Bonds</p>
        <p>Deposit ${Math.floor(desiredPer - usaStocksNum)} into USA Stocks</p>
        <p>Deposit ${Math.floor(desiredPer - intlStocksNum)} into Intl Stocks</p>
      </header>
    </div>
  );
}

export default App;
