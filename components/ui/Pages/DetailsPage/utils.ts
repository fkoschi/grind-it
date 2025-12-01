export const formattedBeanComposition = (
  arabicaAmount?: number,
  robustaAmount?: number,
): number | string => {
  if (arabicaAmount === 100) {
    return arabicaAmount;
  } else if (robustaAmount === 100) {
    return robustaAmount;
  }
  return `${arabicaAmount} / ${robustaAmount}`;
};
