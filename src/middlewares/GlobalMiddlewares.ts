import type { MiddlewareIC } from '@/core/types/config/GlobalMiddlewareInterface';
import { CleanDatabaseMiddleware } from '@/core/middlewares/CleanDatabaseMiddleware';
import { LoadStoresMiddleware } from '@/core/middlewares/LoadStoreMiddleware';
import SessionMiddleware from '@/core/middlewares/SessionMiddleware';
import CatalogsMiddleware from '@/core/middlewares/CatalogsMiddleware';
import LoadFormsMiddleware from '@/core/middlewares/LoadFormsMiddleware';
//import LoadTablesMiddleware from '@/core/middlewares/LoadTablesMiddleware';
import RegisterTabIdMiddleware from '@/core/middlewares/RegisterTabIdMiddleware';

/**
 * Registra aqui los middlewares globales
 */
const GlobalMiddlewares: MiddlewareIC[] = [
  CleanDatabaseMiddleware,
  LoadStoresMiddleware,
  RegisterTabIdMiddleware,
  SessionMiddleware,
  CatalogsMiddleware,
  LoadFormsMiddleware,
  //LoadTablesMiddleware
  //
];

export default GlobalMiddlewares;
