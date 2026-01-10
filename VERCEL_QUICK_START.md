# 🚀 Vercel 部署快速指南

> **⏱️ 预计时间**: 10-15 分钟

## ✅ 前提条件

- [ ] GitHub 账户 (免费) - https://github.com/signup
- [ ] Vercel 账户 (免费) - https://vercel.com/signup
- [ ] 本地项目已通过构建检查 (见下方)

## 🔍 Step 1: 验证本地项目

在部署前，确保项目本地构建成功：

```powershell
cd d:\Project\ecommerce-store

# 验证所有检查
node verify-deployment.js

# 构建项目
npm run build

# 如果构建成功，看到: "✓ Build completed successfully"
```

## 📤 Step 2: 推送到 GitHub（5分钟）

### 2.1 创建 GitHub 仓库

访问 https://github.com/new 并：
1. **Repository name**: `ecommerce-store`
2. **Description**: E-commerce independent store
3. **Visibility**: Public ⭐ (Vercel 免费版需要)
4. 点击 "Create repository"

### 2.2 连接本地仓库

```powershell
cd d:\Project\ecommerce-store

# 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/ecommerce-store.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

**检查**: 访问 https://github.com/YOUR_USERNAME/ecommerce-store 应该看到你的代码

## 🌐 Step 3: 在 Vercel 部署（5分钟）

### 3.1 导入项目

1. 访问 https://vercel.com/new
2. 点击 "Import Git Repository"
3. 连接你的 GitHub 账户
4. 搜索并选择 `ecommerce-store` 仓库
5. 点击 "Import"

### 3.2 配置项目

在 "Configure Project" 页面：
- **Framework**: Next.js (应自动检测)
- **Root Directory**: ./ (默认)
- 点击 "Continue"

### 3.3 配置环境变量

在 "Environment Variables" 部分添加：

```
DATABASE_URL = postgresql://user:password@host:5432/db
NEXTAUTH_SECRET = (生成方式见下方)
NEXTAUTH_URL = https://your-project.vercel.app
```

**生成 NEXTAUTH_SECRET**:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**暂时跳过这些（可选）**：
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
- STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY

### 3.4 开始部署

点击 "Deploy" 并等待 (通常 2-3 分钟)

成功后你会看到：
```
✓ Preview URL: https://ecommerce-store-xxx.vercel.app
✓ Production URL: https://ecommerce-store-xxx.vercel.app
```

## ✨ Step 4: 测试部署（2分钟）

访问你的 Vercel 项目 URL 并测试：

- [ ] 首页加载
- [ ] 产品列表可见 (应显示 42 个产品)
- [ ] 搜索和过滤功能
- [ ] 添加到购物车
- [ ] 登录页面可访问

## 🎯 后续步骤

### 配置生产数据库

暂时项目使用 SQLite，应升级到 PostgreSQL：

**推荐**: Supabase (免费 500 MB)

1. 访问 https://supabase.com
2. 创建新项目
3. 在 Settings > Database 找到 `postgresql://` 连接字符串
4. 复制到 Vercel 项目设置 > Environment Variables > DATABASE_URL
5. 重新部署

### 配置 Google OAuth (可选)

1. 访问 https://console.cloud.google.com
2. 创建新项目
3. 启用 Google+ API
4. 创建 OAuth 2.0 凭证 (OAuth consent screen)
5. 添加授权重定向 URI:
   ```
   https://your-project.vercel.app/api/auth/callback/google
   ```
6. 复制 Client ID 和 Client Secret 到 Vercel

### 配置 Stripe (可选)

1. 访问 https://dashboard.stripe.com
2. 获取 API Keys (来自 Developers > API Keys)
3. 添加到 Vercel 环境变量
4. 配置 Webhook: https://your-project.vercel.app/api/webhooks/stripe

## 🎁 自定义域名 (可选)

1. 在 Vercel 项目 > Settings > Domains
2. 添加你的域名 (例如: store.example.com)
3. 更新 DNS 记录 (CNAME 指向 Vercel)
4. 更新 NEXTAUTH_URL 环境变量

## 📊 监控和日志

- **Vercel Dashboard**: https://vercel.com/dashboard
  - 查看实时日志
  - 监控部署
  - 查看分析

- **设置通知**:
  - Settings > Notifications
  - 选择 Slack, Discord, Email 等

## 🆘 常见问题

### Q: 部署失败 - "DATABASE_URL is not defined"

**A**: 在 Vercel 环境变量中添加 DATABASE_URL，然后重新部署

### Q: 图片无法加载

**A**: 更新 `next.config.js` 中的 `remotePatterns`，添加你的图片 CDN

### Q: 页面显示 500 错误

**A**: 检查 Vercel Logs > Functions 标签查看错误详情

### Q: 如何回滚到之前的部署?

**A**: Vercel Dashboard > Deployments > 点击旧部署 > "Promote to Production"

## 🔗 有用的链接

- Vercel 文档: https://vercel.com/docs
- Next.js 部署: https://nextjs.org/docs/deployment
- PostgreSQL 提供者:
  - Supabase: https://supabase.com
  - Railway: https://railway.app
  - Neon: https://neon.tech
- NextAuth: https://next-auth.js.org
- Stripe: https://stripe.com

## 🎉 完成！

恭喜！你的电商网站已在互联网上运行！

现在你可以：
- 📱 与朋友分享你的 URL
- 🛍️ 在生产环境中测试购物流程
- 📈 监控流量和性能
- 🔧 继续开发新功能

---

**需要帮助?** 查看 `VERCEL_DEPLOYMENT.md` 获取更详细的指南
