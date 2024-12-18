import Api from './Api';
import type { IndexResponse, IndexPayload } from '@/types/api/TestApiInterface'


export default class FaqApi extends Api {
  /**
   * Constructor
   */
  constructor() {
    super('test')
  }

  /**
   * Index API
   */
  public async index(payload: IndexPayload): Promise<IndexResponse> {
    const { data } = await this.$get('/', {
      params: payload
    })

    return data
  }
}
