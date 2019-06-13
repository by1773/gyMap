const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const cesiumSource = './node_modules/cesium/Source'
// const cesiumNavi = './node_modules/cesium-navigation/navigation'
const cesiumWorkers = '../Build/Cesium/Workers'

function resolve (dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  configureWebpack: {
    output: {
      sourcePrefix: ' '
    },
    amd: {
      toUrlUndefined: true
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': resolve('src'),
        '_c': path.resolve('src/components'),
        'cesium': path.resolve(__dirname, cesiumSource)
        // 'cesiumNavi': path.resolve(__dirname, cesiumNavi)
      }
    },
    module: {
      unknownContextRegExp: /^.\/.*$/, // 这里好像会有错误，先注释了
      unknownContextCritical: false
    },
    plugins: [
      new CopyWebpackPlugin([{ from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }]),
      new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }]),
      new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }]),
      // 更新，加载kml时候需要这个
      new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'ThirdParty/Workers'), to: 'ThirdParty/Workers' }]),
      new webpack.DefinePlugin({
        // Define relative base path in cesium for loading assets
        // 定义 Cesium 从哪里加载资源，如果使用默认的''，却变成了绝对路径了，所以这里使用'./',使用相对路径
        CESIUM_BASE_URL: JSON.stringify('./')
      })
    ]
  }
}
