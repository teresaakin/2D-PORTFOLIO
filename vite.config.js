import { defineConfig } from 'vite'

export default defineConfig({
  // helps find assets
    base: "./",
    build: {
      minify: "terser", //terser minimizes code--makes it smaller 
    },
})