import React, { ChangeEvent, FC, useState } from 'react';
import styled from 'styled-components';

interface countrysInfo {
  id: number;
  engCountry: string;
}

const countrysInfo: countrysInfo[] = [
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
    engCountry: 'CNY ',
  },
];

const SecondCal: FC = () => {
  const [selectedStandardCountry, setSelectedStandardCountry] = useState<string>(countrysInfo[0].engCountry);
  const [clickedCountry, setClickedCountry] = useState<string>(countrysInfo[1].engCountry);

  const changeSelectedCountry = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    const selectedCountry = e.target.value;
    setSelectedStandardCountry(selectedCountry);
  };

  const changeClickedCountry = (e: React.MouseEvent<HTMLDivElement>) => {
    const elementTarget = e.target as Element;
    console.dir(elementTarget.innerHTML);
    setClickedCountry(elementTarget.innerHTML);
  };

  const acitveClickedCountry = (country: string): boolean => {
    return country === clickedCountry ? true : false;
  };

  return (
    <div>
      <section>
        <input type="number" />
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
          <p>CAD 2,000.00</p>
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
