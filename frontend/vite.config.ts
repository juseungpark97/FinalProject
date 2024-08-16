import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host:true,
    strictPort: true,
    port: 3000,  
    hmr: {
        host: "localhost",
        port:3000,
        protocol: "ws",
    },
    // proxy : {
    //   '/chat-websocket' : {
    //     target: 'ws://localhost:8088/chat-websocket',
    //     ws: true,
    //     changeOrigin : true,
    //     rewrite: path => path.replace(/^\/chat-websocket/, ''),
    //     //rewriteWsOrigin: true,
    //   }
    // }
  }
});
