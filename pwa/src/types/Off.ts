import { Item } from '@/types/item';

export enum OffValues {
  vacation = 'Urlaub',
  sick = 'Krank',
}

export class Off implements Item {
  public '@id': string;

  constructor(
    _id: string,
    public value: OffValues,
  ) {
    this['@id'] = _id;
  }
}
