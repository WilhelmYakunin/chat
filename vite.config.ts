import { defineConfig } from 'vite';
import postcssNesting from 'postcss-nesting';
import { env } from 'process';

import { config } from 'dotenv';
config();

export const port: number = Number(env.PORT) | 3000;

export default defineConfig({
  server: {
    port: port,
  },
  preview: {
    port: port,
  },
  css: {
    postcss: {
      plugins: [postcssNesting],
    },
  },
});
