import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { changeMoneyForm } from '../../utils/changeMoneyForm';

type exchangeRateInfo = {
  [index: string]: number;
  USDKRW: number;
  USDJPY: number;
  USDPHP: number;
};

const FirstCal: FC = () => {
  const [exchangeRateInfo, setExchangeRateInfo] = useState<exchangeRateInfo>();
  const [selectedCountry, setSelectedCountry] = useState<string>('KRW');
  const [curCountryExchangeRate, setCurCountryExchangeRate] = useState<number>();
  const [enterdedMoney, setEnterdedMoney] = useState<string>();
  const [amountReceivable, setAmountReceivable] = useState<number | null>(null);

  useEffect(() => {
    const getExchangeRateInfoApi = async () => {
      const data = await (await axios.get('/data/exchangeRate.json')).data;
      if (data.success) {
        setExchangeRateInfo(data.quotes);
        setCurCountryExchangeRate(data.quotes.USDKRW);
      }
    };
    getExchangeRateInfoApi();
  }, []);

  const changeSelectCountry = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectCountry = e.target.value;
    setSelectedCountry(selectCountry);
    if (exchangeRateInfo) {
      const exchange = Number(exchangeRateInfo[`USD${selectCountry}`].toFixed(2));
      setCurCountryExchangeRate(exchange);
    }

    resetEnterdedMoney();
    setAmountReceivable(null);
  };

  const sendMoney = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (curCountryExchangeRate && enterdedMoney && enterdedMoney !== '0') {
      resetEnterdedMoney();
      setAmountReceivable(amountReceivableCalcul(curCountryExchangeRate, removeCommaMoney(enterdedMoney)));
    }
  };

  const amountReceivableCalcul = (exchangeRate: number, enterdedMoney: number): number => {
    return Number((exchangeRate * enterdedMoney).toFixed(2));
  };

  const saveRemmit = (e: ChangeEvent<HTMLInputElement>) => {
    const money: string = e.target.value;
    const removedMoney: number = removeCommaMoney(money);
    const maximumNum = 10000;
    if (money === ' ' || removedMoney < 0 || isNaN(removedMoney)) {
      console.log('유효하지 않음');
      resetEnterdedMoney();
    } else if (removedMoney > maximumNum) {
      setEnterdedMoney(maximumNum.toLocaleString());
      setAmountReceivable(null);
    } else {
      setEnterdedMoney(removedMoney.toLocaleString());
      setAmountReceivable(null);
    }
  };

  const removeCommaMoney = (money: string): number => {
    return Number(money.replaceAll(',', ''));
  };

  const resetEnterdedMoney = () => {
    setEnterdedMoney('0');
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
          환율: {curCountryExchangeRate && changeMoneyForm(curCountryExchangeRate)} {selectedCountry}/USD
        </p>
        <div>
          <p>송금액:</p>
          <input type="text" value={enterdedMoney} onChange={saveRemmit} />
          <p>USD</p>
        </div>
        <button>Submit</button>
      </form>
      {amountReceivable && (
        <p>
          수취금액은 {changeMoneyForm(amountReceivable)}
          {selectedCountry}입니다.
        </p>
      )}
      <Link to="second">
        <button>second</button>
      </Link>
    </div>
  );
};

export default FirstCal;
