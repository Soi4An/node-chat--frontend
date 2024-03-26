import { formatNumber } from './formatNumber';

export const getValidateTime = (dateString: Date) => {
  const date = new Date(dateString);
  
  const hours: number = date.getHours();
  const mins: number = date.getMinutes();

  return formatNumber(hours) + ':' + formatNumber(mins);
};
