import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

function App() {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [exchangeRates, setExchangeRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchTimer, setFetchTimer] = useState(null);

  useEffect(() => {
    fetchExchangeRates();
  }, [baseCurrency, targetCurrency]);

  const fetchExchangeRates = async () => {
    setLoading(true);
    setError(null);

    try {
      const dates = getPastDates(10);
      const rates = await Promise.all(dates.map(date => fetchExchangeRate(date)));
      setExchangeRates(rates);
      renderChart(rates);
    } catch (error) {
      setError('Error fetching exchange rates');
      console.error('Error fetching exchange rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExchangeRate = async (date) => {
    const formattedDate = formatDate(date);
    const response = await fetch(`https://api.freecurrencyapi.com/v1/historical?apikey=fca_live_op69xUMjDs75FxKCtCrXtlP8Jc0o1R5SbpZyzFN2&currencies=${targetCurrency}&base=${baseCurrency}&date=${formattedDate}`);
    const data = await response.json();
    return {
      date: formattedDate,
      rate: data.data[formattedDate][targetCurrency]
    };
  };

  const getPastDates = (days) => {
    const dates = [];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    for (let i = 0; i < days; i++) {
      const date = new Date(yesterday);
      date.setDate(yesterday.getDate() - i);
      dates.push(date);
    }
    return dates.reverse();
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const renderChart = (rates) => {
    const ctx = document.getElementById('exchangeRateChart');
    if (window.myChart) {
      window.myChart.destroy();
    }
    window.myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: rates.map(rate => rate.date),
        datasets: [{
          label: `Exchange Rate (${baseCurrency} to ${targetCurrency})`,
          data: rates.map(rate => rate.rate),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
  };

  const handleBaseCurrencyChange = (e) => {
    setBaseCurrency(e.target.value);
    clearTimeout(fetchTimer);
    const timer = setTimeout(fetchExchangeRates, 300);
    setFetchTimer(timer);
  };

  const handleTargetCurrencyChange = (e) => {
    setTargetCurrency(e.target.value);
    clearTimeout(fetchTimer);
    const timer = setTimeout(fetchExchangeRates, 300);
    setFetchTimer(timer);
  };

  return (
    <div className="App">
      <h1>Currency Exchange Rates for Past 10 Days</h1>
      {error && <p>Error: {error}</p>}
      <label>
        Base Currency:
        <select value={baseCurrency} onChange={handleBaseCurrencyChange}>
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="INR">INR</option>
          {/* Add more currency options if needed */}
        </select>
      </label>
      <label>
        Target Currency:
        <select value={targetCurrency} onChange={handleTargetCurrencyChange}>
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="INR">INR</option>
          {/* Add more currency options if needed */}
        </select>
      </label>
      <canvas id="exchangeRateChart" width="400" height="200"></canvas>
    </div>
  );
}

export default App;