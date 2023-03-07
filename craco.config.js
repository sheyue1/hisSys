const CracoLessPlugin = require("craco-less");
module.exports = {
  // antd按需引入
  babel: {
    plugins: [
      [
        "import",
        {
          libraryName: "antd",
          libraryDirectory: "es",
          //可以设置为true即是less,注意！！！！此时不需要加引号
          //也可以设置为css,css需要加引号
          style: true,
        },
      ],
    ],
  },
  //   配置主题
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { "@primary-color": "#16a085" },
            javascriptEnabled: true, //设置为true即是less
          },
        },
      },
    },
  ],
};
