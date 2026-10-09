import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

const port = Number(process.env.PORT || 5173);

export default defineConfig(async () => {
  const siteUrl = 'https://pdfkira.com';
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
    publicDir: 'public',
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
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('tesseract.js')) return 'ocr';
              if (id.includes('onnxruntime-web')) return 'onnx';
              if (id.includes('pdfjs-dist')) return 'pdfjs';
              if (id.includes('pdf-lib')) return 'pdf-lib';
              if (id.includes('react') || id.includes('wouter')) return 'vendor';
            }
            return undefined;
          },
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js'
        },
        chunkSizeWarningLimit: 500
      },
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
