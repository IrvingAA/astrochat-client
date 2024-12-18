import Database from '@/databases/Database';
import BlobUtils from '@/core/utils/BlobUtils';
import type { Flatten } from '@/core/types/GlobalTypes';
import type FormsEnum from '@/enums/FormsEnum';
import XDate from 'xdate';
import { rand } from '@vueuse/core';
import FormsUtils from '@/core/utils/FormsUtils';

/**
 * Type of Object but with formListId and flattened
 */
export type FormListObjectIC<T extends object> = Flatten<T> & {
  formListId: string;
};

/**
 * formsList Database
 */
export default class FormsListDatabase extends Database {
  /**
   * Constructor
   */
  constructor() {
    super('formsList');
  }

  /**
   * Form Utils
   */
  private formUtils = () => {
    return FormsUtils();
  };

  /**
   * Blob Utils
   */
  private blobUtils = () => {
    return BlobUtils();
  };

  /**
   * Get formList
   */
  private async getOrMakeFormList<T extends object>(
    formName: keyof typeof FormsEnum
  ): Promise<T[]> {
    // @ts-ignore
    let formList = await this.$getItem<T[] | null>(formName);
    if (!formList) {
      formList = [];
      await this.$setItem(formName, formList);
    }

    // @ts-ignore
    return formList;
  }

  /**
   * Get formList (flattened and with formListId)
   */
  public async getFormList<T extends object>(
    formName: keyof typeof FormsEnum
  ): Promise<FormListObjectIC<T>[]> {
    const formList = await this.getOrMakeFormList<T>(formName);

    // @ts-ignore
    const lastFormList = formList.map((item) => {
      // @ts-ignore
      return this.formUtils().recursiveObjectKeysValues(item);
    });

    // @ts-ignore
    return lastFormList;
  }

  /**
   * Get formList (not flattened and without formListId)
   */
  public async getFormListOriginal<T extends object>(
    formName: keyof typeof FormsEnum
  ): Promise<T[]> {
    const formList = await this.getOrMakeFormList<T>(formName);

    const newList: any = [];
    for (const item of formList) {
      // @ts-ignore
      const temp = await this.blobUtils().TranformObjectIntoFile(item);

      // @ts-ignore
      const lastTemp = this.formUtils().restoreObjectFromKeysValues(temp);

      newList.push(lastTemp);
    }

    // @ts-ignore
    return newList;
  }

  /**
   * Clear formList
   */
  public async clearFormList(formName: keyof typeof FormsEnum): Promise<void> {
    await this.$setItem(formName, []);
  }

  /**
   * Set formList
   */
  public async setFormList<T extends object>(
    formName: keyof typeof FormsEnum,
    formList: T[]
  ): Promise<void> {
    await this.clearFormList(formName);

    for (const item of formList) {
      await this.pushItem<T>(formName, item);
    }
  }

  /**
   * Push item to formList
   */
  public async pushItem<T extends object>(
    formName: keyof typeof FormsEnum,
    item: T
  ): Promise<void> {
    const formList = await this.getOrMakeFormList<T>(formName);

    // @ts-ignore
    let formListId = item.formListId ? item.formListId : null;
    if (!formListId) {
      formListId = rand(0, 9999999999) + '_' + new XDate().getTime();
    }

    const newItem = await this.blobUtils().TranformFileIntoObject({
      formListId,
      ...item
    });

    // @ts-ignore
    formList.push(newItem);
    await this.$setItem(formName, formList);
  }

  /**
   * Remove item from formList
   */
  public async removeItem<T extends object>(
    formName: keyof typeof FormsEnum,
    formListId: string
  ): Promise<void> {
    const formList = await this.getOrMakeFormList<T>(formName);

    // @ts-ignore
    const lastFormList = formList.filter((item) => item.formListId !== formListId);
    await this.$setItem(formName, lastFormList);
  }

  /**
   * Update item from formList
   */
  public async updateItem<T extends object>(
    formName: keyof typeof FormsEnum,
    formListId: string,
    value: T
  ): Promise<void> {
    const formList = await this.getOrMakeFormList<T>(formName);

    const newFormList = [];
    for (const item of formList) {
      // @ts-ignore
      if (item.formListId === formListId) {
        const newItem = await this.blobUtils().TranformFileIntoObject({
          formListId,
          ...value
        });

        newFormList.push(newItem);
      } else {
        newFormList.push(item);
      }
    }

    await this.$setItem(formName, newFormList);
  }

  /**
   * Get item from formList (flattened and with formListId)
   */
  public async getItem<T extends object>(
    formName: keyof typeof FormsEnum,
    formListId: string
  ): Promise<FormListObjectIC<T>> {
    const formList = await this.getOrMakeFormList<T>(formName);

    // @ts-ignore
    const item = formList.find((item) => item.formListId === formListId);
    // @ts-ignore
    const lastItem = await this.blobUtils().TranformObjectIntoFile(item);

    // @ts-ignore
    const lastItem2 = this.formUtils().recursiveObjectKeysValues(lastItem);
    // @ts-ignore
    return lastItem2;
  }

  /**
   * Get original item from formList (not flattened and without formListId)
   */
  public async getItemOriginal<T extends object>(
    formName: keyof typeof FormsEnum,
    formListId: string
  ): Promise<T> {
    const item = await this.getItem<T>(formName, formListId);
    const newItem = this.formUtils().restoreObjectFromKeysValues(item);

    // @ts-ignore
    return newItem;
  }
}
