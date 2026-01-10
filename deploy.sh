#!/bin/bash

# 🚀 E-Commerce 快速部署脚本
# 这个脚本将帮助你快速完成所有部署步骤

set -e

echo "🚀 E-Commerce Vercel 部署助手"
echo "======================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查前置条件
echo -e "${BLUE}📋 检查前置条件...${NC}"

if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git 未安装${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Git 已安装${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js 未安装${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version) 已安装${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm 未安装${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm --version) 已安装${NC}"

echo ""
echo -e "${BLUE}🔨 构建检查...${NC}"

# 本地构建测试
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ npm run build 成功${NC}"
else
    echo -e "${RED}❌ 构建失败！${NC}"
    echo "请运行: npm install && npm run build"
    exit 1
fi

echo ""
echo -e "${BLUE}📦 Git 检查...${NC}"

if [ ! -d .git ]; then
    echo -e "${YELLOW}⚠️  Git 仓库未初始化${NC}"
    echo "初始化 git: git init && git add . && git commit -m 'Initial commit'"
else
    echo -e "${GREEN}✅ Git 仓库已初始化${NC}"
    
    if git remote get-url origin &> /dev/null; then
        echo -e "${GREEN}✅ 远程仓库已配置${NC}"
        echo "  远程: $(git remote get-url origin)"
    else
        echo -e "${YELLOW}⚠️  远程仓库未配置${NC}"
        echo "配置远程仓库: git remote add origin <GITHUB_URL>"
    fi
fi

echo ""
echo -e "${BLUE}📋 部署清单:${NC}"
echo ""
echo "1️⃣  创建 GitHub 仓库"
echo "   - 访问: https://github.com/new"
echo "   - 名称: ecommerce-store"
echo "   - 可见性: Public"
echo ""
echo "2️⃣  推送代码到 GitHub"
echo "   git remote add origin https://github.com/YOUR_USERNAME/ecommerce-store.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3️⃣  在 Vercel 部署"
echo "   - 访问: https://vercel.com/new"
echo "   - 导入此 GitHub 仓库"
echo "   - 配置环境变量（见下方）"
echo "   - 点击 Deploy"
echo ""
echo -e "${BLUE}🔐 环境变量:${NC}"
echo ""
echo "  DATABASE_URL = postgresql://user:pass@host:5432/db"
echo "  NEXTAUTH_SECRET = $(node -e 'console.log(require("crypto").randomBytes(32).toString("hex"))')"
echo "  NEXTAUTH_URL = https://your-project.vercel.app"
echo ""
echo -e "${BLUE}📊 项目信息:${NC}"
echo ""
echo "  代码行数: $(find app components lib -name '*.ts*' | xargs wc -l | tail -1 | awk '{print $1}')"
echo "  Git 提交: $(git rev-list --count HEAD 2>/dev/null || echo '0')"
echo "  样本产品: 42"
echo ""
echo -e "${YELLOW}💡 提示:${NC}"
echo "  - 完整指南见: VERCEL_QUICK_START.md"
echo "  - 详细步骤见: VERCEL_DEPLOYMENT.md"
echo "  - 检查清单见: DEPLOYMENT_CHECKLIST.md"
echo ""
echo -e "${GREEN}✨ 你已准备好部署！${NC}"
echo ""
