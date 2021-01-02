import React, { useState } from 'react';

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
    <div className="App" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Portfolio Balancer</h1>

      <h3>Current market values</h3>
      {funds.map((fund, index) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '400px' }}>
          <label>
            {fund.name} ({fund.code}):
          </label>
          <input
            type="text"
            value={fund.amount}
            onChange={(e) => {
              const newFunds = [...funds];
              newFunds[index].amount = e.target.value;
              setFunds(newFunds);
            }}
          />
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '400px' }}>
        <label>Total:</label>
        <span>${currentTotal.toLocaleString()}</span>
      </div>

      <h3>Amount to buy</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '400px' }}>
        <label>Amount in CAD</label>
        <input
          type="text"
          value={amountToPurchase}
          onChange={(e) => setAmountToPurchase(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '400px' }}>
        <label>New total:</label>
        <span>${newTotal.toLocaleString()}</span>
      </div>

      <h3>Therefore...</h3>
      <p>You want ${desiredPer.toLocaleString()} per fund</p>
      {funds.map((fund) => (
        <p>
          Buy ${Math.floor(desiredPer - parseFloat(fund.amount) || 0).toLocaleString()} of{' '}
          {fund.name} ({fund.code})
        </p>
      ))}
    </div>
  );
}

export default App;
