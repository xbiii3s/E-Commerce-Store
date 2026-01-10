# 开发快速参考

## 项目已部署完成 ✅

你的海外电商独立站已经成功生成！以下是快速参考指南。

## 🚀 快速启动（2 分钟）

```powershell
cd d:\Project\ecommerce-store
npm run dev
```

打开浏览器访问 **http://localhost:3000**

## 📁 项目文件结构速查

```
app/                          # 页面和 API
├── page.tsx                 # 首页 /
├── products/
│   ├── page.tsx             # 产品列表 /products
│   ├── [slug]/page.tsx      # 产品详情 /products/[slug]
├── cart/page.tsx            # 购物车 /cart
├── checkout/page.tsx        # 结账 /checkout
├── auth/
│   ├── signin/page.tsx      # 登录 /auth/signin
│   ├── signup/page.tsx      # 注册 /auth/signup
├── account/
│   ├── page.tsx             # 账户中心 /account
│   └── orders/              # 订单页面
└── api/
    ├── auth/                # NextAuth
    ├── products/            # 产品 API
    └── orders/              # 订单 API

components/                   # React 组件
├── layout/
│   ├── Header.tsx           # 顶部导航
│   └── Footer.tsx           # 底部
├── products/
│   ├── ProductCard.tsx      # 产品卡片
│   ├── ProductFilters.tsx   # 筛选器
│   └── AddToCartButton.tsx  # 添加购物车按钮
├── providers/
│   ├── CartProvider.tsx     # 购物车状态管理
│   └── ToastProvider.tsx    # 提示信息
└── ui/
    └── Toaster.tsx          # 提示组件

lib/
├── prisma.ts                # 数据库客户端
└── auth.ts                  # NextAuth 配置

prisma/
├── schema.prisma            # 数据库模型定义
├── seed.ts                  # 初始化数据脚本
└── dev.db                   # SQLite 数据库文件

public/                       # 静态资源（图片等）
styles/                       # 样式文件
```

## 📊 数据库模型

```typescript
User {
  id, email, name, password, role
  ↓ 关联
  orders[], reviews[], wishlist[]
}

Product {
  id, name, slug, price, comparePrice, images, inventory, categoryId
  ↓ 关联
  category, orderItems[], reviews[], wishlist[]
}

Category {
  id, name, slug
  ↓ 关联
  products[]
}

Order {
  id, orderNumber, email, status, paymentStatus, total
  ↓ 关联
  items[], user
}

OrderItem {
  id, orderId, productId, quantity, price
}

Review {
  id, productId, userId, rating, comment
}

WishlistItem {
  id, userId, productId
}
```

## 🔑 核心命令

```bash
# 开发
npm run dev              # 启动开发服务器

# 构建
npm run build            # 生产构建
npm run start            # 启动生产服务器

# 数据库
npm run prisma:generate  # 生成 Prisma 客户端
npm run prisma:migrate   # 运行迁移
npm run seed             # 填充示例数据

# 工具
npm run lint             # 代码检查
```

## 🔧 常用开发任务

### 添加新的商品

编辑 `prisma/seed.ts`，在 `products` 数组中添加：

```typescript
{
  name: 'Product Name',
  slug: 'product-slug',
  price: 99.99,
  comparePrice: 129.99,
  category: 'electronics',
  inventory: 50,
  featured: true
}
```

然后运行：
```bash
npm run seed
```

### 创建新页面

在 `app/` 下创建目录和 `page.tsx`：

```bash
# 创建 /about 页面
mkdir -p app/about
# 在 app/about/page.tsx 中添加：
```

```typescript
export default function AboutPage() {
  return <div>About Us</div>
}
```

### 创建新 API 路由

在 `app/api/` 下创建文件：

```bash
# 创建 GET /api/example
# app/api/example/route.ts

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello' })
}
```

### 使用购物车

```typescript
'use client'

import { useCart } from '@/components/providers/CartProvider'

export default function MyComponent() {
  const { items, addItem, removeItem, updateQuantity } = useCart()

  return (
    <button onClick={() => addItem({ id: '1', name: 'Item', price: 99.99 })}>
      Add to Cart
    </button>
  )
}
```

## 🎨 样式系统

使用 Tailwind CSS：

```jsx
<div className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
  Button
</div>
```

颜色系统：
```
bg-primary-{50,100,200,...,900}
text-primary-{50,100,200,...,900}
border-primary-{50,100,200,...,900}
```

## 🔐 环境变量速查

| 变量 | 值 | 说明 |
|-----|-----|------|
| DATABASE_URL | `file:./dev.db` | SQLite 本地数据库 |
| NEXTAUTH_URL | `http://localhost:3000` | 认证 URL |
| NEXTAUTH_SECRET | `change_...` | 认证密钥（生产改用强密钥） |
| STRIPE_SECRET_KEY | `sk_test_...` | Stripe 密钥 |

## 📱 测试账户

### 测试登录
- Email: `test@example.com`
- Password: `password123`

（需要先注册，或修改 seed.ts 创建测试账户）

### Stripe 测试卡
```
卡号: 4242 4242 4242 4242
过期: 任何未来日期
CVV: 任何 3 位数字
邮编: 任何 5 位数字
```

## 🐛 调试技巧

### 打开 Prisma Studio
```bash
npx prisma studio
```
可视化数据库编辑器，直接查看和修改数据。

### 检查数据库
```bash
sqlite3 prisma/dev.db
sqlite> .tables
sqlite> SELECT * FROM Product;
```

### 查看 NextAuth 日志
在 `lib/auth.ts` 中添加：
```typescript
debug: true  // 只在开发环境
```

## 🌐 部署前检查清单

- [ ] 已安装所有依赖：`npm install`
- [ ] 数据库已初始化：`npm run seed`
- [ ] 没有错误：`npm run build`
- [ ] 所有环境变量已设置
- [ ] Stripe 密钥已配置（可选）
- [ ] NextAuth 密钥已更改
- [ ] 代码已上传 GitHub
- [ ] 在 Vercel/Railway 上部署
- [ ] 测试所有页面和功能

## 💡 常见修改

### 修改品牌名称
在以下位置修改：
1. `components/layout/Header.tsx` - "E-Store"
2. `app/layout.tsx` - title 和 description
3. `.env` - 网站名称相关变量

### 修改主色
编辑 `tailwind.config.ts` 中的颜色定义，所有 `primary` 相关颜色会自动更新。

### 修改首页文案
编辑 `app/page.tsx` 中的内容，修改英文文案和替换图片 URL。

## 📈 性能指标

目标：
- ⚡ LCP < 2.5s
- 🎯 CLS < 0.1
- 📊 FID < 100ms

建议：
- 使用 Chrome DevTools Lighthouse 测试
- 在 Vercel Analytics 中监控指标

## 📚 学习资源

- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Prisma 快速开始](https://www.prisma.io/docs/getting-started)
- [NextAuth.js](https://next-auth.js.org)

---

**项目准备就绪！开始开发吧！🚀**
