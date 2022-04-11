import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { changeMoneyForm } from '../../utils/changeMoneyForm';
import { removeComma } from '../../utils/removeComma';

interface countrysInfoType {
  id: number;
  engName: string;
  krName: string;
}

const countrysInfo: countrysInfoType[] = [
  {
    id: 0,
    engName: 'KRW',
    krName: '한국',
  },
  {
    id: 1,
    engName: 'JPY',
    krName: '일본',
  },
  {
    id: 2,
    engName: 'PHP',
    krName: '필리핀',
  },
];

const FirstCal: FC = () => {
  const [exchangeRateInfo, setExchangeRateInfo] = useState<{ [key: string]: number }>();
  const [selectedCountry, setSelectedCountry] = useState<string>('KRW');
  const [curCountryExchangeRate, setCurCountryExchangeRate] = useState<number>();
  const [enterdedMoney, setEnterdedMoney] = useState<string>('');
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
    getExchangeRate(selectCountry);
    resetEnterdedMoney();
    resetAmountReceivable();
  };

  const getExchangeRate = (selectCountry: string) => {
    if (exchangeRateInfo) {
      const exchange = Number(exchangeRateInfo[`USD${selectCountry}`].toFixed(2));
      setCurCountryExchangeRate(exchange);
    }
  };

  const submitSendMoney = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (curCountryExchangeRate && enterdedMoney && enterdedMoney !== '0') {
      resetEnterdedMoney();
      setAmountReceivable(amountReceivableCalculate(curCountryExchangeRate, removeComma(enterdedMoney)));
    }
  };

  const amountReceivableCalculate = (exchangeRate: number, enterdedMoney: number): number => {
    return Number((exchangeRate * enterdedMoney).toFixed(2));
  };

  const handleChangeEnteredMoney = (e: ChangeEvent<HTMLInputElement>) => {
    const money: string = e.target.value;
    const removedMoney: number = removeComma(money);
    const maximumNum = 10000;
    if (money === ' ' || removedMoney < 0 || isNaN(removedMoney)) {
      resetEnterdedMoney();
    } else if (removedMoney > maximumNum) {
      setEnterdedMoney(maximumNum.toLocaleString());
      resetAmountReceivable();
    } else {
      setEnterdedMoney(removedMoney.toLocaleString());
      resetAmountReceivable();
    }
  };

  const resetAmountReceivable = () => {
    setAmountReceivable(null);
  };

  const resetEnterdedMoney = () => {
    setEnterdedMoney('0');
  };

  return (
    <FirstCalLayOut>
      <form onSubmit={submitSendMoney}>
        <p>송금국가: 미국(USD)</p>
        <SelectBoxLayout>
          <p>수취국가:</p>
          <select onChange={changeSelectCountry}>
            {countrysInfo.map((name) => {
              return <option key={name.id} value={name.engName}>{`${name.krName}(${name.engName})`}</option>;
            })}
          </select>
        </SelectBoxLayout>
        <p>
          환율: {curCountryExchangeRate && changeMoneyForm(curCountryExchangeRate)} {selectedCountry}/USD
        </p>
        <EnterdedMoneyLayout>
          <p>송금액:</p>
          <input type="text" value={enterdedMoney} onChange={handleChangeEnteredMoney} />
          <p>USD</p>
        </EnterdedMoneyLayout>
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
    </FirstCalLayOut>
  );
};

const FirstCalLayOut = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  margin-top: 100px;
  max-width: 1024px;
  width: 95%;
`;

const SelectBoxLayout = styled.div`
  display: flex;
  align-items: center;
`;

const EnterdedMoneyLayout = styled.div`
  display: flex;
  align-items: center;
`;

export default FirstCal;
