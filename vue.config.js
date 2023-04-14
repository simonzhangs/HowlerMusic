const path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir);
}

const webpack = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

module.exports = {
  // 生产环境打包不输出 map
  productionSourceMap: false,
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
  },
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
      config.plugin('chunkPlugin').use(webpack.optimize.LimitChunkCountPlugin,[{
        maxChunks: 5,
        minChunkSize: 100
      }])
    }

    // 打包体积分析
    // config.plugin('webpack-bundle-analyzer')
    //       .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
  },
};