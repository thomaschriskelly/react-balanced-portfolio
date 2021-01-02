import React, { useState } from 'react';

interface Fund {
  name: string;
  code: string;
  amount: string;
  percent: string;
}

function App() {
  const [funds, setFunds] = useState<Fund[]>([
    { name: 'Canadian Index', code: 'TDB900', amount: '', percent: '25' },
    { name: 'USA Index', code: 'TDB902', amount: '', percent: '25' },
    { name: 'Canadian Bonds', code: 'TDB909', amount: '', percent: '25' },
    { name: 'International Index', code: 'TDB911', amount: '', percent: '25' },
  ]);
  const [amountToPurchase, setAmountToPurchase] = useState('');

  const currentTotal = funds.reduce(
    (previous, current) => previous + parseFloat(current.amount) || 0,
    0,
  );
  const totalPercent = funds.reduce(
    (previous, current) => previous + parseInt(current.percent) || 0,
    0,
  );
  const amountToPurchaseNum = parseFloat(amountToPurchase) || 0;
  const newTotal = currentTotal + amountToPurchaseNum;
  const desiredPer = Math.floor(newTotal / funds.length);

  const validTotalPercent = totalPercent === 100;

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Portfolio Balancer</h1>

      <h3>Current market values</h3>
      {funds.map((fund, index) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '400px' }}>
          <label>
            $ {fund.name} ({fund.code}):
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

      <h3>Desired breakdown</h3>
      {funds.map((fund, index) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '400px' }}>
          <label>
            % {fund.name} ({fund.code}):
          </label>
          <input
            type="text"
            value={fund.percent}
            onChange={(e) => {
              const newFunds = [...funds];
              newFunds[index].percent = e.target.value;
              setFunds(newFunds);
            }}
          />
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '400px' }}>
        <label>Total:</label>
        <span style={{ color: validTotalPercent ? undefined : 'red' }}>{totalPercent}%</span>
      </div>

      {validTotalPercent ? (
        <>
          <h3>Therefore...</h3>
          <p>You want ${desiredPer.toLocaleString()} per fund</p>
          {funds.map((fund) => (
            <p>
              Buy ${Math.floor(desiredPer - parseFloat(fund.amount) || 0).toLocaleString()} of{' '}
              {fund.name} ({fund.code})
            </p>
          ))}
        </>
      ) : null}
    </div>
  );
}

export default App;
