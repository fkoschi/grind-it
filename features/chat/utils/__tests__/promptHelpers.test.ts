import {
  formatSingleBeanContext,
  formatAllBeansContext,
} from "@/features/chat/utils/promptHelpers";

const fullBean = {
  name: "Ethiopian Yirgacheffe",
  roastery: "Square Mile Coffee",
  arabicaAmount: 100,
  robustaAmount: 0,
  degreeOfGrinding: 8.5,
  singleShotDosis: 9,
  doubleShotDosis: 18.5,
  aromaFruity: 90,
  aromaFloral: 70,
  aromaSweet: 60,
  aromaNutty: 0,
  aromaSpices: null,
  aromaRoasted: 20,
  aromaGreen: null,
  aromaSour: 35,
  aromaOther: null,
};

const tastes = [{ flavor: "Berry" }, { flavor: "Citrus" }];

describe("formatSingleBeanContext", () => {
  it("includes bean name and roastery", () => {
    const result = formatSingleBeanContext(fullBean, tastes);
    expect(result).toContain("Ethiopian Yirgacheffe (Square Mile Coffee)");
  });

  it("includes varietal", () => {
    const result = formatSingleBeanContext(fullBean, tastes);
    expect(result).toContain("Arabica 100%");
  });

  it("includes grind settings", () => {
    const result = formatSingleBeanContext(fullBean, tastes);
    expect(result).toContain("Grind: 8.5");
    expect(result).toContain("Single: 9g");
    expect(result).toContain("Double: 18.5g");
  });

  it("includes only non-zero aroma fields", () => {
    const result = formatSingleBeanContext(fullBean, tastes);
    expect(result).toContain("Fruity 90");
    expect(result).toContain("Sour 35");
    expect(result).not.toContain("Nutty");
    expect(result).not.toContain("Spices");
  });

  it("includes taste notes", () => {
    const result = formatSingleBeanContext(fullBean, tastes);
    expect(result).toContain("Berry, Citrus");
  });

  it("handles fully null bean gracefully", () => {
    const result = formatSingleBeanContext({ name: "My Bean" }, []);
    expect(result).toContain("My Bean");
  });
});

describe("formatAllBeansContext", () => {
  it("returns null for empty list", () => {
    expect(formatAllBeansContext([])).toBeNull();
  });

  it("includes count in header", () => {
    const result = formatAllBeansContext([fullBean, { name: "Other Bean" }]);
    expect(result).toContain("2 beans");
  });

  it("uses +/++/+++ for aroma shorthand", () => {
    const result = formatAllBeansContext([fullBean]);
    expect(result).toContain("Fruity+++"); // 90 → +++
    expect(result).toContain("Sour+"); // 35 → +
    expect(result).not.toContain("Nutty"); // 0 → omit
  });

  it("includes grind and dose per bean", () => {
    const result = formatAllBeansContext([fullBean]);
    expect(result).toContain("grind 8.5");
    expect(result).toContain("dose 18.5g");
  });
});
