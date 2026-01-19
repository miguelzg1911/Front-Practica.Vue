import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // Importamos path

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Configuramos el alias @ para que apunte a la carpeta src
      '@': path.resolve(__dirname, './src'),
    },
  },
})