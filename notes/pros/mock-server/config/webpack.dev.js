const path = require('path');
const webpack = require('webpack');

const { mockServer } = require('./utils');

module.exports = ({ mode, mock }) => ({
  mode,
  devServer: {
    before: (app) => {
      console.log('qidong');
      mock && mockServer(path.resolve(__dirname, '../mock/'), app);
    },
    contentBase: path.join(__dirname, 'dist'),
    // compress: true,
    port: 9000,
    proxy: mock
      ? {}
      : {
          '/api': {
            target: 'http://localhost:3000',
            pathRewrite: { '^/api': '' },
          },
        },
  },
});
