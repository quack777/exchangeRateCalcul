import { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FirstCal from './pages/first/FirstCal';
import SecondCal from './pages/second/SecondCal';

const Router: FC = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FirstCal />}></Route>
          <Route path="/second" element={<SecondCal />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Router;
