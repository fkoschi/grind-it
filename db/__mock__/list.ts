import { CoffeeBean } from "@/types";

export const dashboardListData: Array<CoffeeBean> = [];

export const _dashboardListData: Array<CoffeeBean> = [
  {
    id: 1,
    roastHouse: "Supremo",
    name: "Toskana",
    degreeOfGrinding: 6.3,
    taste: [
      { id: 1, name: "schokig" },
      { id: 2, name: "nussig" },
    ],
    isFavorit: true,
  },
  {
    id: 2,
    roastHouse: "Supremo",
    name: "Fat Cat",
    degreeOfGrinding: 5.8,
    taste: [{ id: 3, name: "fruchtig" }],
    isFavorit: false,
  },
  {
    id: 3,
    roastHouse: "Fausto",
    name: "Giasing",
    degreeOfGrinding: 4.2,
    taste: [],
    isFavorit: false,
  },
  {
    id: 4,
    roastHouse: "Supremo",
    name: "Easy Tiger",
    degreeOfGrinding: 5.5,
    taste: [{ id: 1, name: "schokig" }],
    isFavorit: false,
  },
  {
    id: 5,
    roastHouse: "Supremo",
    name: "La Familia",
    degreeOfGrinding: 7.2,
    taste: [],
    isFavorit: true,
  },
];
