import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'), // 配置 '@' 別名
        },
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
    },
    base: '/product_analysis_frontend/',
});
