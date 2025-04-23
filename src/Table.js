import React, { useState, useEffect } from 'react';
import './Table.css';

const App = () => {
  const countryData = {
    AUD: { name: "Australia", code: "AUD" },
    CAD: { name: "Canada", code: "CAD" },
    USD: { name: "United States", code: "USD" },
    CNY: { name: "China", code: "CNY" },
    JPY: { name: "Japan", code: "JPY" },
    EUR: { name: "Eurozone", code: "EUR" },
    INR: { name: "India", code: "INR" },
    GBP: { name: "United Kingdom", code: "GBP" },
    RUB: { name: "Russia", code: "RUB" },
    SGD: { name: "Singapore", code: "SGD" }
  };
  const countryCodes = Object.keys(countryData);

  const formatExchangeRate = (rate) => {
    return rate !== null ? rate.toFixed(2) : '-';
  };

  const calculateExchangeData = (countryCodes, rates) => {
    return countryCodes.map(baseCurrency =>
      countryCodes.map(targetCurrency => ({
        from: `${countryData[baseCurrency].name} (${countryData[baseCurrency].code})`,
        to: `${countryData[targetCurrency].name} (${countryData[targetCurrency].code})`,
        rate: baseCurrency !== targetCurrency ? rates[targetCurrency] / rates[baseCurrency] : null
      }))
    );
  };

  const [exchangeRates, setExchangeRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (!response.ok) {
          throw new Error('Failed to fetch exchange rates');
        }
        const data = await response.json();
        const rates = data.rates;
        const exchangeData = calculateExchangeData(countryCodes, rates);
        setExchangeRates(exchangeData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        setError('Failed to fetch exchange rates. Please try again later.');
        setLoading(false);
      }
    };

    // Fetch data only if exchangeRates is empty (first load)
    if (exchangeRates.length === 0) {
      fetchExchangeRates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="App">
      <table aria-label="Exchange Rates">
        <thead>
          <tr>
            <th>From/To</th>
            {exchangeRates.length > 0 && exchangeRates[0].map((exchangeRate, index) => (
              <th key={`${exchangeRate.to}-${index}`}>{exchangeRate.to}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {exchangeRates.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{row[0].from}</td>
              {row.map((exchangeRate, index) => (
                <td key={`${index}-${rowIndex}`}>{index === rowIndex ? '-' : formatExchangeRate(exchangeRate.rate)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
