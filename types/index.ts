export interface Taste {
  id: number;
  flavor: string;
}

export interface CoffeeBean {
  id: number | null;
  name: string | null;
  roastery?: string | null;
  degreeOfGrinding?: number | null;
  isFavorite?: boolean | null;
  taste?: Array<Taste>;
}
