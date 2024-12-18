import type { Pinia, Store } from 'pinia';

/**
 * Interface para el uso de _s
 */
export interface ExtendedPinia extends Pinia {
  _s: Map<string, Store>;
}
