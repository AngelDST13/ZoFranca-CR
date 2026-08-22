import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'src/pages/login/login.html'),
        admin: resolve(__dirname, 'src/pages/admin/admin.html'),
        alertas: resolve(__dirname, 'src/pages/admin/alertas.html'),
        cumplimiento: resolve(__dirname, 'src/pages/admin/cumplimiento.html'),
        empresas: resolve(__dirname, 'src/pages/empresas/empresas.html'),
        solicitud: resolve(__dirname, 'src/pages/empresas/solicitud.html'),
        detalleSolicitud: resolve(__dirname, 'src/pages/empresas/detalle-solicitud.html'),
      },
    },
  },
});