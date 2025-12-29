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
  // Coffee aroma profile metrics (0-100)
  aromaFruity?: number | null;
  aromaFloral?: number | null;
  aromaSweet?: number | null;
  aromaNutty?: number | null;
  aromaSpices?: number | null;
  aromaRoasted?: number | null;
  aromaGreen?: number | null;
  aromaSour?: number | null;
  aromaOther?: number | null;
}
