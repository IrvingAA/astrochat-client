<script setup lang="ts">
import { RouterView } from 'vue-router'
import DialogConfirm from '@/core/components/ui/dialogs/DialogConfirm.vue'
import DialogLoader from '@/core/components/ui/dialogs/DialogLoader.vue'
import DialogAlert from '@/core/components/ui/dialogs/DialogAlert.vue'
import DialogImage from '@/core/components/ui/dialogs/DialogImage.vue'
import DialogPdf from '@/core/components/ui/dialogs/DialogPdf.vue'
import DialogNoticeOfPrivacy from '@/core/components/ui/dialogs/DialogNoticeOfPrivacy.vue'
import DialogInvalidTab from '@/core/components/ui/dialogs/DialogInvalidTab.vue'
import useAppStoreTemp from '@/core/stores/config/useAppStoreTemp'

/**
 * Import
 */
 const appStoreTemp = useAppStoreTemp()
</script>

<template>
  <div style="background-color: rgb(255, 250, 244)">
    <template v-if="!appStoreTemp.isInvalidTab">
      <DialogConfirm />
      <DialogLoader />
      <DialogAlert />
      <DialogImage />
      <DialogPdf />
      <DialogNoticeOfPrivacy />
      <RouterView />
    </template>

    <DialogInvalidTab />
  </div>
</template>
