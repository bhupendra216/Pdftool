import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

const port = Number(process.env.PORT || 5173);

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const siteUrl = env.VITE_SITE_URL || process.env.VITE_SITE_URL || 'https://pdfkira.com';
  process.env.VITE_SITE_URL = siteUrl;
  const basePath = process.env.BASE_PATH || "/";

  const htmlTransform = {
    name: 'html-transform',
    transformIndexHtml(html: string) {
      return html.replace(/%VITE_SITE_URL%/g, siteUrl);
    },
  };

  const plugins = [
    htmlTransform,
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
  ];

  if (process.env.NODE_ENV !== 'production' && process.env.REPL_ID !== undefined) {
    const cartographer = await import('@replit/vite-plugin-cartographer');
    const devBanner = await import('@replit/vite-plugin-dev-banner');

    plugins.push(
      cartographer.cartographer({
        root: path.resolve(import.meta.dirname, '..'),
      }),
      devBanner.devBanner(),
    );
  }

  return {
    base: '/',
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, 'src'),
        '@assets': path.resolve(
          import.meta.dirname,
          '..',
          '..',
          'attached_assets',
        ),
      },
      dedupe: ['react', 'react-dom'],
    },
    root: path.resolve(import.meta.dirname),
    build: {
      outDir: path.resolve(import.meta.dirname, 'dist/public'),
      emptyOutDir: true,
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js'
        }
      }
    },
    server: {
      port,
      strictPort: true,
      host: '0.0.0.0',
      allowedHosts: true,
      proxy: {
        '/api': {
          target: process.env.API_SERVER_URL || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
      fs: {
        strict: true,
      },
    },
    preview: {
      port,
      host: '0.0.0.0',
      allowedHosts: true,
    },
  };
});
