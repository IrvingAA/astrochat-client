/**
 * Tipado para CatalogIC
 */
export type CatalogIC = {
  label: string;
  value: any;
  meta?: {
    [key: string]: any;
  };
}[];

/**
 * Tipado para AllCatalogsIC
 */
export type AllCatalogsIC = {
  [key: string]: CatalogIC;
};
