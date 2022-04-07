import { FC } from 'react';
import FirstCal from './pages/first/FirstCal';
import SecondCal from './pages/second/SecondCal';

const App: FC = () => {
  return (
    <div className="App">
      <FirstCal />
      <SecondCal />
    </div>
  );
};

export default App;
