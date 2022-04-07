import axios from 'axios';
import React, { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';

type exchangeRateInfo = {
  [index: string]: number;
  USDKRW: number;
  USDJPY: number;
  USDPHP: number;
};

const FirstCal: FC = () => {
  const [exchangeRateInfo, setExchangeRateInfo] = useState<exchangeRateInfo>();
  const [curSelectCountry, setCurSelectCountry] = useState<string>('KRW');
  const [curCountryExchangeRate, setCurCountryExchangeRate] = useState<number>();

  useEffect(() => {
    axios
      .get('/data/exchangeRate.json')
      .then((res) => {
        setExchangeRateInfo(res.data.quotes);
        setCurCountryExchangeRate(res.data.quotes.USDKRW);
      })
      .catch((err) => console.log(err));
  }, []);

  const changeSelectCountry = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectCountry = e.target.value;
    if (exchangeRateInfo) {
      const exchange = Number(exchangeRateInfo[`USD${selectCountry}`].toFixed(2));
      setCurCountryExchangeRate(exchange);
    }
    setCurSelectCountry(selectCountry);
  };

  const sendMoney = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      <form onSubmit={sendMoney}>
        <p>송금국가: 미국(USD)</p>
        <div>
          <p>수취국가:</p>
          <select onChange={changeSelectCountry}>
            <option value="KRW">한국(KRW)</option>
            <option value="JPY">일본(JPY)</option>
            <option value="PHP">필리핀(PHP)</option>
          </select>
        </div>
        <p>
          환율: {curCountryExchangeRate?.toLocaleString()} {curSelectCountry}/USD
        </p>
        <div>
          <p>송금액:</p>
          <input type="number" required></input>
          <p>USD</p>
        </div>
        <button>Submit</button>
      </form>
    </div>
  );
};

export default FirstCal;
