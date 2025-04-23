import React, { useState } from 'react';

function App() {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Simple Input Box</h2>
      <input 
        type="text" 
        value={inputValue} 
        onChange={handleChange} 
        placeholder="Type something..."
      />
      <p>You typed: {inputValue}</p>
    </div>
  );
}

export default App;