import React ,{useEffect,useState} from 'react';
import Table from './Table';
import './CurrencyConverter.css';

const CurrencyConverter = ({ currencies }) => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [selectedToCountry, setSelectedToCountry] = useState('India');
  const [selectedFromCountry, setSelectedFromCountry] = useState('United States of America');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHoverSection, setShowHoverSection] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.clientHeight;
    const scrollableHeight = documentHeight - windowHeight;
    const scrollPercent = (scrollPosition / scrollableHeight) * 100;

    setScrollPercent(scrollPercent);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const fetchExchangeRates = async (fromCurrency, toCurrency) => {
    try {
      setLoading(true);
      setError(null);

      const responseFrom = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
      const dataFrom = await responseFrom.json();
      const rateFrom = dataFrom.rates[toCurrency];

      if (!rateFrom) throw new Error('Invalid currency conversion.');

      const responseTo = await fetch(`https://open.er-api.com/v6/latest/${toCurrency}`);
      const dataTo = await responseTo.json();
      const rateTo = dataTo.rates[fromCurrency];

      if (!rateTo) throw new Error('Invalid currency conversion.');

      return { rateFrom, rateTo };
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetchExchangeRates(fromCurrency, toCurrency).then(rates => {
        if (rates) {
          setExchangeRate(rates.rateFrom);
        }
      });
    }
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (exchangeRate !== null) {
      setConvertedAmount((amount * exchangeRate).toFixed(3));
    }
  }, [amount, exchangeRate]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value >= 0) {
      setAmount(value);
      setError(null);
    } else {
      setError('Please enter a valid amount.');
    }
  };

  const handleCurrencyChange = (e, isFromCurrency) => {
    const selectedCode = e.target.options[e.target.selectedIndex].getAttribute('data-code');
    if (isFromCurrency) {
      setFromCurrency(e.target.value);
      setSelectedFromCountry(selectedCode);
    } else {
      setToCurrency(e.target.value);
      setSelectedToCountry(selectedCode);
    }
  };

  const toggleHoverSection = () => {
    setShowHoverSection(!showHoverSection);
  };

  const findCurrencyDetails = (country) => currencies.find(currency => currency.country === country);

  return (
    <div>
      <div className="top-bar">
        <div className="top-nav">
                <div className="nav-logo">Logo</div>
                <ul className="nav-links">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#services">Services</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
                <div className="scroll-indicator-container">
                    <div className="scroll-indicator-bar" style={{ width: `${scrollPercent}%` }}></div>
                </div>
            </div>
      </div>
      <div className="body">
        <div className="content">
        <div className='currency-converter'>
      <div className='p1' id="home">
        <div className='sub-p1'>
          <div className='cc'>
            <h1>CURRENCY CONVERTER</h1>
            <div className='input-row'>
              <label htmlFor="amount">Enter the Amount:</label>
              <input id="amount" type="number" value={amount} onChange={handleAmountChange} />
            </div>
            <div className='input-row'>
              <div className='inputc'>
                {selectedFromCountry && (
                  <div className='imgc'>
                    <img
                      src={`https://flagcdn.com/80x60/${findCurrencyDetails(selectedFromCountry)?.countryCode.toLowerCase()}.png`}
                      alt={`${selectedFromCountry} flag`}
                      width="40"
                      height="30"
                    />
                  </div>
                )}
                <select id="fromCurrency" value={fromCurrency} onChange={(e) => handleCurrencyChange(e, true)}>
                  {currencies.map(currency => (
                    <option key={currency.country} value={currency.code} data-code={currency.country}>{currency.country}</option>
                  ))}
                </select>
              </div>
              <div className='inputc'>
                {selectedToCountry && (
                  <div className='imgc'>
                    <img
                      src={`https://flagcdn.com/80x60/${findCurrencyDetails(selectedToCountry)?.countryCode.toLowerCase()}.png`}
                      alt={`${selectedToCountry} flag`}
                      width="40"
                      height="30"
                    />
                  </div>
                )}
                <select id="toCurrency" value={toCurrency} onChange={(e) => handleCurrencyChange(e, false)}>
                  {currencies.map(currency => (
                    <option key={currency.country} value={currency.code} data-code={currency.country}>{currency.country}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className='conversion-result'>
              {loading && <p>Loading...</p>}
              {error && <p>Error: {error}</p>}
              {exchangeRate && (
                <p>
                  {amount} {fromCurrency} = {convertedAmount} {toCurrency}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {selectedToCountry ? (
        <div className='P2' id="about">
          <div className='sub-p2'>
            <div className='country-info'>
              <p>Country: {findCurrencyDetails(selectedToCountry)?.country}</p>
              <p>Emergency Number: {findCurrencyDetails(selectedToCountry)?.emergencyNumber}</p>
              <p>Currency: {findCurrencyDetails(selectedToCountry)?.currency}</p>
              <p>Denominations:</p>
              <ul>
                {findCurrencyDetails(selectedToCountry)?.denominations.map(denomination => (
                  <li key={denomination}>{denomination}</li>
                ))}
              </ul>
              <button className='but' onClick={toggleHoverSection}>
                {showHoverSection ? "to view currency image" : "to view security features"}
              </button>
            </div>
            <div className='imagbackground'>
              {showHoverSection ?
                <img
                  src={`${findCurrencyDetails(selectedToCountry)?.imagec}.png`}
                  alt={`${findCurrencyDetails(selectedToCountry)?.country} Currency`}
                  className="currency-securityfeaturs"
                />
                :
                <img
                  src={`${findCurrencyDetails(selectedToCountry)?.image}.png`}
                  alt={`${findCurrencyDetails(selectedToCountry)?.country} Flag`}
                  className="currency-denomination" />
              }
            </div>
          </div>
        </div>
      ) : (
        <div className='P2-no'>
          <div className='sub-p2-no'></div>
        </div>
      )}
      <div className='p3' id='services'>
        <div className='sub-p3'>
          <Table />
        </div>
      </div>
      <div className='p4' id="contact">
        <div className='sub-p4'>
          {/* Contact form or information can go here */}
        </div>
      </div>
    </div>
        </div>
      </div>
    </div>

  );
};

export default CurrencyConverter;
