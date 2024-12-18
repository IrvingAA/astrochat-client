import { store } from 'quasar/wrappers';
import { createPinia } from 'pinia';
import type { Router } from 'vue-router';
import PiniaDatabase from '@/core/databases/PiniaDatabase';
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2';

/*
 * When adding new properties to stores, you should also
 * extend the `PiniaCustomProperties` interface.
 * @see https://pinia.vuejs.org/core-concepts/plugins.html#typing-new-store-properties
 */
declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router;
  }
}

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store((/* { ssrContext } */) => {
  const pinia = createPinia();

  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)

  const piniaDatabase = new PiniaDatabase();
  pinia.use(
    createPersistedStatePlugin({
      storage: {
        getItem: async (key: string) => {
          return await piniaDatabase.$getItem<any | null>(key);
        },
        setItem: async (key: string, value: any) => {
          return await piniaDatabase.$setItem(key, value);
        },
        removeItem: async (key: string) => {
          return await piniaDatabase.$removeItem(key);
        }
      }
    })
  );

  return pinia;
});
