# E-Commerce Store - Complete Scaffolding

一个用 Next.js 14 (App Router) + TypeScript + Tailwind CSS + Prisma + NextAuth.js 构建的完整海外电商独立站骨架。

## 功能特性

### 核心功能
- ✅ **产品目录** - 40 个示例产品，支持分类、搜索、筛选
- ✅ **购物车** - 客户端持久化购物车（使用 localStorage）
- ✅ **结账** - 完整的结账流程（地址、联系方式收集）
- ✅ **支付集成** - Stripe 支付集成（可选，默认 demo 模式）
- ✅ **用户认证** - NextAuth.js + Email/密码 + Google OAuth
- ✅ **用户账户** - 订单历史、账户信息管理
- ✅ **订单管理** - 订单创建、查看、追踪
- ✅ **商品详情** - 详细页面、评论、相关商品
- ✅ **响应式设计** - 移动端优先的现代 UI（Tailwind CSS）

### 技术栈
- **前端框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据库**: SQLite (本地开发) / PostgreSQL (生产)
- **ORM**: Prisma
- **认证**: NextAuth.js
- **支付**: Stripe
- **UI 组件**: 自定义组件库

## 快速开始

### 前置条件
- Node.js 18+ 
- npm 或 yarn

### 安装步骤

```powershell
# 1. 安装依赖
npm install

# 2. 生成 Prisma 客户端
npm run prisma:generate

# 3. 运行数据库迁移（创建本地 SQLite 数据库）
npm run prisma:migrate

# 4. 填充示例数据（40 个产品）
npm run seed

# 5. 启动开发服务器
npm run dev
```

访问 **http://localhost:3000**

## 环境变量

复制 `.env` 并填写以下变量（已经包含默认值）：

```env
# 数据库
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=change_this_to_a_random_value

# Stripe (可选，用于生产支付)
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Google OAuth (可选)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## 项目结构

```
ecommerce-store/
├── app/                      # Next.js App Router
│   ├── api/                  # API 路由
│   │   ├── auth/            # 认证相关
│   │   ├── orders/          # 订单处理
│   │   └── products/        # 产品 API
│   ├── account/             # 用户账户页面
│   ├── auth/                # 认证页面 (登录/注册)
│   ├── cart/                # 购物车页面
│   ├── checkout/            # 结账页面
│   ├── products/            # 产品相关页面
│   └── layout.tsx           # 根布局
├── components/              # React 组件
│   ├── layout/              # 布局组件 (Header, Footer)
│   ├── products/            # 产品组件
│   ├── providers/           # Context Providers
│   └── ui/                  # UI 组件
├── lib/                     # 工具函数
│   ├── auth.ts              # NextAuth 配置
│   └── prisma.ts            # Prisma 客户端
├── prisma/                  # 数据库
│   ├── schema.prisma        # Prisma Schema
│   ├── seed.ts              # 数据填充脚本
│   └── dev.db               # SQLite 数据库
├── public/                  # 静态资源
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## 核心页面

| 页面 | 路径 | 描述 |
|-----|------|------|
| 首页 | `/` | 首页，特色商品展示 |
| 产品列表 | `/products` | 所有产品，支持分类/搜索/筛选 |
| 产品详情 | `/products/[slug]` | 单个产品详情 |
| 购物车 | `/cart` | 购物车管理 |
| 结账 | `/checkout` | 订单结账 |
| 结账成功 | `/checkout/success` | 订单确认 |
| 登录 | `/auth/signin` | 用户登录 |
| 注册 | `/auth/signup` | 用户注册 |
| 账户 | `/account` | 用户账户中心 |
| 订单 | `/account/orders` | 用户订单列表 |
| 订单详情 | `/account/orders/[id]` | 订单详情页 |

## API 端点

| 端点 | 方法 | 描述 |
|-----|------|------|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth 认证 |
| `/api/auth/register` | POST | 用户注册 |
| `/api/products` | GET | 获取产品列表 |
| `/api/orders` | POST/GET | 创建/查询订单 |

## 数据库模型

### User
- id, email, name, password, role, createdAt, updatedAt
- 关联: orders, reviews, wishlist

### Product
- id, name, slug, description, price, comparePrice, images, inventory, categoryId
- 关联: category, orderItems, reviews, wishlist

### Category
- id, name, slug, description, image
- 关联: products

### Order
- id, orderNumber, userId, email, status, paymentStatus, subtotal, shipping, tax, total
- 关联: items

### OrderItem
- id, orderId, productId, name, price, quantity, image

### Review
- id, productId, userId, rating, title, comment, approved, createdAt

### WishlistItem
- id, userId, productId

## 生产部署

### 使用 Vercel 部署

```bash
# 推送到 GitHub
git push origin main

# 在 Vercel 上连接仓库
# 1. 访问 vercel.com
# 2. 导入 GitHub 仓库
# 3. 设置环境变量
# 4. 部署
```

### PostgreSQL 设置

生产环境建议使用 PostgreSQL：

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"
```

运行迁移：
```bash
npm run prisma:migrate
npm run seed
```

## 后续开发步骤

### 立即可做
- [ ] 完善产品图片上传功能
- [ ] 添加商品评论功能
- [ ] 实现收藏夹功能
- [ ] 多语言支持 (i18n)
- [ ] SEO 优化 (Sitemap, Robots.txt)

### 进阶功能
- [ ] 管理后台 (产品/订单/用户管理)
- [ ] 邮件通知 (订单确认、发货、退货)
- [ ] 库存管理
- [ ] 优惠券系统
- [ ] 推荐算法
- [ ] CDN 图片优化
- [ ] 支付方式扩展 (PayPal, 微信, 支付宝)

## 常见问题

### Q: 如何重置数据库？
```bash
# 删除现有数据库
rm prisma/dev.db

# 重新运行迁移和 seed
npm run prisma:migrate
npm run seed
```

### Q: 如何配置 Stripe？
1. 访问 stripe.com 创建账户
2. 获取 Secret Key 和 Publishable Key
3. 填入 `.env` 中的 `STRIPE_SECRET_KEY` 和 `STRIPE_PUBLISHABLE_KEY`

### Q: 如何设置 Google OAuth？
1. 访问 Google Cloud Console
2. 创建 OAuth 2.0 应用
3. 获取 Client ID 和 Client Secret
4. 填入 `.env` 中的 `GOOGLE_CLIENT_ID` 和 `GOOGLE_CLIENT_SECRET`

## 文件大小

- 40 个示例产品已预装
- 数据库大小: ~50KB (SQLite)
- Node modules: ~500MB

## 许可证

MIT

## 支持

遇到问题？
- 查看项目文件中的代码注释
- 检查 Next.js 官方文档
- 查看 Prisma 文档
- NextAuth.js 文档
