import React, { FC } from 'react';

const FirstCal: FC = () => {
  return (
    <form>
      <p>송금국가: 미국(USD)</p>
      <div>
        <p>수취국가:</p>
        <select>
          <option value="한국">한국</option>
          <option value="일본">일본</option>
          <option value="필리핀">필리핀</option>
        </select>
      </div>
      <p>환율: 1 KRW/USD</p>
      <div>
        <p>송금액:</p>
        <input type="number"></input>
        <p>USD</p>
      </div>
      <button>Submit</button>
    </form>
  );
};

export default FirstCal;
