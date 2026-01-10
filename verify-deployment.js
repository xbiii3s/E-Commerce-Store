#!/usr/bin/env node

/**
 * Vercel 部署前检查清单
 * 验证所有必需的配置和环境变量
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  const fullPath = path.join(__dirname, filePath);
  const exists = fs.existsSync(fullPath);
  if (exists) {
    log(`✅ ${description}`, 'green');
  } else {
    log(`❌ ${description} - 文件不存在: ${filePath}`, 'red');
  }
  return exists;
}

function checkEnvVar(varName) {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    log(`⚠️  .env 文件不存在`, 'yellow');
    return false;
  }
  const content = fs.readFileSync(envPath, 'utf-8');
  const exists = content.includes(`${varName}=`);
  if (exists) {
    log(`✅ 环境变量 ${varName} 已配置`, 'green');
  } else {
    log(`⚠️  环境变量 ${varName} 未找到（部署时需要）`, 'yellow');
  }
  return exists;
}

log('\n🚀 Vercel 部署前检查清单\n', 'bold');

let passed = 0;
let total = 0;

// 1. 项目文件检查
log('📁 项目文件检查:', 'blue');
const files = [
  ['package.json', 'package.json 配置'],
  ['next.config.js', 'Next.js 配置'],
  ['tsconfig.json', 'TypeScript 配置'],
  ['tailwind.config.ts', 'Tailwind CSS 配置'],
  ['prisma/schema.prisma', 'Prisma 数据库 schema'],
  ['.env', '.env 环境变量文件'],
  ['.env.example', '.env.example 模板（可选）'],
  ['app/page.tsx', '首页'],
  ['app/products/page.tsx', '产品列表页'],
];

files.forEach(([file, desc]) => {
  total++;
  if (checkFile(file, desc)) passed++;
});

// 2. 环境变量检查
log('\n🔐 环境变量检查:', 'blue');
const envVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
];

envVars.forEach((varName) => {
  total++;
  if (checkEnvVar(varName)) passed++;
});

// 3. package.json 检查
log('\n📦 依赖检查:', 'blue');
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const requiredDeps = ['next', 'react', 'prisma', 'next-auth'];
  
  requiredDeps.forEach((dep) => {
    total++;
    const found = packageJson.dependencies[dep] || packageJson.devDependencies[dep];
    if (found) {
      log(`✅ ${dep} - ${found}`, 'green');
      passed++;
    } else {
      log(`❌ ${dep} 未安装`, 'red');
    }
  });
} else {
  log('❌ package.json 不存在', 'red');
}

// 4. 构建检查
log('\n🔨 构建检查:', 'blue');
log('通过运行以下命令在部署前测试：', 'yellow');
log('npm run build', 'bold');

// 5. 总结
log('\n' + '='.repeat(50), 'blue');
const passPercentage = Math.round((passed / total) * 100);
const status = passPercentage === 100 ? 'green' : passPercentage >= 80 ? 'yellow' : 'red';

log(`\n检查结果: ${passed}/${total} 通过 (${passPercentage}%)`, status);

if (passPercentage < 100) {
  log('\n⚠️  注意:', 'yellow');
  log('- 在部署到 Vercel 前，请完成所有必需的配置');
  log('- 在 Vercel 项目设置中配置环境变量');
  log('- 确保本地构建成功: npm run build\n');
} else {
  log('\n✨ 所有检查通过！你已准备好部署到 Vercel\n', 'green');
}

// 6. 部署步骤
log('📋 部署步骤:', 'blue');
log('1. 推送到 GitHub: git push origin main');
log('2. 访问 Vercel: https://vercel.com/new');
log('3. 导入此 GitHub 仓库');
log('4. 配置环境变量（详见 VERCEL_DEPLOYMENT.md）');
log('5. 点击 "Deploy"');
log('6. 等待部署完成并访问你的项目 URL\n');

process.exit(passPercentage === 100 ? 0 : 1);
