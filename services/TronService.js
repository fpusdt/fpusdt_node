/**
 * TRON区块链服务类
 *
 * 基于TronWeb SDK实现TRON区块链交互功能
 */

const TronWeb = require('tronweb');
const bip39 = require('bip39');
const hdkey = require('hdkey');
const config = require('../config/config');

class TronService {
  constructor() {
    // 初始化TronWeb实例
    this.tronWeb = new TronWeb({
      fullHost: config.tron.fullNode,
      solidityNode: config.tron.solidityNode || config.tron.fullNode,
      eventServer: config.tron.eventServer || config.tron.fullNode,
      headers: config.tron.apiKey ? { 'TRON-PRO-API-KEY': config.tron.apiKey } : {},
      privateKey: undefined // 不设置默认私钥，每次交易时单独设置
    });

    // TRC20合约配置
    this.trc20Config = config.trc20;

    // 验证配置
    this.validateConfig();
  }

  /**
   * 验证配置是否正确
   */
  validateConfig() {
    if (!this.trc20Config.contractAddress) {
      console.warn('警告: TRC20合约地址未配置');
    }

    if (!config.tron.fullNode) {
      throw new Error('TRON节点配置不能为空');
    }

    console.log('TronService初始化完成，节点:', config.tron.fullNode);
  }

  // ==================== 地址生成相关方法 ====================

  /**
   * 生成TRON地址（简单版本）
   */
  async createAddress() {
    try {
      const account = await this.tronWeb.createAccount();
      return {
        privateKey: account.privateKey,
        address: account.address.base58,
        hexAddress: account.address.hex
      };
    } catch (error) {
      throw new Error(`地址生成失败: ${error.message}`);
    }
  }

  /**
   * 通过助记词生成TRON地址
   */
  async generateAddressWithMnemonic() {
    try {
      // 生成助记词
      const mnemonic = bip39.generateMnemonic(128);

      // 从助记词生成地址
      const addressInfo = await this.mnemonicToTronAddress(mnemonic);

      return {
        ...addressInfo,
        mnemonic: mnemonic
      };
    } catch (error) {
      throw new Error(`助记词地址生成失败: ${error.message}`);
    }
  }

  /**
   * 根据私钥获取地址信息
   */
  async getAddressByKey(privateKey) {
    try {
      // 验证私钥格式
      if (!privateKey || privateKey.length !== 64) {
        throw new Error('私钥格式不正确，应为64位十六进制字符串');
      }

      // 从私钥生成地址
      const address = this.tronWeb.address.fromPrivateKey(privateKey);
      const hexAddress = this.tronWeb.address.toHex(address);

      return {
        privateKey: privateKey,
        address: address,
        hexAddress: hexAddress
      };
    } catch (error) {
      throw new Error(`根据私钥获取地址失败: ${error.message}`);
    }
  }

  // ==================== 余额查询相关方法 ====================

  /**
   * 查询TRX余额
   */
  async getTrxBalance(address) {
    try {
      const balance = await this.tronWeb.trx.getBalance(address);
      return balance; // 返回SUN单位，1 TRX = 1,000,000 SUN
    } catch (error) {
      throw new Error(`TRX余额查询失败: ${error.message}`);
    }
  }

  /**
   * 查询TRC20代币余额（默认USDT）
   */
  async getTrc20Balance(address) {
    try {
      // 验证地址格式
      if (!this.tronWeb.isAddress(address)) {
        throw new Error('无效的TRON地址格式');
      }

      // 获取合约实例
      const contract = await this.tronWeb.contract().at(this.trc20Config.contractAddress);

      // 调用balanceOf方法
      const balance = await contract.balanceOf(address).call();

      // 检查返回值
      if (balance === undefined || balance === null) {
        throw new Error('合约调用返回空值，可能是网络问题或合约地址错误');
      }

      // 转换为可读格式
      const decimals = this.trc20Config.decimals;
      const balanceNumber = this.tronWeb.BigNumber(balance);
      const balanceFormatted = balanceNumber.dividedBy(Math.pow(10, decimals)).toFixed(decimals);

      return {
        balance: balanceFormatted,
        balanceRaw: balance.toString(),
        decimals: decimals,
        contractAddress: this.trc20Config.contractAddress,
        address: address,
        symbol: 'USDT'
      };
    } catch (error) {
      throw new Error(`TRC20余额查询失败: ${error.message}`);
    }
  }

  /**
   * 查询TRC10代币信息
   */
  async getTrc10Info(address, tokenId) {
    try {
      // 获取TRX余额
      const trxBalance = await this.getTrxBalance(address);

      // 获取TRC10代币余额 - 使用正确的API方法
      let tokenBalance = 0;
      try {
        const account = await this.tronWeb.trx.getAccount(address);
        if (account && account.assetV2) {
          const asset = account.assetV2.find(a => a.key === tokenId);
          tokenBalance = asset ? asset.value : 0;
        }
      } catch (balanceError) {
        console.log('获取TRC10余额失败:', balanceError.message);
        tokenBalance = 0;
      }

      // 获取代币信息
      let tokenInfo = null;
      try {
        tokenInfo = await this.tronWeb.trx.getTokenById(tokenId);
      } catch (tokenError) {
        console.log('获取代币信息失败:', tokenError.message);
        tokenInfo = {
          id: tokenId,
          name: 'Unknown Token',
          abbr: 'UNKNOWN',
          description: '代币信息获取失败'
        };
      }

      // 生成新地址演示
      const newAddress = await this.createAddress();

      return {
        getBalance: trxBalance,
        getTokenBalance: tokenBalance,
        getTokenByID: tokenInfo,
        generateAddress: newAddress,
        address: address,
        tokenId: tokenId
      };
    } catch (error) {
      throw new Error(`TRC10信息查询失败: ${error.message}`);
    }
  }

