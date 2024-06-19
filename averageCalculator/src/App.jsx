import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCalculateAverage = async (numberId) => {
    try {
      const response = await axios.get(`http://localhost:8000/numbers/${numberId}`);
      setResult(response.data);
      setError(null);
    } catch (error) {
      console.error('Error calculating average:', error);
      setError('An error occurred while calculating average.');
      setResult(null);
    }
  };

  return (
    <div>
      <h1>Average Calculator Microservice</h1>
      <button onClick={() => handleCalculateAverage('f')}>Calculate Fibonacci Average</button>
      <button onClick={() => handleCalculateAverage('e')}>Calculate Even Average</button>
      <button onClick={() => handleCalculateAverage('p')}>Calculate Prime Average</button>
      <button onClick={() => handleCalculateAverage('r')}>Calculate Random Average</button>
      
      {result && (
        <div>
          <p>Previous Window State: {result.windowPrevState.join(', ')}</p>
          <p>Current Window State: {result.windowCurrState.join(', ')}</p>
          <p>Numbers: {result.numbers.join(', ')}</p>
          <p>Average: {result.avg}</p>
        </div>
      )}
      
      {error && <p>{error}</p>}
    </div>
  );
};

export default App;
