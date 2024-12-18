import ManualError from '@/core/config/ManualError';
import CryptoJS from 'crypto-js';

/**
 * Composable function to encrypt and decrypt data using AES algorithm
 */
export default function useAESCrypt() {
  /**
   * Encrypt data
   */
  const encrypt = (data: string, encryptKey: string): string => {
    try {
      return CryptoJS.AES.encrypt(data, encryptKey).toString();
    } catch (error) {
      throw new ManualError('Error encrypting data', 'Error', 400, 'negative', {
        error,
        data,
        encryptKey
      });
    }
  }

  /**
   * Decrypt data
   */
  const decrypt = (data: string, encryptKey: string): string => {
    try {
      const bytes = CryptoJS.AES.decrypt(data, encryptKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted
    } catch (error: any) {
      throw new ManualError('Error decrypting data', 'Error', 400, 'negative', {
        error,
        data,
        encryptKey
      });
    }
  }

  return {
    encrypt,
    decrypt
  }
}
