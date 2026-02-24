declare module "expo-secure-store" {
  export const WHEN_UNLOCKED: string;

  export type SecureStoreOptions = {
    keychainAccessible?: string;
  };

  export function getItemAsync(key: string, options?: SecureStoreOptions): Promise<string | null>;

  export function setItemAsync(
    key: string,
    value: string,
    options?: SecureStoreOptions,
  ): Promise<void>;

  export function deleteItemAsync(key: string, options?: SecureStoreOptions): Promise<void>;
}
