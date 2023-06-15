const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        // 支持多个scss样式文件，
        //老版本sass-loader的options参数名为data,
        //新版本sass-loader把data改为了prependData
        prependData: `@import "@/assets/css/global.scss";`
      }
    }
  },
  devServer: {
    https: false,
    proxy: {
      '/elephone': {
        target: 'http://192.168.3.11:8088',
        changeOrigin: true,
        // pathRewrite: {
        //   '^/api': ''
        // }
      }
    }
  },
})
