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
  const [remmit, setRemmit] = useState<string>();
  const [amountReceivable, setAmountReceivable] = useState<number>();

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
    console.log(remmit);
    // setRemmit('');
    if (curCountryExchangeRate && remmit) {
      setAmountReceivable(amountReceivableCalcul(curCountryExchangeRate, removeCommaMoney(remmit)));
    }
  };

  const amountReceivableCalcul = (exchangeRate: number, remmit: number): number => {
    return Number((exchangeRate * remmit).toFixed(2));
  };

  const saveRemmit = (e: ChangeEvent<HTMLInputElement>) => {
    const money: string = e.target.value;
    const removedMoney: number = removeCommaMoney(money);
    if (money === ' ' || isNaN(removedMoney) || removedMoney < 0 || removedMoney > 10000) {
      console.log('유효하지 않음');
    } else {
      setRemmit(Number(removedMoney).toLocaleString());
    }
  };

  const removeCommaMoney = (money: string): number => {
    return Number(money.replaceAll(',', ''));
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
          <input type="text" value={remmit} onChange={saveRemmit} />
          <p>USD</p>
        </div>
        <button>Submit</button>
      </form>
      {amountReceivable && (
        <p>
          수취금액은 {amountReceivable.toLocaleString()}
          {curSelectCountry}입니다.
        </p>
      )}
    </div>
  );
};

export default FirstCal;
