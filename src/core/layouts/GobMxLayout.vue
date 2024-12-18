<script setup lang="ts">
import GobMxLogo from '@/assets/img/gob_mx_logo.svg';
import useEnv from '@/core/composables/useEnv';
import useGobMxLinks from '@/core/composables/useGobMxLinks';
import { useQuasar } from 'quasar';
import { computed, ref } from 'vue';
import { mdiFacebook, mdiTwitter } from '@mdi/js';
import FooterImg from '@/assets/img/gob_mx_footer_plumaje.svg';
import '@/core/assets/css/layouts/gobMx.css';

/**
 * Imported
 */
const env = useEnv();
const quasar = useQuasar();
const gob = useGobMxLinks();

/**
 * Data
 */
const menuFlag = ref<boolean>(false);
const toggleMenuFlag = () => (menuFlag.value = !menuFlag.value);

/**
 * Go to window
 */
const goToWindow = (url: string, target = '_blank') => window.open(url, target);

/**
 * TypeMenu
 */
type ItemMenu = {
  label?: string;
  icon?: string;
  onClick?: () => Promise<void>;
  separator?: boolean;
};

/**
 * Menu
 */
const menu: ItemMenu[] = [
  {
    label: 'Trámites',
    separator: true,
    onClick: async () => {
      goToWindow('https://www.gob.mx/tramites');
    }
  },
  {
    label: 'Gobierno',
    separator: true,
    onClick: async () => {
      goToWindow('https://www.gob.mx/gobierno');
    }
  },
  {
    icon: 'mdi-magnify',
    onClick: async () => {
      goToWindow('https://www.gob.mx/busqueda');
    }
  }
];

/**
 * ComputedMenu
 */
const computedMenu = computed(() => {
  const newItems = menu.map((item) => {
    const newItem: ItemMenu = {
      label: item.label,
      icon: item.icon,
      separator: item.separator,
      onClick: !item.onClick ? async () => {} : item.onClick
    };

    return newItem;
  });

  return newItems;
});
</script>

