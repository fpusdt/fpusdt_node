/**
 * API路由 - TRON区块链接口
 */

const express = require('express');
const router = express.Router();
const TronService = require('../services/TronService');

const tronService = new TronService();

// ==================== 地址生成相关接口 ====================

/**
 * 生成TRON地址（简单版本）
 */
router.all('/createAddress', async (req, res) => {
  try {
    const result = await tronService.createAddress();
    res.json({
      code: 1,
      msg: '地址生成成功',
      data: result,
      time: Math.floor(Date.now() / 1000)
    });
  } catch (error) {
    res.json({
      code: 0,
      msg: `地址生成失败：${error.message}`,
      data: null,
      time: Math.floor(Date.now() / 1000)
    });
  }
});

/**
 * 通过助记词生成TRON地址
 */
router.all('/generateAddressWithMnemonic', async (req, res) => {
  try {
    const result = await tronService.generateAddressWithMnemonic();
    res.json({
      code: 1,
      msg: '助记词地址生成成功',
      data: result,
      time: Math.floor(Date.now() / 1000)
    });
  } catch (error) {
    res.json({
      code: 0,
      msg: `助记词地址生成失败：${error.message}`,
      data: null,
      time: Math.floor(Date.now() / 1000)
    });
  }
});

/**
 * 根据私钥获取地址信息
 */
router.all('/getAddressByKey', async (req, res) => {
  const privateKey = req.query.privateKey || req.body.privateKey || '';

  if (!privateKey) {
    return res.json({
      code: 0,
      msg: '私钥不能为空',
      data: null,
      time: Math.floor(Date.now() / 1000)
    });
  }

  try {
    const result = await tronService.getAddressByKey(privateKey);
    res.json({
      code: 1,
      msg: '获取地址成功',
      data: result,
      time: Math.floor(Date.now() / 1000)
    });
  } catch (error) {
    res.json({
      code: 0,
      msg: `获取地址失败：${error.message}`,
      data: null,
      time: Math.floor(Date.now() / 1000)
    });
  }
});

// ==================== 余额查询相关接口 ====================

/**
 * 查询TRX余额
 */
router.all('/getTrxBalance', async (req, res) => {
  const address = req.query.address || req.body.address || '';

  if (!address) {
    return res.json({
      code: 0,
      msg: '地址不能为空',
      data: null,
      time: Math.floor(Date.now() / 1000)
    });
  }

  try {
    const balance = await tronService.getTrxBalance(address);
    res.json({
      code: 1,
      msg: 'TRX余额查询成功',
      data: balance,
      time: Math.floor(Date.now() / 1000)
    });
  } catch (error) {
    res.json({
      code: 0,
      msg: `TRX余额查询失败：${error.message}`,
      data: null,
      time: Math.floor(Date.now() / 1000)
    });
  }
});

/**
 * 查询TRC20代币余额（如USDT）
 */
router.all('/getTrc20Balance', async (req, res) => {
  const address = req.query.address || req.body.address || '';

  if (!address) {
    return res.json({
      code: 0,
      msg: '地址不能为空',
      data: null,
      time: Math.floor(Date.now() / 1000)
    });
  }

  try {
    const balance = await tronService.getTrc20Balance(address);
    res.json({
      code: 1,
      msg: 'TRC20余额查询成功',
      data: balance,
      time: Math.floor(Date.now() / 1000)
    });
  } catch (error) {
    res.json({
      code: 0,
      msg: `TRC20余额查询失败：${error.message}`,
      data: null,
      time: Math.floor(Date.now() / 1000)
    });
  }
});

/**
 * 查询TRC10代币余额和信息
 */
router.all('/getTrc10Info', async (req, res) => {
  const address = req.query.address || req.body.address || 'TTAUj1qkSVK2LuZBResGu2xXb1ZAguGsnu';
  const tokenId = req.query.tokenId || req.body.tokenId || '1002992';

  try {
    const result = await tronService.getTrc10Info(address, tokenId);
    res.json({
      code: 1,
      msg: 'TRC10信息查询成功',
      data: result,
      time: Math.floor(Date.now() / 1000)
    });
  } catch (error) {
    res.json({
      code: 0,
      msg: `TRC10信息查询失败：${error.message}`,
      data: null,
      time: Math.floor(Date.now() / 1000)
    });
  }
});

