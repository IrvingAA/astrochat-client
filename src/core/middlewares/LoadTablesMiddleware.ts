import type { ContextIC } from '@/core/types/config/GlobalMiddlewareInterface';
import useTablesStore from '@/core/stores/config/useTablesStore';

export default async function LoadTablesMiddleware({ next, to }: ContextIC): Promise<void> {
  /**
   * Paths a omitir
   */
  switch (to.name) {
    case 'auth.login':
      return next();

    default:
    //No hacer nada
  }

  const tablesStore = useTablesStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const tables = tablesStore.tables;
  return next();
}
