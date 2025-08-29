/**
 * 首页路由
 */

const express = require('express');
const router = express.Router();

// 首页控制器
router.get('/', (req, res) => {
  // 动态获取当前域名
  const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const currentDomain = `${protocol}://${req.get('host')}`;

  // 页面数据
  const pageData = getPageData(currentDomain);

  res.render('index', {
    currentDomain,
    pageData,
    updateTime: new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) + '年月日 时:分:秒'.replace(/(\d{4})年(\d{2})月(\d{2})日 (\d{2}):(\d{2}):(\d{2})/, '$1年$2月$3日 $4:$5:$6')
  });
});

/**
 * 获取页面数据
 */
function getPageData(domain) {
  return {
    features: [
      {
        icon: '💼',
        title: '钱包管理',
        desc: '支持批量生成TRON钱包地址，提供完整的私钥和助记词管理功能，确保资产安全'
      },
      {
        icon: '📊',
        title: '余额查询',
        desc: '实时查询TRX和各类TRC20代币余额，支持批量查询，响应速度快'
      },
      {
        icon: '🔐',
        title: '交易处理',
        desc: '提供安全可靠的转账功能，支持TRX和TRC20代币转账，手续费透明'
      },
      {
        icon: '⚡',
        title: '高性能',
        desc: '基于Node.js开发，优化的接口性能，支持高并发访问'
      },
      {
        icon: '🛡️',
        title: '安全稳定',
        desc: '企业级安全架构，多重验证机制，确保交易和数据的安全性'
      },
      {
        icon: '📖',
        title: '文档完善',
        desc: '提供详细的API文档和示例代码，支持多种编程语言调用'
      }
    ],
    apiTests: [
      {
        icon: '💳',
        title: '生成钱包地址',
        url: `${domain}/api/createAddress`,
        class: ''
      },
      {
        icon: '💵',
        title: '查询USDT余额',
        url: `${domain}/api/getTrc20Balance?address=TTAUj1qkSVK2LuZBResGu2xXb1ZAguGsnu`,
        class: ''
      },
      {
        icon: '⚡',
        title: '查询TRX余额',
        url: `${domain}/api/getTrxBalance?address=TEjKST74gKeKzjovquhuKUkvCuakmadwvP`,
        class: ''
      },
      {
        icon: '📋',
        title: '完整接口文档',
        url: `${domain}/docs`,
        class: 'special-card'
      }
    ]
  };
}

module.exports = router;