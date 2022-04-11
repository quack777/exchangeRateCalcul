export const changeMoneyForm = (money: number): string => {
  return money.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
