import type { ApiResponseIC, StandardPaginationIC } from '@/core/types/api/ApiType';
import type { ApiPayloadIC } from './ApiInterface';

export type ChatRoomIC = {
  uuid?: string
  name: string | null
  description: string | null
  password?: string
  totalItems?: number
  totalPages?: number
  limit: number
  page: number
  rowsPerPage?: number
}

export type ChatRoomPayload = ApiPayloadIC<ChatRoomIC>

export type IndexPayload = ApiPayloadIC<{
  name: string
  description: string
}>

export type ChatRoomIndexResponse = ApiResponseIC<StandardPaginationIC<ChatRoomIC>>
