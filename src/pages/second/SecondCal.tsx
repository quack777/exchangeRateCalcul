import React, { FC, useState } from 'react';

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

  return (
    <div>
      <section>
        <input />
        <select>
          {countrysInfo.map((country) => {
            return <option key={country.id}>{country.engCountry}</option>;
          })}
        </select>
      </section>
      <section>
        {countrysInfo.map((country) => {
          return <div key={country.id}>{country.engCountry}</div>;
        })}
        <div>
          <p>CAD 2,000.00</p>
          <p>기준일:</p>
          <p>2022</p>
        </div>
      </section>
    </div>
  );
};

export default SecondCal;
