import { Message } from '../types/Message';
import { getValidateDate } from './getValidateDate';

export function getChipDateContent(messages: Message[], currInd: number) {
  const currDate = getValidateDate(messages[currInd].createdAt);

  if (currInd === 0) {
    return currDate;
  }

  const prevDate = getValidateDate(messages[currInd - 1].createdAt);

  return prevDate !== currDate ? currDate : null;
}
