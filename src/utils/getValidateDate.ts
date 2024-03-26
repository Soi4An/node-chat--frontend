import { formatNumber } from './formatNumber';

export const getValidateDate = (dateString: Date) => {
  const date = new Date(dateString);
  const day: number = date.getDate();
  const month: number = date.getMonth() + 1;
  const year: number = date.getFullYear();

  return [formatNumber(day), formatNumber(month), year].join('.');
};
