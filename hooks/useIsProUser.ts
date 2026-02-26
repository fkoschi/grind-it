import { usePurchase } from "@/provider/PurchaseProvider";

/**
 * Check whether the user has a pro subscription
 */
export const useIsProUser = (): boolean => {
  const { isPro } = usePurchase();
  return isPro;
};
