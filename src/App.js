import React from 'react';
import CurrencyConverter from './CurrencyConverter';
import { currencies } from './currencyData';

function App() {
  return (
    <div className="App">
      <CurrencyConverter currencies={currencies} />
    </div>
  );
}

export default App;
