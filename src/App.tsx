import { useState } from 'react';
import './App.css';
import Datepicker from './components/Datepicker';

const App = () => {
  const [date, setDate] = useState(() => new Date());
  return (
    <Datepicker
      value={date}
      onChange={setDate}
      min={new Date(2022, 7, 0)}
      max={new Date(2022, 9, 0)}
    />
  );
};

export default App;
