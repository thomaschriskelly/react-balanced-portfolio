import React, { useState } from 'react';
import './App.css';

interface Fund {
  name: string;
  code: string;
  amount: string;
}

function App() {
  const [funds, setFunds] = useState<Fund[]>([
    { name: 'Canadian Index', code: 'TDB900', amount: '' },
    { name: 'USA Index', code: 'TDB902', amount: '' },
    { name: 'Canadian Bonds', code: 'TDB909', amount: '' },
    { name: 'International Index', code: 'TDB911', amount: '' },
  ]);
  const [amountToPurchase, setAmountToPurchase] = useState('');

  const currentTotal = funds.reduce(
    (previous, current) => previous + parseFloat(current.amount) || 0,
    0,
  );
  const amountToPurchaseNum = parseFloat(amountToPurchase) || 0;
  const newTotal = currentTotal + amountToPurchaseNum;
  const desiredPer = Math.floor(newTotal / funds.length);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Portfolio Balancer</h1>

        <h3>Current market values</h3>
        {funds.map((fund, index) => (
          <div>
            <label>
              {fund.name} ({fund.code}):
              <input
                type="text"
                value={fund.amount}
                onChange={(e) => {
                  const amount = e.target.value;
                  const newFunds = [...funds];
                  newFunds[index].amount = amount;
                  setFunds(newFunds);
                }}
              />
            </label>
          </div>
        ))}
        <h3>Amount to buy</h3>
        <label>
          <input
            type="text"
            value={amountToPurchase}
            onChange={(e) => setAmountToPurchase(e.target.value)}
          />
        </label>

        <h3>Therefore...</h3>
        <p>You currently have ${currentTotal.toLocaleString()} in your portfolio</p>
        <p>After buys, you will have ${newTotal.toLocaleString()} in your portfolio</p>
        <p>You want ${desiredPer.toLocaleString()} per fund</p>
        {funds.map((fund) => (
          <p>
            Buy ${Math.floor(desiredPer - parseFloat(fund.amount) || 0).toLocaleString()} of{' '}
            {fund.name} ({fund.code})
          </p>
        ))}
      </header>
    </div>
  );
}

export default App;
