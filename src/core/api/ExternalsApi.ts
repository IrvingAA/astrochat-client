import type { GetIpDataResponseIC } from '@/core/types/api/ExternalsApiInterface';
import axios from 'axios';

export default class ExternalsApi {
  /**
   * Api para obtener los datos de IP
   */
  public async getIpData(): Promise<GetIpDataResponseIC> {
    const { data } = await axios.get('https://api.my-ip.io/v2/ip.json', {
      timeout: 2000,
    });
    return data;
  }
}
