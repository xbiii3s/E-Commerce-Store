# 📋 Vercel 部署详细步骤

## 第1步：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `ecommerce-store` (或你喜欢的名称)
   - **Description**: E-commerce independent store with 42 products
   - **Visibility**: Public (推荐) 或 Private
   - 不选中 "Initialize this repository with a README"
   - 点击 "Create repository"

## 第2步：连接本地 git 到 GitHub

在项目目录运行以下命令（替换 `YOUR_USERNAME`）：

```powershell
cd d:\Project\ecommerce-store

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/ecommerce-store.git

# 重命名主分支（如果需要）
git branch -M main

# 推送到 GitHub
git push -u origin main
```

## 第3步：在 Vercel 上部署

### 选项 A：使用 Vercel CLI（推荐）

```powershell
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署项目
cd d:\Project\ecommerce-store
vercel
```

跟随交互式提示，选择：
- 确认项目根目录
- 连接到 GitHub 账户
- 选择 Next.js 框架

### 选项 B：使用 Vercel Web 界面

1. 访问 https://vercel.com/new
2. 选择 "Import Git Repository"
3. 在 GitHub 中查找 `ecommerce-store` 仓库
4. 导入项目
5. 配置环境变量（见下一步）

## 第4步：配置生产环境变量

Vercel 部署时，需要配置以下环境变量：

### 数据库配置
```
DATABASE_URL=postgresql://user:password@host:5432/ecommerce
# 或使用 Supabase: postgresql://user:password@xxxxx.supabase.co:5432/postgres
```

### NextAuth 配置
```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=<生成方式: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
```

### Google OAuth（可选）
```
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### Stripe 配置
```
STRIPE_PUBLIC_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
```

## 第5步：设置生产数据库

### 使用 Supabase（推荐）

1. 访问 https://supabase.com，创建账户
2. 创建新项目
3. 在 "Settings > Database" 中找到连接字符串
4. 复制 PostgreSQL 连接 URL 到 Vercel 的 `DATABASE_URL`

运行迁移：
```powershell
# 在本地安装 supabase CLI
npm install -g supabase

# 推送迁移到生产环境
supabase db push --db-url "postgresql://..."
```

或者在 Vercel 部署完成后，在 Vercel 的 "Deployments" 选项卡中点击 "View Function Logs" 检查数据库连接。

### 使用 Railway（替代方案）

1. 访问 https://railway.app
2. 创建账户并创建新项目
3. 添加 PostgreSQL 数据库
4. 复制 DATABASE_URL

## 第6步：测试生产部署

部署完成后：

1. 访问你的 Vercel URL（例如：https://ecommerce-store-xxxxx.vercel.app）
2. 测试以下功能：
   - ✅ 首页加载
   - ✅ 产品列表和搜索
   - ✅ 用户注册/登录
   - ✅ 添加购物车
   - ✅ 结账流程
   - ✅ 订单确认

## 第7步：设置自定义域名

1. 在 Vercel 项目设置中：
   - 进入 "Domains" 选项卡
   - 点击 "Add Domain"
   - 输入你的域名（例如：store.example.com）

2. 更新域名的 DNS 记录：
   - 访问你的域名注册商（GoDaddy, Namecheap 等）
   - 添加 Vercel 提供的 CNAME 或 A 记录

3. 更新 `NEXTAUTH_URL`：
   ```
   NEXTAUTH_URL=https://store.example.com
   ```

## 故障排查

### 部署失败：数据库连接错误

- ✅ 确保 `DATABASE_URL` 格式正确
- ✅ 检查数据库服务是否在线
- ✅ 验证防火墙是否允许 Vercel IPs

### 部署失败：环境变量缺失

- ✅ 在 Vercel 项目设置 > Environment Variables 中添加所有变量
- ✅ 重新部署（Vercel > Redeploy）

### 图片无法加载

- ✅ 更新 `next.config.js` 中的 `remotePatterns`
- ✅ 添加你的生产图片 CDN 域名

## 📱 之后的步骤

1. **配置 Google OAuth**
   - 访问 https://console.cloud.google.com
   - 创建 OAuth 2.0 凭证
   - 设置授权重定向 URI：`https://your-domain/api/auth/callback/google`

2. **配置 Stripe**
   - 访问 https://dashboard.stripe.com
   - 获取生产密钥
   - 设置 Webhook 端点：`https://your-domain/api/webhooks/stripe`

3. **监控和日志**
   - Vercel Dashboard > Logs 查看实时日志
   - 设置 Slack 通知

## 💡 提示

- 部署后，每次 `git push` 到 `main` 分支都会自动部署
- 使用 Preview Deployments 测试 Pull Requests
- 配置分支保护规则防止意外部署

## 需要帮助？

- Vercel 文档: https://vercel.com/docs
- Next.js 部署: https://nextjs.org/docs/deployment
- NextAuth 文档: https://next-auth.js.org