  // ==================== 转账相关方法 ====================

  /**
   * TRX转账
   */
  async sendTrx(to, amount, privateKey, message = null) {
    try {
      // 设置私钥
      this.tronWeb.setPrivateKey(privateKey);

      // 获取发送方地址
      const fromAddress = this.tronWeb.address.fromPrivateKey(privateKey);

      // 转换金额为SUN单位
      const amountInSun = this.tronWeb.toSun(amount);

      let transaction;
      if (message) {
        // 带消息的转账
        transaction = await this.tronWeb.transactionBuilder.sendTrx(to, amountInSun, fromAddress, message);
      } else {
        // 普通转账
        transaction = await this.tronWeb.transactionBuilder.sendTrx(to, amountInSun, fromAddress);
      }

      // 签名交易
      const signedTransaction = await this.tronWeb.trx.sign(transaction);

      // 广播交易
      const result = await this.tronWeb.trx.sendRawTransaction(signedTransaction);

      return {
        result: result.result || false,
        txid: result.txid || signedTransaction.txID,
        txID: result.txid || signedTransaction.txID
      };
    } catch (error) {
      throw new Error(`TRX转账失败: ${error.message}`);
    }
  }

  /**
   * TRC20代币转账（默认USDT）
   */
  async sendTrc20(to, amount, privateKey) {
    try {
      // 验证参数
      if (!this.tronWeb.isAddress(to)) {
        throw new Error('无效的接收地址格式');
      }

      // 设置私钥
      this.tronWeb.setPrivateKey(privateKey);

      // 获取合约实例
      const contract = await this.tronWeb.contract().at(this.trc20Config.contractAddress);

      // 转换金额
      const decimals = this.trc20Config.decimals;
      const amountInWei = this.tronWeb.BigNumber(parseFloat(amount)).multipliedBy(Math.pow(10, decimals)).toString();

      // 执行转账
      const result = await contract.transfer(to, amountInWei).send({
        feeLimit: 100000000, // 100 TRX fee limit
        callValue: 0,
        shouldPollResponse: true
      });

      return {
        result: result && (result.result === true || result.length > 0),
        txid: result.txid || result,
        txID: result.txid || result,
        transaction: result
      };
    } catch (error) {
      throw new Error(`TRC20转账失败: ${error.message}`);
    }
  }

  /**
   * TRC10代币转账
   */
  async sendTrc10(to, amount, tokenId, privateKey) {
    try {
      // 设置私钥
      this.tronWeb.setPrivateKey(privateKey);

      // 获取发送方地址
      const fromAddress = this.tronWeb.address.fromPrivateKey(privateKey);

      // 发送TRC10代币
      const result = await this.tronWeb.trx.sendToken(to, amount, tokenId, fromAddress);

      return result;
    } catch (error) {
      throw new Error(`TRC10转账失败: ${error.message}`);
    }
  }

  // ==================== 交易查询相关方法 ====================

  /**
   * 查询交易详情
   */
  async getTransaction(txID) {
    try {
      const transaction = await this.tronWeb.trx.getTransaction(txID);
      return transaction;
    } catch (error) {
      throw new Error(`交易查询失败: ${error.message}`);
    }
  }

  /**
   * 查询TRC20交易回执
   */
  async getTrc20TransactionReceipt(txHash) {
    try {
      const receipt = await this.tronWeb.trx.getTransactionInfo(txHash);
      return receipt;
    } catch (error) {
      throw new Error(`TRC20交易回执查询失败: ${error.message}`);
    }
  }

  // ==================== 区块链信息查询方法 ====================

  /**
   * 获取当前区块高度
   */
  async getBlockHeight() {
    try {
      const currentBlock = await this.tronWeb.trx.getCurrentBlock();
      return currentBlock.block_header.raw_data.number;
    } catch (error) {
      throw new Error(`区块高度查询失败: ${error.message}`);
    }
  }

  /**
   * 根据区块号查询区块信息
   */
  async getBlockByNumber(blockId) {
    try {
      let block;
      if (blockId === 'latest') {
        block = await this.tronWeb.trx.getCurrentBlock();
      } else {
        block = await this.tronWeb.trx.getBlock(parseInt(blockId));
      }
      return block;
    } catch (error) {
      throw new Error(`区块信息查询失败: ${error.message}`);
    }
  }

  // ==================== 私有辅助方法 ====================

  /**
   * 助记词转TRON地址
   */
  async mnemonicToTronAddress(mnemonic) {
    try {
      if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error('无效的助记词');
      }

      // 生成种子
      const seed = await bip39.mnemonicToSeed(mnemonic);

      // 生成HDKey
      const root = hdkey.fromMasterSeed(seed);

      // TRON的派生路径是44'/195'/0'/0/0
      const child = root.derive("m/44'/195'/0'/0/0");

      // 获取私钥
      const privateKey = child.privateKey.toString('hex');

      // 生成地址
      const address = this.tronWeb.address.fromPrivateKey(privateKey);
      const hexAddress = this.tronWeb.address.toHex(address);

      return {
        address: address,
        privateKey: privateKey,
        hexAddress: hexAddress
      };
    } catch (error) {
      throw new Error(`助记词转地址失败: ${error.message}`);
    }
  }

  /**
   * 验证TRON地址格式
   */
  isValidAddress(address) {
    return this.tronWeb.isAddress(address);
  }

  /**
   * 地址格式转换：Base58 -> Hex
   */
  addressToHex(address) {
    return this.tronWeb.address.toHex(address);
  }

  /**
   * 地址格式转换：Hex -> Base58
   */
  hexToAddress(hex) {
    return this.tronWeb.address.fromHex(hex);
  }
}

module.exports = TronService;