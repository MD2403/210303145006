import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

let storedNumbers = [];
const windowSize = 10;

const calculateAverage = (numbers) => {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
};

app.get('/numbers/{numberid}', async (req, res) => {
  const { numberid } = req.params;

  try {
    let numbers = [];

    if (numberid === 'f') {
      const response = await axios.get('https://20.244.56.144/test/fibo');
      numbers = response.data.numbers;
    } else if (numberid === 'e') {
      const response = await axios.get('https://20.244.56.144/test/even');
      numbers = response.data.numbers;
    } else if (numberid === 'p') {
      const response = await axios.get('https://20.244.56.144/test/primes');
      numbers = response.data.numbers;
    } else if (numberid === 'r') {
      const response = await axios.get('https://20.244.56.144/test/rand');
      numbers = response.data.numbers;
    } else {
      return res.status(400).json({ error: 'Invalid number ID' });
    }

    numbers = numbers.filter((num) => !storedNumbers.includes(num));

    if (numbers.length === 0) {
      return res.status(400).json({ error: 'No new numbers fetched' });
    }

    storedNumbers = [...storedNumbers, ...numbers].slice(-windowSize);

    const avg = storedNumbers.length === windowSize ? calculateAverage(storedNumbers) : null;

    const responseObj = {
      windowPrevState: storedNumbers.slice(0, -numbers.length),
      windowCurrState: storedNumbers,
      numbers: numbers,
      avg: avg.toFixed(2), 
    };
    
    res.json(responseObj);
    
  } catch (error) {
    console.error('Error fetching numbers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
