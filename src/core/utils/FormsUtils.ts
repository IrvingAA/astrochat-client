import type { RecursiveObjectKeysValuesReturn } from '@/core/types/components/generators/FormsGeneratorInterface';

/**
 * Utils para los Formularios
 */
export default function FormsUtils() {
  /**
   * Obtener las keys de un objeto de forma recursiva con . (Ejemplo: personalData.email) con su valor
   */
  // @ts-ignore
  const recursiveObjectKeysValues = ( obj: any, prefix?: string, keys: RecursiveObjectKeysValuesReturn = {}): object => {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];

      if (Array.isArray(value)) {
        // Si es un arreglo, agregar el objeto original
        // @ts-ignore
        keys[prefix ? `${prefix}.${key}` : key] = value;
      } else if (typeof value === 'object' && value !== null) {
        if (value instanceof File) {
          // Si es de tipo 'File', agregar el objeto original
          // @ts-ignore
          keys[prefix ? `${prefix}.${key}` : key] = value;
        } else {
          // Si es un objeto y no es de tipo 'File', llamar recursivamente
          const newPrefix = prefix ? `${prefix}.${key}` : key;
          recursiveObjectKeysValues(value, newPrefix, keys);
        }
      } else {
        // Para otros tipos de datos, agregar clave-valor
        // @ts-ignore
        keys[prefix ? `${prefix}.${key}` : key] = value;
      }
    });

    return keys;
  };

  /**
   * Recuperar el objeto original a partir de las keys y valores obtenidos de forma recursiva.
   * (Proceso inverso a recursiveObjectKeysValues)
   */
  const restoreObjectFromKeysValues = (keysValues: any): object => {
    const object: any = {};

    Object.keys(keysValues).forEach((key) => {
      const value = keysValues[key];

      if (Array.isArray(value)) {
        // Si es un array, agregarlo directamente al objeto
        object[key] = value;
      } else if (typeof value === 'object' && value !== null) {
        if (value instanceof File) {
          // Si es de tipo 'File', agregar el objeto original
          object[key] = value;
        } else {
          // Si es un objeto y no es de tipo 'File', llamar recursivamente
          object[key] = restoreObjectFromKeysValues(value);
        }
      } else {
        // Para otros tipos de datos, agregar clave-valor
        object[key] = value;
      }
    });

    return object;
  };

  /**
   * Convierte un archivo a base64 sin URI (data:image/png;base64,)
   */
  const convertFileToBase64 = async (file: File | null): Promise<string | null> => {
    if (!file) return null;
    if (!(file instanceof File)) {
      console.error('El archivo no es de tipo File');
      return null;
    }

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString() || '');
      reader.onerror = (error) => reject(error);
    });

    return base64;
  };

  /**
   * Obtiene los archivos de un File[] y los convierte a base64
   */
  const convertFilesToBase64 = async (files: FileList): Promise<string[]> => {
    if (!files.length) return [];
    if (files.length === 1 && files[0] === null) return [];

    const filesArray: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64 = await convertFileToBase64(file);
      if (base64) filesArray.push(base64);
    }

    return filesArray;
  };

  return {
    recursiveObjectKeysValues,
    restoreObjectFromKeysValues,
    convertFileToBase64,
    convertFilesToBase64
  };
}
