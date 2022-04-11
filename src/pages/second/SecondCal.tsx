import axios from 'axios';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { changeMoneyForm } from '../../utils/changeMoneyForm';

interface countrysInfoType {
  id: number;
  engCountry: string;
}

const countrysInfo: countrysInfoType[] = [
  {
    id: 0,
    engCountry: 'USD',
  },
  {
    id: 1,
    engCountry: 'CAD',
  },
  {
    id: 2,
    engCountry: 'KRW',
  },
  {
    id: 3,
    engCountry: 'HKD',
  },
  {
    id: 4,
    engCountry: 'JPY',
  },
  {
    id: 5,
    engCountry: 'CNY',
  },
];

const SecondCal: FC = () => {
  const [selectedStandardCountry, setSelectedStandardCountry] = useState<string>(countrysInfo[0].engCountry);
  const [clickedCountry, setClickedCountry] = useState<string>(countrysInfo[1].engCountry);
  const [enterdedAmount, setEnterdedAmount] = useState<string>();
  const [exchangeRateQuotes, setExchangeRateQuotes] = useState<{ [key: string]: number }>();
  const [calculatedAmount, setCalculatedAmount] = useState<number>(0);

  useEffect(() => {
    const getExchangeRateInfoApi = () => {
      axios
        .get('/data/data.json')
        .then((res) => {
          console.log(res.data);
          setExchangeRateQuotes(res.data.quotes);
        })
        .catch((err) => console.log(err));
    };
    getExchangeRateInfoApi();
  }, []);

  const changeSelectedCountry = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = e.target.value;
    setSelectedStandardCountry(selectedCountry);
    setClickedCountry(
      selectedCountry === countrysInfo[0].engCountry ? countrysInfo[1].engCountry : countrysInfo[0].engCountry,
    );
    enterdedAmount && setEnterdedAmount('0');
  };

  const changeClickedCountry = (e: React.MouseEvent<HTMLDivElement>) => {
    const elementTarget = e.target as Element;
    setClickedCountry(elementTarget.innerHTML);
    enterdedAmount && setEnterdedAmount('0');
  };

  const acitveClickedCountry = (country: string): boolean => {
    return country === clickedCountry ? true : false;
  };

  const changeEnterdedAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const money: string = e.target.value;
    const removedCommaMoney = Number(money.replaceAll(',', ''));
    if (removedCommaMoney > 1000) {
      return setEnterdedAmount('1,000');
    }
    if (money === ' ' || removedCommaMoney < 0) {
      // console.log("유효하지 않음");
    } else {
      setEnterdedAmount(removedCommaMoney.toLocaleString());
    }
  };

  const sendMoneyCalculate = () => {
    const removedCommaMoney = Number(Number(enterdedAmount?.replaceAll(',', '')).toFixed(2));
    if (exchangeRateQuotes) {
      if (selectedStandardCountry === 'USD') {
        const exchangeRate = Number(exchangeRateQuotes[`${selectedStandardCountry}${clickedCountry}`].toFixed(2));
        setCalculatedAmount(exchangeRate * removedCommaMoney);
      } else if (clickedCountry === 'USD') {
        const exchangeRate = Number(exchangeRateQuotes[`${clickedCountry}${selectedStandardCountry}`].toFixed(2));
        setCalculatedAmount((1 / exchangeRate) * removedCommaMoney);
      } else {
        const standardCountryExchangeRate = Number(exchangeRateQuotes[`USD${selectedStandardCountry}`].toFixed(2));
        const clickedCountryExchangeRate = Number(exchangeRateQuotes[`USD${clickedCountry}`].toFixed(2));
        setCalculatedAmount((clickedCountryExchangeRate / standardCountryExchangeRate) * removedCommaMoney);
      }
    }
  };

  useEffect(() => {
    sendMoneyCalculate();
  }, [enterdedAmount]);

  return (
    <div>
      <section>
        <input type="text" value={enterdedAmount} onChange={changeEnterdedAmount} />
        <select onChange={changeSelectedCountry}>
          {countrysInfo.map((country) => {
            return <option key={country.id}>{country.engCountry}</option>;
          })}
        </select>
      </section>
      <ExchangeRateInfoBox>
        <CountrysBox>
          {countrysInfo.map((country) => {
            return country.engCountry !== selectedStandardCountry ? (
              <CountryClickBox
                key={country.id}
                onClick={changeClickedCountry}
                active={acitveClickedCountry(country.engCountry)}
              >
                {country.engCountry}
              </CountryClickBox>
            ) : null;
          })}
        </CountrysBox>
        <div>
          <p>
            {clickedCountry} {changeMoneyForm(calculatedAmount)}
          </p>
          <p>기준일:</p>
          <p>2022</p>
        </div>
      </ExchangeRateInfoBox>
    </div>
  );
};

const ExchangeRateInfoBox = styled.section`
  width: 150px;
  height: 150px;
`;

const CountrysBox = styled.div`
  display: flex;
`;

const CountryClickBox = styled.div<{ active: boolean }>`
  border: 1px solid black;
  background-color: ${({ active }) => active && 'red'};
  border-bottom: ${({ active }) => active && '0px'};
`;

export default SecondCal;
