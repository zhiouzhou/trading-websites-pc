//const CompressionWebpackPlugin = require('compression-webpack-plugin');
const path = require('path');
const resolve = (dir) => path.join(__dirname, dir);
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);

function addStyleResource(rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/assets/stylus/variable.styl'),
      ],
    })
}

module.exports = {
  baseUrl: '', // 默认'/'，部署应用包时的基本 URL
  outputDir: 'dist', // 'dist', 生产环境构建文件的目录
  assetsDir: '', // 相对于outputDir的静态资源(js、css、img、fonts)目录
  lintOnSave: false,
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  productionSourceMap: false, // 生产环境的 source map

  configureWebpack: config => {
    // config.externals = {
    //   'vue': 'Vue',
    //   'vue-router': 'VueRouter',
    //   'vuex': 'Vuex',
    //   'axios': 'axios'
    // }
        const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

    if (IS_PROD) {
      const plugins = [];
           plugins.push(
            new UglifyJsPlugin({
			          uglifyOptions: {
			            compress: {
			              warnings: false,
			              drop_console: true,//console
			              drop_debugger: true,
			              pure_funcs: ['console.log']//移除console
			            }
			          }
			      })
           );
      config.plugins = [
        ...config.plugins,
        ...plugins
      ];
    }

  },
  chainWebpack: config => {

    // 添加别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('api', resolve('src/api'))
      .set('common', resolve('src/common'))
      .set('components', resolve('src/components'))
      .set('views', resolve('src/views'))
      .set('service', resolve('src/service'));

    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('stylus').oneOf(type)))
  },
  css: {
    modules: false,
    extract: IS_PROD,//IS_PROD ==>true
    sourceMap: false,
    loaderOptions: {
      // px转换为rem 移动端
      // postcss: {
      //  plugins: [
      //   require('postcss-pxtorem')({
      //    rootValue : 1, // 换算的基数
      //    selectorBlackList : ['weui', 'el'], // 忽略转换正则匹配项
      //    propList  : ['*']
      //   })
      //  ]
      // }
    }
  },
  pluginOptions: {

  },
  parallel: require('os').cpus().length > 1,
  pwa: {},
  devServer: {
    // overlay: {
    //  warnings: true,
    //  errors: true
    // },
    open: !IS_PROD,
    host: '0.0.0.0',
    port: 8888,
    https: false,
    historyApiFallback:true,
    hotOnly: true,
    proxy: {
      '/ua': {
         target: 'http://ua2.release.yijiupidev.com/himalaya-ApiService-UA2/',
//      target: 'http://ua2.pre.yijiupi.com/himalaya-ApiService-UA2/',
        changeOrigin: true,
        ws: false,
        pathRewrite: { '^/ua': '' }
      },
      '/pay': {
        target: 'http://172.16.1.119:9100/',
        changeOrigin: true,
        ws: false,
        pathRewrite: { '^/pay': '' }
      },
      '/getAuth': {
          target: 'http://apitrackauth.release.yijiupidev.com/',
//    target: 'http://mall.pre.yijiupi.com/v29/',
        ws: false,
        changeOrigin: true
      },
      '/2019': {
          target: 'https://yjp-trackdata.cn-bj.ufileos.com/',
//    target: 'http://mall.pre.yijiupi.com/v29/',
        ws: false,
        changeOrigin: true
      },
      '/': {
        target: 'http://mall.release.yijiupidev.com/v31/',
//      target: 'http://mall.pre.yijiupi.com/v31/',
        ws: false,
        changeOrigin: true
      },

    },
		disableHostCheck: true
  }
};
