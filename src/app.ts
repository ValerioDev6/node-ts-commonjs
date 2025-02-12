import { envs } from './config';
import { AppRoutes } from './core/routes';
import { Server } from './core/server';

(() => {
  main();
})();

function main() {
  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });
  server.start();
}
