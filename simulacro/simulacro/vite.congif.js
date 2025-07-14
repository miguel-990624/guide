import { defineConfig } from 'vite';
import history from 'connect-history-api-fallback';

export default defineConfig({
  plugins: [{
    name: 'spa-fallback',
    configureServer(server) {
      server.middlewares.use(history());
    }
  }],
  server: {
    open: true
  }
});