import { useState } from 'react';
import './App.css';
import Datepicker from './components/Datepicker';

const App = () => {
  const [date, setDate] = useState(() => new Date());
  return <Datepicker value={date} onChange={setDate} />;
};

export default App;
