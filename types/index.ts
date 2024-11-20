export interface Taste {
  id: number;
  name: string;
}

export interface Filter {
  taste: Taste;
  active?: boolean;
}

export interface CoffeeBean {
  id: number;
  name: string;
  roastery: string;
  degreeOfGrinding?: number;
  isFavorit?: boolean;
  taste?: Array<Taste>;
}
