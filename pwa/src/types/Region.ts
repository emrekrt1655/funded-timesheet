import { Item } from '@/types/item';

export class Region implements Item {
  public '@id': string;

  constructor(
    _id: string,
    public value: string,
  ) {
    this['@id'] = _id;
  }
}
