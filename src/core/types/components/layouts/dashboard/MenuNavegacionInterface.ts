/**
 * Tipado para la lista
 */
export type ItemListIC = {
  icon: string;
  label: string;
  header?: string;
  separator?: boolean;
  badge?: boolean;
  roles?: any[];
  profiles?: number[];
  click?: () => Promise<void>;
};
