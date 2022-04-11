export const removeComma = (money: string): number => {
  return Number(money.replaceAll(',', ''));
};
