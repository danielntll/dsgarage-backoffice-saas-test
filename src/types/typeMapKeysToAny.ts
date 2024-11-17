export type typeMapKeysToAny<T> = {
  [K in keyof T]: any;
};