// ==================== 转账相关接口 ====================

/**
 * TRX转账
 */
router.all('/sendTrx', async (req, res) => {
  const to = req.query.to || req.body.to || '';
  const amount = parseFloat(req.query.amount || req.body.amount || 0);
  const key = req.query.key || req.body.key || '';
  const message = req.query.message || req.body.message || null;

  // 参数验证
  if (!to || !key || amount <= 0) {
    return res.json({
      code: 0,
      msg: '参数不完整：需要接收地址、私钥和转账金额',
      data: null,
      time: Math.floor(Date.now() / 1000)
    });
  }

  try {
    const result = await tronService.sendTrx(to, amount, key, message);
    res.json({
      code: 1,
      msg: 'TRX转账成功',
      data: result,
      time: Math.floor(Date.now() / 1000)
    });
  } catch (error) {
    res.json({
      code: 0,
      msg: `TRX转账失败：${error.message}`,
      data: null,
      time: Math.floor(Date.now() / 1000)
    });
  }
});

/**
 * TRC20代币转账（如USDT）
 */
router.all('/sendTrc20', async (req, res) => {
  const to = req.query.to || req.body.to || '';
  const key = req.query.key || req.body.key || '';
  const amount = req.query.amount || req.body.amount || '1.000001';

  // 参数验证
  if (!to || !key) {
    return res.json({
      code: 0,
      msg: '参数不完整：需要接收地址和私钥',
      data: null,
      time: Math.floor(Date.now() / 1000)
    });
  }

  try {
    const result = await tronService.sendTrc20(to, amount, key);
    res.json({
      code: 1,
      msg: 'TRC20转账成功',
      data: result,
      time: Math.floor(Date.now() / 1000)
    });
  } catch (error) {
    res.json({
      code: 0,
      msg: `TRC20转账失败：${error.message}`,
      data: null,
      time: Math.floor(Date.now() / 1000)
    });
  }
});

/**
 * TRC10代币转账
 */
router.all('/sendTrc10', async (req, res) => {
  const tokenId = req.query.tokenId || req.body.tokenId || '1002992';
  const privateKey = req.query.key || req.body.key || '';
  const amount = parseInt(req.query.amount || req.body.amount || 1);
  const address = req.query.to || req.body.to || '';

  // 参数验证
  if (!privateKey || !address) {
    return res.json({
      code: 0,
      msg: '参数不完整：需要私钥和接收地址',
      data: null,
      time: Math.floor(Date.now() / 1000)
    });
  }

  try {
    const result = await tronService.sendTrc10(address, amount, tokenId, privateKey);

    if (result && result.result === true) {
      res.json({
        code: 1,
        msg: 'TRC10转账成功',
        data: result,
        time: Math.floor(Date.now() / 1000)
      });
    } else {
      res.json({
        code: 0,
        msg: 'TRC10转账失败',
        data: result,
        time: Math.floor(Date.now() / 1000)
      });
    }
  } catch (error) {
    res.json({
      code: 0,
      msg: `TRC10转账失败：${error.message}`,
      data: null,
      time: Math.floor(Date.now() / 1000)
    });
  }
});

// ==================== 交易查询相关接口 ====================

/**
 * 查询交易详情（通用）
 */
router.all('/getTransaction', async (req, res) => {
  const txID = req.query.txID || req.body.txID || '';

  if (!txID) {
    return res.json({
      code: 0,
      msg: '交易ID不能为空',
      data: null,
      time: Math.floor(Date.now() / 1000)
    });
  }

  try {
    const result = await tronService.getTransaction(txID);
    res.json({
      code: 1,
      msg: '交易查询成功',
      data: result,
      time: Math.floor(Date.now() / 1000)
    });
  } catch (error) {
    res.json({
      code: 0,
      msg: `交易查询失败：${error.message}`,
      data: null,
      time: Math.floor(Date.now() / 1000)
    });
  }
});