<template>
  <q-layout view="hHh LpR fff">
    <!-- Encabaezadp -->
    <q-header elevated>
      <q-toolbar
        class="text-white tw-py-3 xl:tw-px-20 2xl:tw-px-96 custom-bg-primary"
        style="height: 60px"
      >
        <q-toolbar-title>
          <q-img :src="GobMxLogo" class="tw-w-28" height="50px" width="170px" />
        </q-toolbar-title>

        <div>
          <template v-if="quasar.screen.gt.sm">
            <template v-for="(item, key) in computedMenu" :key="key">
              <q-btn flat :label="item.label" :icon="item.icon" @click="item.onClick" no-caps />
            </template>
          </template>

          <template v-else>
            <q-btn flat round dense icon="mdi-menu" @click="toggleMenuFlag" />
          </template>
        </div>

        <q-drawer
          v-model="menuFlag"
          behavior="mobile"
          :width="245"
          side="left"
          elevated
          style="background-color: rgb(48, 48, 48)"
        >
          <q-list class="tw-overflow-y-auto">
            <template v-for="(item, key) in computedMenu" :key="key">
              <q-item clickable @click="item.onClick">
                <q-item-section class="tw-text-white">
                  <q-item-label>
                    <div class="tw-flex tw-items-center tw-justify-center">
                      <div v-if="item.label">
                        {{ item.label }}
                      </div>

                      <div v-if="item.icon">
                        <q-icon :name="item.icon" />
                      </div>
                    </div>
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-separator dark v-if="item.separator" />
            </template>
          </q-list>
        </q-drawer>
      </q-toolbar>

      <q-toolbar class="text-white xl:tw-px-20 2xl:tw-px-96 custom-bg-secondary">
        <q-toolbar-title class="tw-flex tw-items-center md:tw-py-4">
          <div class="tw-mr-2">
            <span class="tw-text-sm"> EPC-RIPC </span>
          </div>
          <div>
            <span style="font-size: 0.57rem; font-weight: 100">
              {{ env.APP_VERSION }}
            </span>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Contenido -->
    <q-page-container class="sre-background">
      <q-page class="tw-p-5 md:tw-px-28 2xl:tw-px-96">
        <router-view />
      </q-page>
    </q-page-container>

    <!-- Pie -->
    <q-footer class="custom-bg-secondary tw-z-0">
      <div class="tw-flex tw-flex-wrap">
        <div class="tw-py-10 md:tw-px-24 2xl:tw-px-96">
          <div class="tw-grid tw-grid-cols-1 xl:tw-grid-cols-4 tw-justify-center tw-gap-8">
            <!-- Logo y Nombre de Gobierno -->
            <div class="footer-row tw-hidden lg:tw-block" style="height: 60px">
              <div class="footer-row-content">
                <q-img class="tw-w-64" :src="GobMxLogo" height="50px" width="170px" />
              </div>
            </div>

            <!-- Enlaces -->
            <div class="footer-row">
              <div class="footer-row-content">
                <div class="tw-mb-4">
                  <span class="tw-text-xl">Enlaces</span>
                </div>

                <div>
                  <ul class="tw-list-none">
                    <li v-for="(item, key) in gob.links()" :key="key">
                      <a :href="item.href" class="tw-no-underline hover:tw-underline text-white">
                        {{ item.label }}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Sección ¿Qué es gob.mx? -->
            <div class="footer-row">
              <div class="footer-row-content">
                <div class="tw-mb-4">
                  <span class="tw-text-xl">¿Qué es gob.mx?</span>
                </div>

                <div class="tw-mb-4">
                  <p>
                    Es el portal único de trámites, información y participación ciudadana.
                    <a href="https://www.gob.mx/que-es-gobmx" class="white-link">Leer más</a>
                  </p>
                </div>

                <div>
                  <ul class="list-none">
                    <li v-for="(item, key) in gob.gobmx()" :key="key">
                      <a :href="item.href" class="tw-no-underline hover:tw-underline tw-text-white">
                        {{ item.label }}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Denuncia y Redes Sociales -->
            <div class="footer-row">
              <div class="footer-row-content">
                <div class="tw-mb-4">
                  <a
                    href="https://www.gob.mx/tramites/ficha/presentacion-de-quejas-y-denuncias-en-la-sfp/SFP54"
                    class="white-link"
                    >Denuncia contra servidores públicos</a
                  >
                </div>

                <div>
                  <span class="font-bold mb-2 tw-text-xl">Síguenos en</span>

                  <div class="tw-flex tw-gap-3 tw-mt-3">
                    <q-icon
                      :name="mdiFacebook"
                      aria-label="Facebook de presidencia"
                      title="Enlace abre en ventana nueva"
                      class="clickable"
                      size="6mm"
                      @click="goToWindow('https://www.facebook.com/gobmexico')"
                    />
                    <q-icon
                      :name="mdiTwitter"
                      aria-label="Facebook de presidencia"
                      title="Enlace abre en ventana nueva"
                      class="clickable"
                      size="6mm"
                      @click="goToWindow('https://twitter.com/GobiernoMX')"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="tw-w-full">
          <q-img :src="FooterImg" height="12mm" position="80% 80%" />
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<style scoped lang="scss">
$primary: #0c231e;
$secondary: #13322b;

.custom-bg-primary {
  background-color: $primary;
}

.custom-bg-secondary {
  background-color: $secondary;
}

.clickable {
  @apply hover:tw-cursor-pointer;
}

.footer-row {
  @apply tw-text-center tw-mb-10 md:tw-mb-0;
}

.footer-row-content {
  @apply tw-text-left tw-px-10 md:tw-px-0;
}

.white-link {
  @apply tw-no-underline hover:tw-underline tw-text-white;
}

.sre-background {
  background-image: url('../assets/img/sre_background.png');
  background-repeat: no-repeat;
  background-size: cover;
}

.footer-line {
  background-image: url('../assets/img/gob_mx_footer_plumaje.svg');
}
</style>
