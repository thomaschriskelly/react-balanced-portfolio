import React, { useState } from 'react';

interface Fund {
  name: string;
  code: string;
  currentAmount: string;
  targetPercent: string;
}

function App() {
  const [funds, setFunds] = useState<Fund[]>([
    { name: 'Canadian Index', code: 'TDB900', currentAmount: '', targetPercent: '25' },
    { name: 'USA Index', code: 'TDB902', currentAmount: '', targetPercent: '25' },
    { name: 'Canadian Bonds', code: 'TDB909', currentAmount: '', targetPercent: '25' },
    { name: 'International Index', code: 'TDB911', currentAmount: '', targetPercent: '25' },
  ]);
  const [amountToPurchase, setAmountToPurchase] = useState('');

  const currentTotal = funds.reduce(
    (previous, current) => previous + parseFloat(current.currentAmount) || 0,
    0,
  );
  const totalPercent = funds.reduce(
    (previous, current) => previous + parseInt(current.targetPercent) || 0,
    0,
  );
  const validTotalPercent = totalPercent === 100;

  const amountToPurchaseNum = parseFloat(amountToPurchase) || 0;
  const newTotal = currentTotal + amountToPurchaseNum;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Portfolio Balancer</h1>

      <h3>Current market values</h3>
      {funds.map((fund, index) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '400px' }}>
          <label>
            $ {fund.name} ({fund.code}):
          </label>
          <input
            type="text"
            value={fund.currentAmount}
            onChange={(e) => {
              const newFunds = [...funds];
              newFunds[index].currentAmount = e.target.value;
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
            value={fund.targetPercent}
            onChange={(e) => {
              const newFunds = [...funds];
              newFunds[index].targetPercent = e.target.value;
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
          {funds.map((fund) => {
            const { currentAmount, targetPercent } = fund;
            const currentAmountFloat = parseFloat(currentAmount) || 0;
            const percentMultiplier = parseInt(targetPercent) / 100;
            const target = percentMultiplier * newTotal;
            return (
              <p>
                Buy $
                {(target - currentAmountFloat).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                of {fund.name} ({fund.code}) to hit $
                {target.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            );
          })}
        </>
      ) : null}
    </div>
  );
}

export default App;