/**
 * 查询TRC20交易回执
 */
router.all('/getTrc20TransactionReceipt', async (req, res) => {
  const txHash = req.query.txID || req.body.txID || '';

  if (!txHash) {
    return res.json({
      code: 0,
      msg: '交易ID不能为空',
      data: null,
      time: Math.floor(Date.now() / 1000)
    });
  }

  try {
    const result = await tronService.getTrc20TransactionReceipt(txHash);
    res.json({
      code: 1,
      msg: 'TRC20交易回执查询成功',
      data: result,
      time: Math.floor(Date.now() / 1000)
    });
  } catch (error) {
    res.json({
      code: 0,
      msg: `TRC20交易回执查询失败：${error.message}`,
      data: null,
      time: Math.floor(Date.now() / 1000)
    });
  }
});

// ==================== 区块链信息查询接口 ====================

/**
 * 获取当前区块高度
 */
router.all('/getBlockHeight', async (req, res) => {
  try {
    const blockHeight = await tronService.getBlockHeight();
    res.json({
      code: 1,
      msg: '区块高度查询成功',
      data: blockHeight,
      time: Math.floor(Date.now() / 1000)
    });
  } catch (error) {
    res.json({
      code: 0,
      msg: `区块高度查询失败：${error.message}`,
      data: null,
      time: Math.floor(Date.now() / 1000)
    });
  }
});

/**
 * 根据区块号查询区块信息
 */
router.all('/getBlockByNumber', async (req, res) => {
  const blockID = req.query.blockID || req.body.blockID || '';

  if (!blockID) {
    return res.json({
      code: 0,
      msg: '区块号不能为空',
      data: null,
      time: Math.floor(Date.now() / 1000)
    });
  }

  try {
    const result = await tronService.getBlockByNumber(blockID);
    res.json({
      code: 1,
      msg: '区块信息查询成功',
      data: result,
      time: Math.floor(Date.now() / 1000)
    });
  } catch (error) {
    res.json({
      code: 0,
      msg: `区块信息查询失败：${error.message}`,
      data: null,
      time: Math.floor(Date.now() / 1000)
    });
  }
});

// ==================== 测试和工具接口 ====================

/**
 * API状态检查
 */
router.all('/status', (req, res) => {
  res.json({
    code: 1,
    msg: 'TRON API服务运行正常',
    data: {
      version: '3.0',
      node: 'https://api.trongrid.io',
      timestamp: Math.floor(Date.now() / 1000),
      date: new Date().toLocaleString('zh-CN')
    },
    time: Math.floor(Date.now() / 1000)
  });
});

/**
 * 获取API接口列表
 */
router.all('/getApiList', (req, res) => {
  const apiList = {
    '地址生成': {
      'createAddress': '生成TRON地址',
      'generateAddressWithMnemonic': '通过助记词生成地址',
      'getAddressByKey': '根据私钥获取地址'
    },
    '余额查询': {
      'getTrxBalance': '查询TRX余额',
      'getTrc20Balance': '查询TRC20代币余额',
      'getTrc10Info': '查询TRC10代币信息'
    },
    '转账功能': {
      'sendTrx': 'TRX转账',
      'sendTrc20': 'TRC20代币转账',
      'sendTrc10': 'TRC10代币转账'
    },
    '交易查询': {
      'getTransaction': '查询交易详情',
      'getTrc20TransactionReceipt': '查询TRC20交易回执'
    },
    '区块链信息': {
      'getBlockHeight': '获取区块高度',
      'getBlockByNumber': '根据区块号查询区块'
    },
    '工具接口': {
      'status': 'API状态检查',
      'getApiList': '获取接口列表'
    }
  };

  res.json({
    code: 1,
    msg: '接口列表获取成功',
    data: apiList,
    time: Math.floor(Date.now() / 1000)
  });
});

module.exports = router;