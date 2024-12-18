import CustomHandler from '@/core/config/CustomHandler';
import type { IndexResponse, IndexPayload } from '@/types/api/TestApiInterface';
//@ts-ignore
import testApi from '@/api/TestApi';

export default class TestService {
  /**
   * Api Test
   */
  private testApi: testApi

  /**
   * Constructor
   */
  constructor() {
    this.testApi = new testApi()
  }

  /**
   * Este metodo enlista un arreglo de personas
   */
  public async index(payload: IndexPayload): Promise<IndexResponse['data']> {
    try {
      const {data}  = await this.testApi.index(payload)
      return data
    } catch (error: any) {
      throw new CustomHandler(error)
    }
  }
}
