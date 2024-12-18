import CustomHandler from '@/core/config/CustomHandler';
import useNotify from './useNotify';
import HttpStatusEnum from '@/core/enums/HttpStatusEnum';
import useDialogAlertStore from '@/core/stores/components/ui/dialogs/useDialogAlertStore';
import type { ArrayOfObjects } from '@/core/types/GlobalTypes';
import XDate from 'xdate';
import useEnv from './useEnv';
import moment from 'moment';
import FileTypesEnum from '@/core/enums/FileTypesEnum';

/**
 * Composable use utils
 */
export default function useUtils() {
  /**
   * Console log que solo se muestra en cuando DEBUG_MODE es true
   */
  const debugLog = (type: 'log' | 'warn' | 'error', message: string, data?: any): void => {
    const env = useEnv();
    if (env.DEBUG_MODE === 'true') {
      console[type](`[Debug] ${message}`, {
        data,
      });
    }
  }

  /**
  * Catch simple error
  */
  const catchSimpleError = async (error: Error): Promise<CustomHandler | undefined> => {
    if (!(error instanceof Error)) { console.error(error); return }
    const newError = new CustomHandler(error)
    return newError;
  }

  /**
   * Metodo para capturar los errores en las vistas
   */
  const catchError = async (error: Error): Promise<CustomHandler | undefined> => {
    console.error(error);
    if (!(error instanceof Error)) {
      return;
    }
    const newError = new CustomHandler(error);

    const { data } = newError;
    const dialogAlertError = useDialogAlertStore();
    const notifyComposable = useNotify();

    switch (data.httpCode) {
      case HttpStatusEnum.UNPROCESSABLE_ENTITY:
        notifyComposable.simpleNotify(data.alert, data.message);
        break;
      case HttpStatusEnum.FORBIDDEN:
        notifyComposable.simpleNotify('negative', data.message);
        break;

      default:
        await dialogAlertError.triggerDialogAlert(data.alert, data.title, data.message);
        break;
    }
    return newError;
  };

  /**
   * Verifica si un objeto esta vacio
   */
  const isEmpty = (obj: any): boolean => {
    if (obj === null || obj === undefined) {
      return true;
    }

    if (Array.isArray(obj) && obj.length > 0) {
      return obj.every(isEmpty);
    }

    if (typeof obj === 'object') {
      return Object.values(obj).every(isEmpty);
    }

    if (typeof obj === 'boolean') {
      return false;
    }

    return obj === ''; // Puedes ajustar esta condición según tus necesidades
  };

  /**
   * Pluck an array of objects by key
   */
  const arrayPluck = <D extends ArrayOfObjects, DO extends D[number], K extends keyof DO>(
    array: D,
    key: K
  ): DO[K][] => {
    // @ts-ignore
    return array.map((item) => item[key]);
  };

  /**
   * Blob to file
   */
  const blobToFile = (blob: Blob, fileNameWithoutExtension: string): File => {
    const extension = blob.type.split('/')[1];
    const newName = fileNameWithoutExtension + '.' + extension;
    return new File([blob], newName, { type: blob.type });
  };

  /**
   * Blob to file with extension
   */
  const blobToFileWithExtension = (blob: Blob, fileName: string): File => {
    return new File([blob], fileName, { type: blob.type });
  };

  /**
   * Open file in new tab
   */
  const openFileInNewTab = (file: File): void => {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
  };

  /**
   * Download file
   */
  const downloadFile = (file: File): void => {
    const date = new XDate().toString('yyyy-MM-dd_HHmmss');
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${date}_${file.name}`;
    link.click();
  };

  /**
   * Convert source to file object
   */
  const convertSourceToFileObject = (src: string, nameWithoutExtension: string): Promise<File> => {
    try {
      const File = fetch(src)
        .then((res) => res.blob())
        .then((blob) => blobToFile(blob, nameWithoutExtension));

      return File;
    } catch (error: any) {
      return Promise.reject(error);
    }
  };

  /**
   * Parse date dd/mm/yyyy to yyyy-mm-dd
   */
  const parseDate = (date: string | null): string | null => {
    if (!date) return null;
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(date)) return null;

    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  };

  /**
   * Parse date to format specified used moment
   */
  const parseDateToFormat = (date: string, format: string): string => {
    if (!date) return 'S/I';
    return moment(date).format(format);
  };

  /**
   * Get blob local file from url
   *
   * @param locationFile
   * @param type
   */
  const getBlobLocalFile = async (locationFile: string, type: string): Promise<Blob> => {
    const response = await fetch(locationFile);
    const binaryData = await response.arrayBuffer();
    return new Blob([binaryData], { type: type });
  };

  /**
   * Get local file
   */
  const getLocalFile = async (
    pathFile: string,
    typeFile: keyof typeof FileTypesEnum
  ): Promise<File> => {
    const env = useEnv();

    let envPath = env.PUBLIC_PATH ?? '';
    if (!envPath.startsWith('/')) {
      envPath = '/' + envPath;
    }

    if (!pathFile.startsWith('/')) {
      pathFile = '/' + pathFile;
    }

    const dominio = window.location.origin;
    const path = `${dominio}${envPath}${pathFile}`;

    const fetchRes = await fetch(path);
    const binaryData = await fetchRes.arrayBuffer();
    const type = FileTypesEnum[typeFile];
    const blob = new Blob([binaryData], { type: type });
    const fileName = pathFile.split('/').pop() as string;
    const file = blobToFileWithExtension(blob, fileName);

    return file;
  };

  /**
   * Limpiar texto de acentos y caracteres especiales
   */
  const clearText = (texto: string): string => {
    //Convertir todas las letras a minúsculas
    let textoLimpio = texto.toLowerCase();

    //Quitar acentos
    textoLimpio = textoLimpio.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    //Quitar caracteres especiales
    textoLimpio = textoLimpio.replace(/[^\w\s]/gi, '');

    return textoLimpio;
  };

  /**
   * Limpiar las diagonales de un texto (ejemplo: "hola//mundo" -> "hola/mundo")
   */
  const cleanSlashes = (text: string): string => {
    return text.replace(/\/+/g, '/');
  };

  /**
   * Funcion para parsear un number a string moneda MXN
   */
  const parseNumberToCurrency = (number: number): string => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(number);
  };

  /**
   * Función para saber si el string es una URL
   */
  const isUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (error: any) {
      return false;
    }
  };

  return {
    debugLog,
    catchSimpleError,
    catchError,
    isEmpty,
    arrayPluck,
    blobToFile,
    blobToFileWithExtension,
    openFileInNewTab,
    downloadFile,
    convertSourceToFileObject,
    parseDate,
    getBlobLocalFile,
    getLocalFile,
    clearText,
    cleanSlashes,
    parseNumberToCurrency,
    parseDateToFormat,
    isUrl
  };
}
