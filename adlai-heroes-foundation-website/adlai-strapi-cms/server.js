const strapi = require('@strapi/strapi');

const app = strapi({
  appDir: __dirname,
  distDir: './dist',
});

app.start();