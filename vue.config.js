// vue-cli的配置文件
// https://cli.vuejs.org/zh/config/  文档地址
module.exports = {
  publicPath: './',
  assetsDir: 'static',
  devServer: {
    port: 3000,
    //    open: true,
    //    跨域配置
    //    proxy: 'http://mobilecdnbj.kugou.com'
    proxy: {
      // 碰到以/api开头的请求,转发给target的地址
      '/api': {
        // 目标地址
        target: 'http://mobilecdnbj.kugou.com/api',
        // 是否为websocket协议
        // ws: true,
        changeOrigin: true,
        // 路径重写,取掉一个/api
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
