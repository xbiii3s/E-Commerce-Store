/**
 * API 自动化测试脚本
 * 测试：首页、产品、购物车、结账等核心功能
 */

const BASE_URL = 'http://localhost:3000';
const TEST_RESULTS = [];

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function test(name, fn) {
  try {
    process.stdout.write(`  测试: ${name}... `);
    await fn();
    log('✅ 通过\n', 'green');
    TEST_RESULTS.push({ name, status: 'PASS' });
  } catch (error) {
    log(`❌ 失败`, 'red');
    log(`    错误: ${error.message}\n`, 'red');
    TEST_RESULTS.push({ name, status: 'FAIL', error: error.message });
  }
}

async function fetch(url, options = {}) {
  const response = await global.fetch(url, {
    method: 'GET',
    ...options,
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response;
}

async function runTests() {
  log('\n🚀 开始 E-Commerce 首页和产品测试\n', 'blue');
  log(`目标服务器: ${BASE_URL}\n`, 'blue');

  // ========== 首页测试 ==========
  log('📄 首页测试', 'yellow');
  
  await test('首页加载成功', async () => {
    const res = await fetch(`${BASE_URL}/`);
    const html = await res.text();
    if (!html.includes('首页') && !html.includes('ecommerce')) {
      throw new Error('首页 HTML 内容不完整');
    }
  });

  await test('首页状态码为 200', async () => {
    const res = await fetch(`${BASE_URL}/`);
    if (res.status !== 200) {
      throw new Error(`期望 200, 得到 ${res.status}`);
    }
  });

  // ========== 产品列表 API 测试 ==========
  log('\n📦 产品列表 API 测试', 'yellow');

  await test('获取所有产品', async () => {
    const res = await fetch(`${BASE_URL}/api/products`);
    const data = await res.json();
    if (!Array.isArray(data.products)) {
      throw new Error('响应缺少 products 数组');
    }
    if (data.products.length < 10) {
      throw new Error(`预期至少 10 个产品, 仅得到 ${data.products.length}`);
    }
  });

  await test('产品分页功能', async () => {
    const res = await fetch(`${BASE_URL}/api/products?page=1&limit=5`);
    const data = await res.json();
    if (data.products.length > 5) {
      throw new Error('limit 参数未正确应用');
    }
  });

  await test('产品搜索功能', async () => {
    const res = await fetch(`${BASE_URL}/api/products?search=laptop`);
    const data = await res.json();
    // 搜索可能返回 0 或多个结果，只要没有错误就通过
    if (!Array.isArray(data.products)) {
      throw new Error('搜索响应格式错误');
    }
  });

  await test('产品分类过滤', async () => {
    const res = await fetch(`${BASE_URL}/api/products?category=Electronics`);
    const data = await res.json();
    if (!Array.isArray(data.products)) {
      throw new Error('分类过滤响应格式错误');
    }
  });

  await test('产品价格过滤', async () => {
    const res = await fetch(`${BASE_URL}/api/products?minPrice=100&maxPrice=500`);
    const data = await res.json();
    if (!Array.isArray(data.products)) {
      throw new Error('价格过滤响应格式错误');
    }
  });

  // ========== 产品页面测试 ==========
  log('\n🛍️ 产品页面测试', 'yellow');

  await test('产品列表页面加载', async () => {
    const res = await fetch(`${BASE_URL}/products`);
    if (res.status !== 200) {
      throw new Error(`HTTP ${res.status}`);
    }
  });

  await test('产品分类页面加载', async () => {
    const res = await fetch(`${BASE_URL}/categories`);
    if (res.status !== 200) {
      throw new Error(`HTTP ${res.status}`);
    }
  });

  // ========== 购物车测试 ==========
  log('\n🛒 购物车页面测试', 'yellow');

  await test('购物车页面加载', async () => {
    const res = await fetch(`${BASE_URL}/cart`);
    if (res.status !== 200) {
      throw new Error(`HTTP ${res.status}`);
    }
  });

  // ========== 结账测试 ==========
  log('\n💳 结账页面测试', 'yellow');

  await test('结账页面加载', async () => {
    const res = await fetch(`${BASE_URL}/checkout`);
    if (res.status !== 200) {
      throw new Error(`HTTP ${res.status}`);
    }
  });

  // ========== 认证页面测试 ==========
  log('\n🔐 认证页面测试', 'yellow');

  await test('登录页面加载', async () => {
    const res = await fetch(`${BASE_URL}/auth/signin`);
    if (res.status !== 200) {
      throw new Error(`HTTP ${res.status}`);
    }
  });

  await test('注册页面加载', async () => {
    const res = await fetch(`${BASE_URL}/auth/signup`);
    if (res.status !== 200) {
      throw new Error(`HTTP ${res.status}`);
    }
  });

  // ========== 总结 ==========
  log('\n' + '='.repeat(50), 'blue');
  const passed = TEST_RESULTS.filter((r) => r.status === 'PASS').length;
  const failed = TEST_RESULTS.filter((r) => r.status === 'FAIL').length;
  const total = TEST_RESULTS.length;

  log(`\n测试结果: ${passed}/${total} 通过`, passed === total ? 'green' : 'yellow');
  if (failed > 0) {
    log(`失败: ${failed}\n`, 'red');
    TEST_RESULTS.filter((r) => r.status === 'FAIL').forEach((r) => {
      log(`  ❌ ${r.name}: ${r.error}`, 'red');
    });
  } else {
    log('\n🎉 所有测试通过! \n', 'green');
  }

  process.exit(failed > 0 ? 1 : 0);
}

// 处理网络错误
process.on('unhandledRejection', (reason) => {
  log(`\n❌ 连接失败: ${reason.message}`, 'red');
  log('请确保开发服务器正在运行: npm run dev\n', 'yellow');
  process.exit(1);
});

runTests();
