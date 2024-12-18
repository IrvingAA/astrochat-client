/**
 * Utils for blobs
 */
export default function BlobUtils() {
  /**
   * Data URI a blob
   */
  function dataURIToBlob(dataURI: string): Blob {
    const splitDataURI = dataURI.split(',');
    const byteString =
      splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

    return new Blob([ia], { type: mimeString });
  }

  /**
   * Blob size to MB with 2 decimals
   */
  function blobSizeToMB(blob: Blob): number {
    return Math.round((blob.size / 1024 / 1024) * 100) / 100;
  }

  /**
   * Extract content of a blob
   */
  async function extractBlobContent(blob: Blob): Promise<string> {
    if (!(blob instanceof Blob)) {
      console.error('Invalid blob', blob);
      throw new Error('Invalid blob');
    }

    const content = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // @ts-ignore
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(blob);
    });

    return content;
  }

  /**
   * Busca en un objeto o array de forma recursiva una key u objeto
   * que sea de tipo File y lo convierte a un objeto con la información
   * y con una key "isFile" con valor true
   */
  async function TranformFileIntoObject(obj: object | any[]): Promise<any[] | object> {
    const newObj = obj;
    if (Array.isArray(newObj)) {
      const newObj2: any[] = [];
      for (let i = 0; i < newObj.length; i++) {
        const item = newObj[i];
        newObj2[i] = await TranformFileIntoObject(item);
      }

      return newObj2;
    } else if (typeof newObj === 'object' && newObj !== null) {
      if (newObj instanceof File) {
        const content = await extractBlobContent(newObj);
        return {
          isFile: true,
          name: newObj.name,
          type: newObj.type,
          content
        };
      } else {
        const keys = Object.keys(newObj);
        const values = Object.values(newObj);
        const newObj2: any = {};

        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const value = values[i];

          newObj2[key] = await TranformFileIntoObject(value);
        }

        return newObj2;
      }
    } else {
      return newObj;
    }
  }

  /**
   * Busca en un objeto o array de forma recursiva un objeto
   * que tenga una key "isFile" con valor true y lo convierte
   * a un File (Proceso inverso a TranformFileIntoObject)
   */
  async function TranformObjectIntoFile(obj: object | any[]): Promise<any[] | object> {
    const newObj = obj;
    if (Array.isArray(newObj)) {
      const newObj2: any[] = [];
      for (let i = 0; i < newObj.length; i++) {
        const item = newObj[i];
        newObj2[i] = await TranformObjectIntoFile(item);
      }

      return newObj2;
    } else if (typeof newObj === 'object' && newObj !== null) {
      // @ts-ignore
      if (newObj.isFile) {
        // @ts-ignore
        const blob = dataURIToBlob(newObj.content);
        // @ts-ignore
        return new File([blob], newObj.name, { type: newObj.type });
      } else {
        const keys = Object.keys(newObj);
        const values = Object.values(newObj);
        const newObj2: any = {};

        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const value = values[i];

          newObj2[key] = await TranformObjectIntoFile(value);
        }

        return newObj2;
      }
    } else {
      return newObj;
    }
  }

  return {
    dataURIToBlob,
    blobSizeToMB,
    extractBlobContent,
    TranformFileIntoObject,
    TranformObjectIntoFile
  };
}
