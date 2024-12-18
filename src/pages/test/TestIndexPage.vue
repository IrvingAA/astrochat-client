<script setup lang="ts">
import StarIcon from '@/core/components/ui/StarIcon.vue';
import useDialogLoaderStore from '@/core/stores/components/ui/dialogs/useDialogLoaderStore';
import { onMounted } from 'vue'


/**
 * Imported
 */
const loaderStore = useDialogLoaderStore()

/**
* On mounted
*/
onMounted(() => {
  /**
   * Deshabilita el loader ya que cuando inicia sesion pasa por todos los middlewares que cargan
   * la app y tarda un tiempo en realizar ese proceso asi que hasta este punto quita el dialogo de carga
   */
  loaderStore.disableDialogLoader()
})

type ListItemIC = {
  title: string;
  roles?: number[];
  badge?: boolean;
  profiles?: number[]
  child: {
    title: string;
    description: string;
    routeName: string;
    roles?: (number | string)[];
    badge?: boolean;
    profiles?: number[];
  }[]
}

const list: ListItemIC[] = [
  {
    title: 'FormGenerator Standalone Tools',
    badge: true,
    child: [
      {
        title: 'FormGenerator',
        description: 'Generador de formularios',
        routeName: 'test.fg',
      },
      {
        title: 'TableGenerator',
        description: 'Generador de tablas y filters de consulta',
        routeName: 'test.tg',
      },
      {
        title: 'FormListGenerator',
        description: 'Generador de listas',
        routeName: 'test.flg',
      },
    ]
  }
]

</script>

<template>
  <template v-for="(listItem, listKey) in list" :key="listKey">
    <q-card class="tw-mb-4" flat bordered>
      <q-card-section>
        <div class="tw-pt-6 tw-px-4">
          <div class="item-list">
            <div class="flex tw-items-center">
              <div class="tw-mr-1">
                <span class="title-item-list">{{ listItem.title }}</span>
              </div>
              <div>
                <StarIcon :active="listItem.badge" />
              </div>
            </div>
            <q-separator class="tw-my-2" />
            <div class="items">
              <template v-for="(item, itemKey) in listItem.child" :key="`${listKey}_${itemKey}`">
                <router-link class="item" :to="{ name: item.routeName }" draggable="false">
                  <div class="flex tw-items-center">
                    <div class="tw-mr-1">
                      <span class="item-title">{{ item.title }}</span>
                    </div>
                    <div>
                      <StarIcon :active="item.badge" />
                    </div>
                  </div>
                  <q-space class="tw-my-1" />
                  <span class="item-description">
                    {{ item.description }}
                  </span>
                </router-link>
              </template>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </template>

</template>

<style scoped lang="scss">
.item-list {
  @apply tw-mb-9;
}

.title-item-list {
  @apply tw-text-positive tw-font-bold tw-ml-3 tw-select-none tw-text-xl;
}

.items {
  @apply tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-1;
}

.item {
  @apply tw-p-3 tw-select-none tw-rounded-md hover:tw-bg-grey hover:tw-bg-opacity-5;
}

.item-title {
  @apply tw-text-base tw-font-bold tw-text-center tw-text-secondary;
  letter-spacing: 1.5px
}

.item-description {
  @apply tw-text-sm tw-text-grey;
}
</style>
