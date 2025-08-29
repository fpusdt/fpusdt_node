/**
 * API文档路由
 */

const express = require('express');
const router = express.Router();

// 文档页面
router.get('/', (req, res) => {
  // 动态获取当前域名
  const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const currentDomain = `${protocol}://${req.get('host')}`;

  // API数据
  const apiData = getApiData(currentDomain);

  // 生成扁平化菜单
  const flatMenu = generateFlatMenu(apiData);

  res.render('docs', {
    currentDomain,
    apiData,
    flatMenu,
    updateTime: new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(/(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2}):(\d{2})/, '$1年$2月$3日 $4:$5:$6')
  });
});

/**
 * 获取API数据
 */
function getApiData(domain) {
  return {
    wallet: {
      title: '💳 钱包管理接口',
      apis: [
        {
          icon: '❤️',
          title: '生成钱包地址',
          method: 'GET',
          url: `${domain}/v1/createAddress`,
          description: '生成一个新的TRON钱包地址和私钥',
          params: [],
          testUrl: `${domain}/v1/createAddress`
        },
        {
          icon: '🍎',
          title: '生成带助记词的钱包地址',
          method: 'GET',
          url: `${domain}/v1/generateAddressWithMnemonic`,
          description: '生成带助记词的TRON钱包地址，更安全的钱包创建方式',
          params: [],
          testUrl: `${domain}/v1/generateAddressWithMnemonic`
        },
        {
          icon: '🔑',
          title: '私钥获取地址',
          method: 'GET',
          url: `${domain}/v1/getAddressByKey`,
          description: '根据私钥获取对应的钱包地址信息',
          params: [
            { name: 'privateKey', type: 'string', required: '是', desc: '私钥字符串' }
          ],
          testUrl: `${domain}/v1/getAddressByKey?privateKey=your_private_key_here`
        }
      ]
    },
    balance: {
      title: '💰 余额查询接口',
      apis: [
        {
          icon: '🧡',
          title: '查询TRC20余额(USDT)',
          method: 'GET',
          url: `${domain}/v1/getTrc20Balance?address={address}`,
          description: '查询指定地址的TRC20代币余额（如USDT）',
          params: [
            { name: 'address', type: 'string', required: '是', desc: 'TRON钱包地址' }
          ],
          testUrl: `${domain}/v1/getTrc20Balance?address=TTAUj1qkSVK2LuZBResGu2xXb1ZAguGsnu`
        },
        {
          icon: '⚽',
          title: '查询TRX余额',
          method: 'GET',
          url: `${domain}/v1/getTrxBalance?address={address}`,
          description: '查询指定地址的TRX原生代币余额',
          params: [
            { name: 'address', type: 'string', required: '是', desc: 'TRON钱包地址' }
          ],
          testUrl: `${domain}/v1/getTrxBalance?address=TEjKST74gKeKzjovquhuKUkvCuakmadwvP`
        },
        {
          icon: '🎯',
          title: '查询TRC10信息',
          method: 'GET',
          url: `${domain}/v1/getTrc10Info?address={address}&tokenId={tokenId}`,
          description: '查询TRC10代币余额和详细信息',
          params: [
            { name: 'address', type: 'string', required: '否', desc: 'TRON钱包地址（可选）' },
            { name: 'tokenId', type: 'string', required: '否', desc: 'TRC10代币ID（可选）' }
          ],
          testUrl: `${domain}/v1/getTrc10Info`
        }
      ]
    },
    transaction: {
      title: '📊 交易查询接口',
      apis: [
        {
          icon: '💛',
          title: '查询交易详情（通用）',
          method: 'GET',
          url: `${domain}/v1/getTransaction?txID={txID}`,
          description: '根据交易ID查询交易的详细信息（支持TRX、TRC20、TRC10）',
          params: [
            { name: 'txID', type: 'string', required: '是', desc: '交易哈希ID' }
          ],
          testUrl: `${domain}/v1/getTransaction?txID=your_transaction_hash`
        },
        {
          icon: '🏀',
          title: '查询TRC20交易回执',
          method: 'GET',
          url: `${domain}/v1/getTrc20TransactionReceipt?txID={txID}`,
          description: '根据交易ID查询TRC20交易的回执信息',
          params: [
            { name: 'txID', type: 'string', required: '是', desc: '交易哈希ID' }
          ],
          testUrl: `${domain}/v1/getTrc20TransactionReceipt?txID=your_transaction_hash`
        }
      ]
    },
    transfer: {
      title: '💸 转账功能接口',
      apis: [
        {
          icon: '🖤',
          title: 'TRC20转账（USDT）',
          method: 'POST',
          url: `${domain}/v1/sendTrc20`,
          description: '发送TRC20代币转账交易（如USDT）',
          params: [
            { name: 'to', type: 'string', required: '是', desc: '接收方地址' },
            { name: 'amount', type: 'string', required: '是', desc: '转账金额' },
            { name: 'key', type: 'string', required: '是', desc: '发送方私钥' }
          ],
          warning: '私钥是敏感信息，请确保在安全环境下使用此接口，建议使用HTTPS协议。'
        },
        {
          icon: '🏈',
          title: 'TRX转账',
          method: 'POST',
          url: `${domain}/v1/sendTrx`,
          description: '发送TRX原生代币转账交易',
          params: [
            { name: 'to', type: 'string', required: '是', desc: '接收方地址' },
            { name: 'amount', type: 'float', required: '是', desc: '转账金额(单位:TRX)' },
            { name: 'key', type: 'string', required: '是', desc: '发送方私钥' },
            { name: 'message', type: 'string', required: '否', desc: '转账备注信息' }
          ]
        },
        {
          icon: '⚾',
          title: 'TRC10转账',
          method: 'POST',
          url: `${domain}/v1/sendTrc10`,
          description: '发送TRC10代币转账交易',
          params: [
            { name: 'to', type: 'string', required: '是', desc: '接收方地址' },
            { name: 'amount', type: 'string', required: '是', desc: '转账金额' },
            { name: 'key', type: 'string', required: '是', desc: '发送方私钥' },
            { name: 'tokenId', type: 'string', required: '否', desc: 'TRC10代币ID（默认1002992）' }
          ]
        }
      ]
    },
    tools: {
      title: '🔧 工具接口',
      apis: [
        {
          icon: '⏰',
          title: 'API状态检查',
          method: 'GET',
          url: `${domain}/v1/status`,
          description: '检查TRON API服务运行状态',
          params: [],
          testUrl: `${domain}/v1/status`
        },
        {
          icon: '🧭',
          title: '获取接口列表',
          method: 'GET',
          url: `${domain}/v1/getApiList`,
          description: '获取所有可用的API接口列表和说明',
          params: [],
          testUrl: `${domain}/v1/getApiList`
        }
      ]
    },
    blockchain: {
      title: '⛓️ 区块链查询接口',
      apis: [
        {
          icon: '💙',
          title: '获取当前区块高度',
          method: 'GET',
          url: `${domain}/v1/getBlockHeight`,
          description: '获取TRON网络当前最新区块高度',
          params: [],
          testUrl: `${domain}/v1/getBlockHeight`
        },
        {
          icon: '💜',
          title: '根据区块号查询区块信息',
          method: 'GET',
          url: `${domain}/v1/getBlockByNumber?blockID={blockID}`,
          description: '根据区块号查询区块的详细信息',
          params: [
            { name: 'blockID', type: 'string', required: '是', desc: '区块号或区块ID' }
          ],
          testUrl: `${domain}/v1/getBlockByNumber?blockID=latest`
        }
      ]
    }
  };
}

/**
 * 生成二级菜单
 */
function generateFlatMenu(apiData) {
  const menu = [];

  // 添加公告
  menu.push({
    id: 'notice',
    icon: '⚠️',
    title: '重要公告',
    anchor: 'notice',
    type: 'single'
  });

  // 遍历所有分类的API
  Object.keys(apiData).forEach(categoryKey => {
    const category = apiData[categoryKey];
    const children = [];
    let categoryIndex = 1;

    category.apis.forEach(api => {
      children.push({
        id: `${categoryKey}_${categoryIndex}`,
        icon: api.icon,
        title: api.title,
        anchor: `${categoryKey}_${categoryIndex}`,
        method: api.method
      });
      categoryIndex++;
    });

    menu.push({
      id: categoryKey,
      title: category.title,
      anchor: categoryKey,
      type: 'category',
      expanded: true,
      children: children
    });
  });

  return menu;
}

module.exports = router;