import type { SaveFileIC } from '@/core/types/databases/FilesDatabase';
import Database from '@/databases/Database';
import BlobUtils from '@/core/utils/BlobUtils';

/**
 * Files Database
 */
export default class FilesDatabase extends Database {
  /**
   * Constructor
   */
  constructor() {
    super('files');
  }

  /**
   * Blob utils
   */
  private blobUtils = () => {
    return BlobUtils();
  };

  /**
   * Guardar uno o varios archivos
   */
  public async setFiles(key: string, files: File | File[] | null): Promise<void> {
    const isArrayOfFiles = Array.isArray(files);
    if (!isArrayOfFiles && !files) {
      // @ts-ignore
      return this.$setItem(key, null);
    } else if (isArrayOfFiles && (!files.length || files[0] === null)) {
      // @ts-ignore
      return this.$setItem(key, null);
    }

    let saveFile: SaveFileIC | SaveFileIC[] | undefined = undefined;
    if (isArrayOfFiles) {
      // @ts-ignore
      saveFile = [];

      await new Promise((resolve) => {
        files.forEach(async (file: File, index: number) => {
          const content = await this.blobUtils().extractBlobContent(file);
          const temp = {
            name: file.name,
            size: file.size,
            type: file.type,
            content: content
          };

          // @ts-ignore
          saveFile.push(temp);

          if (index === files.length - 1) {
            resolve(true);
          }
        });
      });
    } else {
      // @ts-ignore
      const content = await this.blobUtils().extractBlobContent(files);

      // @ts-ignore
      saveFile = {
        // @ts-ignore
        name: files.name,
        // @ts-ignore
        size: files.size,
        // @ts-ignore
        type: files.type,
        content: content
      };
    }

    await this.$setItem(key, saveFile);
  }

  /**
   * Obtener uno o varios archivos
   */
  /**
   * Obtener una lista de archivos
   */
  public async getFiles(key: string): Promise<File[] | File | null> {
    // @ts-ignore
    let files: any = undefined;
    try {
      files = await this.$getItem(key);
      if (!files) return null;
    } catch (error) {
      return null;
    }

    // @ts-ignore
    let lastFiles: File[] | File | undefined = undefined;
    const isArrayOfFiles = Array.isArray(files);
    if (isArrayOfFiles) {
      // @ts-ignore
      lastFiles = [];
      files.forEach((file: SaveFileIC) => {
        const content = this.blobUtils().dataURIToBlob(file.content);
        // @ts-ignore
        lastFiles.push(new File([content], file.name, { type: file.type }));
      });
    } else {
      const content = this.blobUtils().dataURIToBlob(files.content);
      // @ts-ignore
      lastFiles = new File([content], files.name, { type: files.type });
    }

    // @ts-ignore
    return lastFiles;
  }

  /**
   * Limpiar archivos
   */
  public async clearFiles(key: string): Promise<void> {
    await this.setFiles(key, null);
  }
}
