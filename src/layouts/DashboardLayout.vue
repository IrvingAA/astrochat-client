<script setup lang="ts">
import { RouterView } from 'vue-router';
import useMenuStore from '@/core/stores/components/layouts/dashboard/useMenuStore';
import MenuSesion from '@/components/layouts/dashboard/MenuSesion.vue';
import '@/assets/css/layouts/dashboard.css';
import { useRouter } from 'vue-router';
import ReloadApp from '@/components/layouts/dashboard/ReloadApp.vue';
import DialogSession from '@/core/components/ui/dialogs/DialogSession.vue';
import AstroChat from '@/assets/img/banner.png';
import MenuNavegacion from '@/components/layouts/dashboard/MenuNavegacion.vue';
const router = useRouter();
const menuStore = useMenuStore();

const goToIndex = () => {
  router.push({ name: 'dashboard.index' });
};
</script>

<template>
  <DialogSession />

  <q-layout view="hHh LpR fff">
    <q-header elevated>
      <q-toolbar style="background: black" class="text-white">
        <q-toolbar-title>
          <q-img
            @click="goToIndex()"
            :src="AstroChat"
            class="tw-w-full tw-h-12 md:tw-h-20 tw-object-cover tw-cursor-pointer"
            style="margin: 8px auto 0"
          />
        </q-toolbar-title>

        <ReloadApp />

        <MenuSesion />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="menuStore.menuFlag"
      show-if-above
      bordered
      elevated
      style="background-color: black"
      content-class="tw-bg-black tw-text-white"
    >
      <MenuNavegacion />
    </q-drawer>

    <q-page-container style="background-color: black">
      <q-page>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>
