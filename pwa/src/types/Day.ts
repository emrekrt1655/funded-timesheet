import { Item } from '@/types/item';
import { Off } from '@/types/Off';
import { PublicHoliday } from '@/types/PublicHoliday';
import { Year } from '@/types/Year';

export class Day implements Item {
  public '@id'?: string;

  constructor(
    _id?: string,
    public year?: Year,
    public date?: Date,
    public publicHoliday?: PublicHoliday,
    public off?: Off,
    public hours?: number,
    public finish?: Date,
  ) {
    this['@id'] = _id;
  }
}
