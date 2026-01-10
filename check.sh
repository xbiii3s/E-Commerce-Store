#!/bin/bash
# 项目初始化检查清单

echo "🔍 E-Commerce Store 初始化检查清单"
echo "====================================="
echo ""

# 检查 Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js: 未安装"
fi

# 检查 npm
if command -v npm &> /dev/null; then
    echo "✅ npm: $(npm --version)"
else
    echo "❌ npm: 未安装"
fi

# 检查依赖
if [ -d "node_modules" ]; then
    echo "✅ node_modules: 已安装 ($(ls -1 node_modules | wc -l) 个包)"
else
    echo "❌ node_modules: 未安装"
    echo "   运行: npm install"
fi

# 检查数据库
if [ -f "prisma/dev.db" ]; then
    echo "✅ SQLite 数据库: 已创建"
    echo "   大小: $(ls -lh prisma/dev.db | awk '{print $5}')"
else
    echo "❌ SQLite 数据库: 未创建"
    echo "   运行: npm run prisma:migrate"
fi

# 检查 .env
if [ -f ".env" ]; then
    echo "✅ .env: 存在"
else
    echo "❌ .env: 未找到"
fi

# 检查关键文件
echo ""
echo "📁 关键文件检查:"
files=(
    "app/page.tsx"
    "app/products/page.tsx"
    "app/cart/page.tsx"
    "app/checkout/page.tsx"
    "components/layout/Header.tsx"
    "components/layout/Footer.tsx"
    "lib/prisma.ts"
    "prisma/schema.prisma"
    "package.json"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file"
    fi
done

echo ""
echo "🔗 运行命令:"
echo "  npm run dev        - 启动开发服务器 (http://localhost:3000)"
echo "  npm run build      - 生产构建"
echo "  npm run seed       - 重新填充示例数据"
echo "  npx prisma studio - 打开数据库编辑器"
echo ""
echo "✨ 项目初始化完成！"
