<script setup lang="ts">
import { RouterView } from 'vue-router'
import '@/assets/css/layouts/dashboard.css'
import Logo from '@/assets/img/sre_logo.svg'
import useEnv from '@/core/composables/useEnv';

const env = useEnv()
</script>

<template>
  <q-layout view="hHh LpR lFr">
    <q-header elevated>
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>
          <div class="tw-block tw-text-center md:tw-flex tw-items-center">
            <div class="md:tw-mr-0">
              <q-img :src="Logo" class="tw-w-48 sm:tw-w-72 md:tw-w-80 " />
            </div>
            <div class="tw-text-xs md:tw-text-base">
              <span>{{ env.APP_NAME }}</span>
            </div>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Contenido de la app -->
    <q-page-container class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-mx-10">
      <q-card class="tw-my-7 tw-w-full">
        <q-card-section>

          <router-view />

        </q-card-section>
      </q-card>
    </q-page-container>
  </q-layout>
</template>
