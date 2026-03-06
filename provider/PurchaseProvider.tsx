import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import Purchases, { CustomerInfo, PurchasesOffering } from "react-native-purchases";
import { Platform } from "react-native";

const IOS_API_KEY = process.env.EXPO_PUBLIC_RC_IOS_API_KEY ?? "";
const ANDROID_API_KEY = process.env.EXPO_PUBLIC_RC_ANDROID_API_KEY ?? "";

const PRO_ENTITLEMENT_ID = "pro";

interface PurchaseContextState {
  isPro: boolean;
  currentOffering: PurchasesOffering | null;
  customerInfo: CustomerInfo | null;
  purchasePro: () => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  isLoading: boolean;
  hasError: boolean;
  retry: () => void;
}

const PurchaseContext = createContext<PurchaseContextState | undefined>(undefined);

export const PurchaseProvider: FC<PropsWithChildren> = ({ children }) => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  const isPro = customerInfo?.entitlements.active[PRO_ENTITLEMENT_ID] !== undefined;

  const fetchOfferings = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);

      const offerings = await Purchases.getOfferings();
      setCurrentOffering(offerings.current);

      if (!offerings.current) {
        setHasError(true);
      }
    } catch (error) {
      console.error("RevenueCat init error:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const apiKey = Platform.OS === "ios" ? IOS_API_KEY : ANDROID_API_KEY;

    if (!apiKey) {
      console.warn("RevenueCat API key not configured. Purchases will not work.");
      setIsLoading(false);
      setHasError(true);
      return;
    }

    if (!isConfigured) {
      Purchases.configure({ apiKey });
      setIsConfigured(true);
    }

    fetchOfferings();

    const onCustomerInfoUpdate = (info: CustomerInfo) => {
      setCustomerInfo(info);
    };

    Purchases.addCustomerInfoUpdateListener(onCustomerInfoUpdate);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(onCustomerInfoUpdate);
    };
  }, []);

  const purchasePro = async (): Promise<boolean> => {
    if (!currentOffering?.lifetime) {
      console.error("No lifetime package available in the current offering.");
      return false;
    }

    try {
      const { customerInfo: updatedInfo } = await Purchases.purchasePackage(
        currentOffering.lifetime,
      );
      setCustomerInfo(updatedInfo);
      return updatedInfo.entitlements.active[PRO_ENTITLEMENT_ID] !== undefined;
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "userCancelled" in error &&
        (error as { userCancelled: boolean }).userCancelled
      ) {
        return false;
      }
      throw error;
    }
  };

  const restorePurchases = async (): Promise<boolean> => {
    try {
      const restoredInfo = await Purchases.restorePurchases();
      setCustomerInfo(restoredInfo);
      return restoredInfo.entitlements.active[PRO_ENTITLEMENT_ID] !== undefined;
    } catch (error) {
      console.error("Restore purchases error:", error);
      throw error;
    }
  };

  return (
    <PurchaseContext.Provider
      value={{
        isPro,
        currentOffering,
        customerInfo,
        purchasePro,
        restorePurchases,
        isLoading,
        hasError,
        retry: fetchOfferings,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchase = (): PurchaseContextState => {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error("usePurchase must be used within a PurchaseProvider");
  }
  return context;
};
