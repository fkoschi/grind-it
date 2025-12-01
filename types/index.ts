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
  singleShotDosis?: number | null;
  arabicaAmount?: number | null;
  robustaAmount?: number | null;
  doubleShotDosis?: number | null;
  taste?: Taste[];
}
