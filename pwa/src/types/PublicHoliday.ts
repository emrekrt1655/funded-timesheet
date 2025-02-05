import { Item } from '@/types/item';

export class PublicHoliday implements Item {
  public '@id': string;

  constructor(
    _id: string,
    public value: string,
  ) {
    this['@id'] = _id;
  }
}
