import type { ApiResponseIC } from './ApiInterface';
import type { ApiPayloadIC } from './ApiInterface';


export type FormsPayload = ApiPayloadIC<{
  hash_id: string
  name: string
  email: string
  rowsPerPage: number
  page: number
}>

export type IndexPayload = ApiPayloadIC<{
  name: string
  email: string
  rowsPerPage: number
  page: number
}>

export type ShowPayloadDocument = ApiPayloadIC<any>
export type IndexResponse = ApiResponseIC<any>
