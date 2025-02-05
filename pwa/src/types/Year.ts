import { Day } from '@/types/Day';
import { Item } from '@/types/item';
import { OffValues } from '@/types/Off';
import { Region } from '@/types/Region';

export class Year implements Item {
  public '@id'?: string;

  constructor(
    _id?: string,
    public year?: number,
    public region?: Region,
    public days?: Day[],
  ) {
    this['@id'] = _id;
  }
}

export const legend: {
  [key: string]: {
    name: string;
    color: string;
  };
} = {
  weekend: {
    name: 'weekend',
    color: 'blue',
  },
  publicHoliday: {
    name: 'publicHoliday',
    color: 'green',
  },
  [OffValues.vacation]: {
    name: 'vacation',
    color: 'red',
  },
  [OffValues.sick]: {
    name: 'sick',
    color: 'yellow',
  },
};
