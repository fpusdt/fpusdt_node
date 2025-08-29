/**
 * TRON API Service - Node.js Version
 *
 * 功能说明：
 * - 支持TRC10代币操作
 * - 支持TRC20代币操作（包括USDT）
 * - 支持TRX原生代币操作
 * - 支持助记词生成地址
 * - 支持区块链查询功能
 *
 * 作者：纸飞机(Telegram): https://t.me/king_orz
 * 日期：2025年1月
 *
 * 温馨提示：接受各种代码定制
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// 导入路由
const indexRoutes = require('./routes/index');
const apiRoutes = require('./routes/api');
const docsRoutes = require('./routes/docs');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(helmet({
  contentSecurityPolicy: false, // 暂时禁用CSP以解决移动端菜单问题
}));
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件
app.use('/static', express.static(path.join(__dirname, 'public')));

// 设置模板引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 路由配置
app.use('/', indexRoutes);
app.use('/api', apiRoutes);
app.use('/v1', apiRoutes);  // API v1 兼容路由
app.use('/docs', docsRoutes);
app.use('/doc', docsRoutes);

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    code: 0,
    msg: 'API接口未找到',
    data: null,
    time: Math.floor(Date.now() / 1000)
  });
});

// 错误处理
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    code: 0,
    msg: '服务器内部错误',
    data: null,
    time: Math.floor(Date.now() / 1000)
  });
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  // ASCII 艺术字体横幅 - ERUSPT
  console.log('\n\x1b[36m' + `
███████╗██████╗ ██╗   ██╗███████╗██████╗ ████████╗
██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗╚══██╔══╝
█████╗  ██████╔╝██║   ██║███████╗██║  ██║   ██║
██╔══╝  ██╔═══╝ ██║   ██║╚════██║██║  ██║   ██║
██║     ██║     ╚██████╔╝███████║██████╔╝   ██║
╚═╝     ╚═╝      ╚═════╝ ╚══════╝╚═════╝    ╚═╝
` + '\x1b[0m');

  console.log('\x1b[32m🚀 TRC20 API Server running on port ' + PORT + '\x1b[0m');
  console.log('\x1b[33m📱 Local:      http://localhost:' + PORT + '\x1b[0m');
  console.log('\x1b[33m🌐 Network:    http://127.0.0.1:' + PORT + '\x1b[0m');
  console.log('\x1b[34m📖 API Docs:  http://127.0.0.1:' + PORT + '/docs\x1b[0m');
  console.log('\x1b[35m💡 API Status: http://127.0.0.1:' + PORT + '/api/status\x1b[0m');
  console.log('\x1b[36m' + '═'.repeat(70) + '\x1b[0m');
  console.log('\x1b[32m✨ Server is ready to handle requests!\x1b[0m\n');

  // 自动打开浏览器
  if (process.env.NODE_ENV !== 'production') {
    const url = `http://localhost:${PORT}`;
    const { spawn } = require('child_process');

    // 根据操作系统选择打开命令
    const platform = process.platform;
    let cmd;

    if (platform === 'win32') {
      cmd = 'start';
    } else if (platform === 'darwin') {
      cmd = 'open';
    } else {
      cmd = 'xdg-open';
    }

    setTimeout(() => {
      try {
        if (platform === 'win32') {
          spawn('cmd', ['/c', 'start', url], { detached: true, stdio: 'ignore' });
        } else {
          spawn(cmd, [url], { detached: true, stdio: 'ignore' });
        }
        console.log('\x1b[33m🌐 自动打开浏览器: ' + url + '\x1b[0m');
      } catch (error) {
        console.log('\x1b[31m❌ 无法自动打开浏览器，请手动访问: ' + url + '\x1b[0m');
      }
    }, 1000); // 延迟1秒打开，确保服务完全启动
  }
});

module.exports = app;