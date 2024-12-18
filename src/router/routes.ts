import type { RouteIC } from '@/core/types/config/RouterInterface';
import errorRoutes from './errors.routes';
import authRoutes from './auth.routes';
import dashboardRoutes from './dashboard.routes';
import testRoutes from './test.routes';

const routes: RouteIC[] = [
  ...errorRoutes,
  ...testRoutes,
  ...authRoutes,
  ...dashboardRoutes,
];

export default routes;
