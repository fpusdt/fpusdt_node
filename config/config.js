/**
 * TRON API 配置文件
 */

module.exports = {
  // 服务器配置
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  },

  // TRON网络配置
  tron: {
    fullNode: process.env.TRON_FULL_NODE || 'https://api.trongrid.io',
    solidityNode: process.env.TRON_SOLIDITY_NODE || 'https://api.trongrid.io',
    eventServer: process.env.TRON_EVENT_SERVER || 'https://api.trongrid.io',
    apiKey: process.env.TRON_API_KEY || '',
    network: process.env.TRON_NETWORK || 'mainnet'
  },

  // TRC20合约配置
  trc20: {
    contractAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', // USDT合约地址
    decimals: 6
  },

  // 测试地址配置
  test: {
    address: 'TTAUj1qkSVK2LuZBResGu2xXb1ZAguGsnu',
    privateKey: process.env.TEST_PRIVATE_KEY || ''
  },

  // API配置
  api: {
    version: '3.0',
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 100 // 最大请求数
    }
  },

  // 安全配置
  security: {
    corsOptions: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }
  }
};