# TRC20 API Node.js 版本 ⚡

![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18+-000000?style=flat&logo=express&logoColor=white)
![TronWeb](https://img.shields.io/badge/TronWeb-5.3+-FF6060?style=flat&logo=tron&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

专业的 TRON 区块链接口服务 - Node.js 版本，高性能、企业级 API 解决方案

## ✨ 功能特性

- 🚀 **高性能**: 基于 Node.js 异步 I/O，支持高并发访问
- 💼 **钱包管理**: 支持批量生成 TRON 钱包地址，提供完整的私钥和助记词管理功能
- 📊 **余额查询**: 实时查询 TRX 和各类 TRC20 代币余额，支持批量查询
- 🔐 **交易处理**: 提供安全可靠的转账功能，支持 TRX 和 TRC20 代币转账
- ⛓️ **区块链查询**: 支持区块信息、交易详情等查询功能
- 📖 **完善文档**: 提供详细的 API 文档和示例代码
- 🌐 **响应式界面**: 移动端友好的 Web 界面和 API 文档

## 📋 API 功能清单

### 🔐 地址生成功能

- ✅ 生成 TRON 钱包地址
- ✅ 通过助记词生成地址
- ✅ 根据私钥获取地址信息

### 💰 余额查询功能

- ✅ 查询 TRX 余额
- ✅ 查询 TRC20 代币余额（USDT）
- ✅ 查询 TRC10 代币信息

### 💸 转账功能

- ✅ TRX 转账
- ✅ TRC20 代币转账
- ✅ TRC10 代币转账

### 📊 交易查询功能

- ✅ 查询交易详情
- ✅ 查询 TRC20 交易回执

### ⛓️ 区块链信息查询

- ✅ 获取当前区块高度
- ✅ 根据区块号查询区块信息

### 🔧 工具接口

- ✅ API 状态检查
- ✅ 获取接口列表

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 16.0.0
- **npm**: >= 8.0.0

### 安装与启动

```bash
# 1. 克隆项目
git clone https://github.com/fpusdt/fpusdt_node.git
cd fpusdt_node

# 2. 安装依赖
npm install

# 3. 启动服务
npm start

# 4. 开发模式（热重载）
npm run dev
```

### 访问服务

启动后可访问：

- **首页**: http://localhost:3000
- **API 文档**: http://localhost:3000/docs
- **API 状态**: http://localhost:3000/api/status

## 🎯 API 接口总览

总计实现 **15 个核心接口**：

| 分类       | 接口                               | 描述           |
| ---------- | ---------------------------------- | -------------- |
| 地址生成   | `/api/createAddress`               | 生成地址       |
|            | `/api/generateAddressWithMnemonic` | 助记词生成地址 |
|            | `/api/getAddressByKey`             | 私钥获取地址   |
| 余额查询   | `/api/getTrxBalance`               | TRX 余额查询   |
|            | `/api/getTrc20Balance`             | TRC20 余额查询 |
|            | `/api/getTrc10Info`                | TRC10 信息查询 |
| 转账功能   | `/api/sendTrx`                     | TRX 转账       |
|            | `/api/sendTrc20`                   | TRC20 转账     |
|            | `/api/sendTrc10`                   | TRC10 转账     |
| 交易查询   | `/api/getTransaction`              | 交易详情查询   |
|            | `/api/getTrc20TransactionReceipt`  | TRC20 交易回执 |
| 区块链信息 | `/api/getBlockHeight`              | 区块高度查询   |
|            | `/api/getBlockByNumber`            | 区块信息查询   |
| 工具接口   | `/api/status`                      | API 状态检查   |
|            | `/api/getApiList`                  | 接口列表获取   |

## 📁 项目结构

```
nodejs/
├── 📄 app.js                    # 主应用入口文件
├── 📄 package.json             # 项目依赖配置
├── 📄 README.md                # 项目说明文档
├── 📁 config/                  # 配置文件目录
│   └── 📄 config.js            # 主配置文件
├── 📁 routes/                  # 路由文件目录
│   ├── 📄 index.js             # 首页路由
│   ├── 📄 api.js               # API路由
│   └── 📄 docs.js              # 文档路由
├── 📁 services/                # 服务层目录
│   └── 📄 TronService.js       # TRON区块链服务
├── 📁 views/                   # 视图模板目录
│   ├── 📄 index.ejs            # 首页模板
│   └── 📄 docs.ejs             # 文档模板
└── 📁 public/                  # 静态资源目录
    ├── 📄 favicon.ico          # 网站图标
    └── 📄 favicon.svg          # SVG图标
```

## 📖 API 使用示例

### 基础信息

- **基础 URL**: `http://localhost:3000/api/`
- **返回格式**: JSON
- **字符编码**: UTF-8
- **请求方式**: 支持 GET 和 POST

### 通用返回格式

```json
{
  "code": 1, // 状态码 1:成功 0:失败
  "msg": "success", // 状态消息
  "data": {}, // 返回数据
  "time": 1756394906 // 时间戳
}
```

### 主要接口示例

#### 1. 生成钱包地址

```bash
GET /api/createAddress
```

#### 2. 查询 TRX 余额

```bash
GET /api/getTrxBalance?address=TTAUj1qkSVK2LuZBResGu2xXb1ZAguGsnu
```

#### 3. 查询 TRC20 余额

```bash
GET /api/getTrc20Balance?address=TTAUj1qkSVK2LuZBResGu2xXb1ZAguGsnu
```

#### 4. TRX 转账

```bash
POST /api/sendTrx
Content-Type: application/json

{
  "to": "接收地址",
  "amount": 10.5,
  "key": "发送方私钥"
}
```

#### 5. TRC20 转账

```bash
POST /api/sendTrc20
Content-Type: application/json

{
  "to": "接收地址",
  "amount": "100.000000",
  "key": "发送方私钥"
}
```

## ⚙️ 配置说明

### 环境变量

创建 `.env` 文件并配置以下参数：

```env
# 服务器配置
PORT=3000
NODE_ENV=development

# TRON网络配置
TRON_FULL_NODE=https://api.trongrid.io
TRON_SOLIDITY_NODE=https://api.trongrid.io
TRON_EVENT_SERVER=https://api.trongrid.io
TRON_API_KEY=your_api_key_here

# TRC20合约配置（USDT）
TRC20_CONTRACT_ADDRESS=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
TRC20_DECIMALS=6
```

### 配置文件

主要配置文件位于 `config/config.js`，包含：

- TRON 网络配置
- TRC20 合约配置
- API 限制配置
- 安全配置

## 🐳 Docker 部署

### 构建镜像

```bash
npm run docker:build
```

### 运行容器

```bash
npm run docker:run
```

### 使用 docker-compose

```yaml
version: "3.8"
services:
  trc20-api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/status"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## 🚀 生产环境部署

### 使用 PM2

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start app.js --name "trc20-api"

# 保存配置
pm2 save
pm2 startup
```

### Nginx 反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 💡 技术特点

### 现代化架构

- Express.js 框架，轻量高效
- MVC 分层架构，代码组织清晰
- 模块化设计，易于维护扩展

### 专业区块链集成

- TronWeb 官方 SDK
- 完整的助记词支持
- 多种代币标准支持（TRX、TRC20、TRC10）

### 企业级特性

- Docker 容器化部署
- 健康检查机制
- PM2 进程管理支持
- Nginx 反向代理配置

### 开发体验

- 热重载开发模式
- 详细的安装指南
- 完整的 API 文档

## 🔒 安全注意事项

1. **私钥安全**: 私钥是敏感信息，请确保在安全环境下使用转账接口
2. **HTTPS**: 生产环境建议使用 HTTPS 协议
3. **API 限制**: 建议配置 API 访问限制和速率限制
4. **环境隔离**: 测试和生产环境使用不同的配置

## 🆚 与 PHP 版本对比

| 功能     | PHP 版本 | Node.js 版本 | 优势               |
| -------- | -------- | ------------ | ------------------ |
| 性能     | ⭐⭐⭐   | ⭐⭐⭐⭐⭐   | 异步 I/O，更高并发 |
| 内存占用 | ⭐⭐⭐   | ⭐⭐⭐⭐     | 更低的内存消耗     |
| 部署难度 | ⭐⭐⭐   | ⭐⭐⭐⭐     | 更简单的部署流程   |
| 扩展性   | ⭐⭐⭐   | ⭐⭐⭐⭐⭐   | 更好的水平扩展     |
| 生态系统 | ⭐⭐⭐   | ⭐⭐⭐⭐⭐   | 丰富的 npm 包生态  |

## 🛠️ 常见问题

### 端口被占用

如果 3000 端口被占用，修改 `.env` 文件中的 `PORT` 配置：

```env
PORT=8080
```

### 网络连接问题

如果遇到 TRON 网络连接问题，可以：

1. 检查网络连接
2. 更换 TRON API 节点
3. 配置 TRON API Key

### 依赖安装失败

```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules
rm -rf node_modules

# 重新安装
npm install
```

## 📞 技术支持

- **作者**: 纸飞机(Telegram): https://t.me/king_orz
- **GitHub**: https://github.com/fpusdt/fpusdt_node
- **温馨提示**: 接受各种代码定制

## 📄 许可证

MIT License

## 📈 更新日志

### v3.0.0 (2025-01-07)

- ✅ 完整的 Node.js 版本实现
- ✅ 支持所有 PHP 版本的功能
- ✅ 优化的性能和响应速度
- ✅ 完善的错误处理机制
- ✅ 移动端友好的文档界面
- ✅ ERUSPT ASCII 艺术字体控制台
- ✅ 自动打开浏览器功能
- ✅ Emoji 图标支持

---

⚡ **ERUSPT** - 您现在拥有了一个完整、专业、高性能的 TRON 区块链 API 服务！

该版本不仅保持了 PHP 版本的所有功能，还在性能、安全性和开发体验方面有了显著提升。可以直接用于生产环境，支持高并发访问和企业级部署。
