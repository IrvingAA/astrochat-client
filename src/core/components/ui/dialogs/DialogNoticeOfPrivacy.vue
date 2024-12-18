<script setup lang="ts">
import useDialogNoticeOfPrivacyStore from '@/core/stores/components/ui/dialogs/useDialogNoticeOfPrivacyStore';

const dialog = useDialogNoticeOfPrivacyStore();
</script>

<template>
  <q-dialog v-model="dialog.showFlagNoticeOfPrivacy">
    <q-card style="max-width: 15cm">
      <div class="tw-text-center tw-bg-dark tw-text-white tw-text-2xl tw-p-5">
        Aviso de privacidad
      </div>

      <q-card-section class="tw-pt-4" style="font-size: 1rem">
        <p class="tw-text-justify">
          La Unidad de Gobierno Digital (UGD) de la Secretaría de la Función Pública (SFP) con
          domicilio en Avenida Insurgentes Sur, Número 1735, Piso Cuatro, Ala Sur, Colonia Guadalupe
          Inn, Delegación Álvaro Obregón, México, Código Postal 01020, Ciudad de México, es el
          sujeto obligado y responsable del tratamiento de los datos personales que se recaban a
          través de gob.mx, los cuales serán protegidos conforme a lo dispuesto por la Ley General
          de Protección de Datos Personales en Posesión de Sujetos Obligados, y demás normatividad
          que resulte aplicable. Los datos personales recolectados por las dependencias y entidades
          de la Administración Pública Federal, y empresas productivas del Estado, a través de su
          portal institucional dentro de gob.mx, o por cualquier otro sujeto obligado que utilice
          gob.mx para la prestación de algún servicio digital y que recabe datos personales, serán
          tratados bajo su responsabilidad, conforme a sus atribuciones legales y el aviso de
          privacidad correspondiente.
          <a
            href="/pdf/aviso_privacidad.pdf"
            target="_blank"
            class="tw-text-blue tw-text-sm tw-underline-offset-1"
            >Leer más</a
          >
        </p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          no-caps
          flat
          label="Cerrar"
          color="info"
          @click="dialog.setShowFlagNoticeOfPrivacy(false)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
