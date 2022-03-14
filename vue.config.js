const path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir);
}

const webpack = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// const productionGzipExtensions = ['js', 'css']
// const isProduction = process.env.NODE_ENV === 'production'

// const cdn = {
//   js: [
//     "https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js",
//     "https://cdn.jsdelivr.net/npm/vuex@3.4.0/dist/vuex.min.js",
//     "https://cdn.jsdelivr.net/npm/vue-router@3.4.3/dist/vue-router.min.js",
//     "https://cdn.jsdelivr.net/npm/axios@0.21.0/dist/axios.min.js",
//     "https://cdn.jsdelivr.net/npm/vue-i18n@9.1.9/dist/vue-i18n.global.prod.js",
//     "https://cdn.jsdelivr.net/npm/vue-clipboard2@0.3.1/dist/vue-clipboard.min.js",
//   ]
// };

module.exports = {
  // 生产环境打包不输出 map
  // productionSourceMap: false,
  devServer: {
    disableHostCheck: true,
    port: process.env.DEV_SERVER_PORT || 8080,
    proxy: {
      '^/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/',
        },
      },
    },
  },
  pwa: {
    name: 'HowlerMusic',
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
    },
    themeColor: '#ffffff00',
    manifestOptions: {
      background_color: '#335eea',
    },
    // workboxOptions: {
    //   swSrc: "dev/sw.js",
    // },
  },
  // 打包忽略文件
  // configureWebpack: {
  //   externals: {
  //     vue: 'Vue',
  //     vuex: 'Vuex',
  //     "vue-router": 'VueRouter',
  //     axios: "axios",
  //     "vue-i18n": 'VueI18n',
  //     "vue-clipboard2": 'VueClipboard'
  //   },
  // },
  // 入口配置
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'HowlerMusic',
      chunks: ['main', 'chunk-vendors', 'chunk-common', 'index'],
    },
  },
  chainWebpack(config) {
    config.module.rules.delete('svg');
    config.module.rule('svg').exclude.add(resolve('src/assets/icons')).end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end();

      // 生产环境，开启js\css压缩
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compression-webpack-plugin').use(new CompressionWebpackPlugin({
        test: /\.(js|css|less)$/, // 匹配文件名
        threshold: 10240, // 对超过10k的数据压缩
        minRatio: 0.8,
        deleteOriginalAssets: true // 删除源文件
      }))
      config.plugin('chunckPlugin').use(webpack.optimize.LimitChunkCountPlugin,[{
        maxChunks: 4,
        minChunkSize: 100
      }])
    }

  },
  // configureWebpack: {
  //   resolve: {
  //     alias: {

  //     }
  //   },
  //   plugins: [
  //     new CompressionWebpackPlugin({
  //       algorithm: 'gzip',
  //       test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
  //       threshold: 10240, // 对超过10k的数据压缩
  //       minRatio: 0.8,
  //       deleteOriginalAssets: true //删除源文件
  //     }),
  //     new webpack.optimize.LimitChunkCountPlugin({
  //       maxChunks: 5,
  //       minChunkSize: 100
  //     })
  //   ]

  // }
};
