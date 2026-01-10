export type Locale = 'en' | 'zh'

// 分类名称翻译映射
export const categoryNames: Record<string, Record<Locale, string>> = {
  'Electronics': { en: 'Electronics', zh: '电子产品' },
  'Clothing': { en: 'Clothing', zh: '服装配饰' },
  'Home & Garden': { en: 'Home & Garden', zh: '家居园艺' },
  'Sports': { en: 'Sports', zh: '运动户外' },
  'Books': { en: 'Books', zh: '图书音像' },
  'Beauty': { en: 'Beauty', zh: '美妆护肤' },
  'Toys': { en: 'Toys', zh: '玩具' },
  'Food': { en: 'Food', zh: '食品饮料' },
  'Jewelry': { en: 'Jewelry', zh: '珠宝首饰' },
  'Automotive': { en: 'Automotive', zh: '汽车用品' },
}

export const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      products: 'Products',
      categories: 'Categories',
      cart: 'Cart',
      wishlist: 'Wishlist',
      account: 'Account',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      search: 'Search products...',
    },
    
    // Homepage
    home: {
      heroTitle: 'Welcome to E-Store',
      heroSubtitle: 'Discover amazing products at unbeatable prices. Free shipping on orders over $50.',
      shopNow: 'Shop Now',
      browseCategories: 'Browse Categories',
      shopByCategory: 'Shop by Category',
      featuredProducts: 'Featured Products',
      viewAll: 'View All',
      products: 'products',
      // Features
      freeShipping: 'Free Shipping',
      freeShippingDesc: 'On orders over $50',
      easyReturns: 'Easy Returns',
      easyReturnsDesc: '30-day return policy',
      securePayment: 'Secure Payment',
      securePaymentDesc: '100% secure checkout',
      support: '24/7 Support',
      supportDesc: 'Dedicated customer support',
      // Newsletter
      newsletter: 'Subscribe to Our Newsletter',
      newsletterDesc: 'Get updates on new arrivals and special offers',
      emailPlaceholder: 'Enter your email',
      subscribe: 'Subscribe',
    },
    
    // Products
    products: {
      allProducts: 'All Products',
      productsFound: 'products found',
      noProducts: 'No products found',
      viewAllProducts: 'View all products',
      addToCart: 'Add to Cart',
      addedToCart: 'Added to cart!',
      outOfStock: 'Out of Stock',
      inStock: 'In Stock',
      available: 'available',
      onlyLeft: 'Only {count} left',
      reviews: 'reviews',
      description: 'Description',
      relatedProducts: 'Related Products',
      customerReviews: 'Customer Reviews',
      productDetails: 'Product Details',
      filters: 'Filters',
      clearAll: 'Clear all',
      category: 'Category',
      allCategories: 'All Categories',
      priceRange: 'Price Range',
      apply: 'Apply',
      other: 'Other',
      featuredOnly: 'Featured only',
      sortBy: 'Sort by',
      sortNewest: 'Newest',
      sortPriceAsc: 'Price: Low to High',
      sortPriceDesc: 'Price: High to Low',
      sortName: 'Name',
      search: 'Search',
      min: 'Min',
      max: 'Max',
      quantity: 'Quantity',
    },
    
    // Cart
    cart: {
      title: 'Shopping Cart',
      items: 'items',
      empty: 'Your cart is empty',
      emptyDesc: "Looks like you haven't added anything to your cart yet.",
      startShopping: 'Start Shopping',
      continueShopping: 'Continue Shopping',
      clearCart: 'Clear Cart',
      remove: 'Remove',
      orderSummary: 'Order Summary',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      free: 'FREE',
      tax: 'Tax',
      total: 'Total',
      freeShippingNote: 'Add ${amount} more for free shipping!',
      proceedToCheckout: 'Proceed to Checkout',
    },
    
    // Checkout
    checkout: {
      title: 'Checkout',
      shippingInfo: 'Shipping Information',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      city: 'City',
      state: 'State / Province',
      zipCode: 'ZIP / Postal Code',
      country: 'Country',
      paymentMethod: 'Payment Method',
      creditCard: 'Credit Card',
      paypal: 'PayPal',
      placeOrder: 'Place Order',
      orderSuccess: 'Order Placed Successfully!',
      orderSuccessDesc: 'Thank you for your order. We will send you a confirmation email shortly.',
      orderNumber: 'Order Number',
      viewOrders: 'View My Orders',
      backToHome: 'Back to Home',
    },
    
    // Auth
    auth: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      createAccount: 'Create Account',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      name: 'Full Name',
      forgotPassword: 'Forgot Password?',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      orContinueWith: 'Or continue with',
      signInWithGoogle: 'Continue with Google',
      rememberMe: 'Remember me',
      signingIn: 'Signing in...',
      creatingAccount: 'Creating Account...',
      minPassword: 'Minimum 8 characters',
      agreeTerms: 'I agree to the Terms of Service and Privacy Policy',
      passwordMismatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 8 characters',
    },
    
    // Account
    account: {
      title: 'My Account',
      orders: 'My Orders',
      profile: 'Profile',
      settings: 'Settings',
      orderHistory: 'Order History',
      noOrders: 'No orders yet',
      orderDate: 'Order Date',
      orderStatus: 'Status',
      orderTotal: 'Total',
      viewDetails: 'View Details',
      dashboard: 'Dashboard',
      addresses: 'Addresses',
      welcome: 'Welcome',
      manageAccount: 'Manage your account, view orders, and update your preferences.',
      totalOrders: 'Total Orders',
      totalSpent: 'Total Spent',
      recentOrders: 'Recent Orders',
      noRecentOrders: 'No orders yet. Start shopping!',
      startShopping: 'Start Shopping',
    },
    
    // Footer
    footer: {
      about: 'About Us',
      aboutDesc: 'Your trusted online store for quality products at great prices.',
      quickLinks: 'Quick Links',
      customerService: 'Customer Service',
      contactUs: 'Contact Us',
      faq: 'FAQ',
      shippingInfo: 'Shipping Info',
      returns: 'Returns',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      allRightsReserved: 'All rights reserved.',
    },
    
    // Wishlist
    wishlist: {
      title: 'Your Wishlist',
      empty: "You haven't added anything to your wishlist yet.",
      continueShopping: 'Continue Shopping',
      loginRequired: 'Please sign in to view your wishlist.',
      items: 'items',
      addToCart: 'Add to Cart',
      adding: 'Adding...',
      remove: 'Remove',
      addedToWishlist: 'Added to wishlist',
      removedFromWishlist: 'Removed from wishlist',
    },

    // Categories
    categories: {
      title: 'Shop by Category',
      viewAll: 'View All',
      products: 'products',
    },

    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      page: 'Page',
      of: 'of',
      contactInfo: 'Contact Information',
      shippingAddress: 'Shipping Address',
      apartment: 'Apartment, suite, etc.',
      optional: 'optional',
      orderSummary: 'Order Summary',
    },
  },
  
  zh: {
    // Navigation
    nav: {
      home: '首页',
      products: '商品',
      categories: '分类',
      cart: '购物车',
      wishlist: '收藏夹',
      account: '账户',
      signIn: '登录',
      signOut: '退出',
      search: '搜索商品...',
    },
    
    // Homepage
    home: {
      heroTitle: '欢迎来到 E-Store',
      heroSubtitle: '发现优质商品，享受超值价格。订单满 $50 免运费。',
      shopNow: '立即购物',
      browseCategories: '浏览分类',
      shopByCategory: '按分类选购',
      featuredProducts: '精选商品',
      viewAll: '查看全部',
      products: '件商品',
      // Features
      freeShipping: '免费配送',
      freeShippingDesc: '订单满 $50 免运费',
      easyReturns: '轻松退货',
      easyReturnsDesc: '30天无理由退货',
      securePayment: '安全支付',
      securePaymentDesc: '100% 安全结账',
      support: '全天候客服',
      supportDesc: '7x24小时专属客服',
      // Newsletter
      newsletter: '订阅我们的新闻通讯',
      newsletterDesc: '获取新品上架和特惠活动的最新资讯',
      emailPlaceholder: '输入您的邮箱',
      subscribe: '订阅',
    },
    
    // Products
    products: {
      allProducts: '全部商品',
      productsFound: '件商品',
      noProducts: '未找到商品',
      viewAllProducts: '查看全部商品',
      addToCart: '加入购物车',
      addedToCart: '已加入购物车！',
      outOfStock: '缺货',
      inStock: '有货',
      available: '件可售',
      onlyLeft: '仅剩 {count} 件',
      reviews: '条评价',
      description: '商品描述',
      relatedProducts: '相关商品',
      customerReviews: '用户评价',
      productDetails: '商品详情',
      filters: '筛选',
      clearAll: '清除全部',
      category: '分类',
      allCategories: '全部分类',
      priceRange: '价格区间',
      apply: '应用',
      other: '其他',
      featuredOnly: '仅显示精选',
      sortBy: '排序',
      sortNewest: '最新上架',
      sortPriceAsc: '价格从低到高',
      sortPriceDesc: '价格从高到低',
      sortName: '名称',
      search: '搜索',
      min: '最低',
      max: '最高',
      quantity: '数量',
    },
    
    // Cart
    cart: {
      title: '购物车',
      items: '件商品',
      empty: '购物车是空的',
      emptyDesc: '您还没有添加任何商品到购物车。',
      startShopping: '开始购物',
      continueShopping: '继续购物',
      clearCart: '清空购物车',
      remove: '移除',
      orderSummary: '订单摘要',
      subtotal: '小计',
      shipping: '运费',
      free: '免费',
      tax: '税费',
      total: '总计',
      freeShippingNote: '再购 ${amount} 即可免运费！',
      proceedToCheckout: '去结账',
    },
    
    // Checkout
    checkout: {
      title: '结账',
      shippingInfo: '配送信息',
      firstName: '名',
      lastName: '姓',
      email: '邮箱',
      phone: '电话',
      address: '详细地址',
      city: '城市',
      state: '省份',
      zipCode: '邮政编码',
      country: '国家/地区',
      paymentMethod: '支付方式',
      creditCard: '信用卡',
      paypal: 'PayPal',
      placeOrder: '提交订单',
      orderSuccess: '订单提交成功！',
      orderSuccessDesc: '感谢您的订购。我们将很快发送确认邮件给您。',
      orderNumber: '订单号',
      viewOrders: '查看我的订单',
      backToHome: '返回首页',
    },
    
    // Auth
    auth: {
      signIn: '登录',
      signUp: '注册',
      createAccount: '创建账户',
      email: '邮箱',
      password: '密码',
      confirmPassword: '确认密码',
      name: '姓名',
      forgotPassword: '忘记密码？',
      noAccount: '还没有账户？',
      hasAccount: '已有账户？',
      orContinueWith: '或者使用以下方式',
      signInWithGoogle: '使用 Google 登录',
      rememberMe: '记住我',
      signingIn: '登录中...',
      creatingAccount: '创建账户中...',
      minPassword: '密码至少8个字符',
      agreeTerms: '我同意服务条款和隐私政策',
      passwordMismatch: '两次输入的密码不一致',
      passwordTooShort: '密码长度至少为8个字符',
    },
    
    // Account
    account: {
      title: '我的账户',
      orders: '我的订单',
      profile: '个人资料',
      settings: '设置',
      orderHistory: '订单历史',
      noOrders: '暂无订单',
      orderDate: '订单日期',
      orderStatus: '状态',
      orderTotal: '总额',
      viewDetails: '查看详情',
      dashboard: '控制面板',
      addresses: '收货地址',
      welcome: '欢迎',
      manageAccount: '管理您的账户、查看订单和更新偏好设置。',
      totalOrders: '订单总数',
      totalSpent: '消费总额',
      recentOrders: '最近订单',
      noRecentOrders: '暂无订单，开始购物吧！',
      startShopping: '去购物',
    },
    
    // Footer
    footer: {
      about: '关于我们',
      aboutDesc: '您值得信赖的优质商品在线商店。',
      quickLinks: '快速链接',
      customerService: '客户服务',
      contactUs: '联系我们',
      faq: '常见问题',
      shippingInfo: '配送信息',
      returns: '退换货政策',
      privacyPolicy: '隐私政策',
      termsOfService: '服务条款',
      allRightsReserved: '保留所有权利。',
    },
    
    // Wishlist
    wishlist: {
      title: '我的收藏',
      empty: '您还没有收藏任何商品。',
      continueShopping: '继续购物',
      loginRequired: '请登录后查看您的收藏。',
      items: '件商品',
      addToCart: '加入购物车',
      adding: '添加中...',
      remove: '移除',
      addedToWishlist: '已加入收藏',
      removedFromWishlist: '已取消收藏',
    },

    // Categories
    categories: {
      title: '按分类选购',
      viewAll: '查看全部',
      products: '件商品',
    },

    // Common
    common: {
      loading: '加载中...',
      error: '错误',
      success: '成功',
      save: '保存',
      cancel: '取消',
      delete: '删除',
      edit: '编辑',
      confirm: '确认',
      back: '返回',
      next: '下一页',
      previous: '上一页',
      page: '第',
      of: '页，共',
      contactInfo: '联系信息',
      shippingAddress: '收货地址',
      apartment: '公寓、套房等',
      optional: '选填',
    },
  },
} as const

// 使用通用类型，而不是字面量类型
export type TranslationKeys = {
  nav: {
    home: string
    products: string
    categories: string
    cart: string
    wishlist: string
    account: string
    signIn: string
    signOut: string
    search: string
  }
  home: {
    heroTitle: string
    heroSubtitle: string
    shopNow: string
    browseCategories: string
    shopByCategory: string
    featuredProducts: string
    viewAll: string
    products: string
    freeShipping: string
    freeShippingDesc: string
    easyReturns: string
    easyReturnsDesc: string
    securePayment: string
    securePaymentDesc: string
    support: string
    supportDesc: string
    newsletter: string
    newsletterDesc: string
    emailPlaceholder: string
    subscribe: string
  }
  products: {
    allProducts: string
    productsFound: string
    noProducts: string
    viewAllProducts: string
    addToCart: string
    addedToCart: string
    outOfStock: string
    inStock: string
    available: string
    onlyLeft: string
    reviews: string
    description: string
    relatedProducts: string
    customerReviews: string
    productDetails: string
    filters: string
    clearAll: string
    category: string
    allCategories: string
    priceRange: string
    apply: string
    other: string
    featuredOnly: string
    sortBy: string
    sortNewest: string
    sortPriceAsc: string
    sortPriceDesc: string
    sortName: string
    search: string
    min: string
    max: string
    quantity: string
  }
  cart: {
    title: string
    items: string
    empty: string
    emptyDesc: string
    startShopping: string
    continueShopping: string
    clearCart: string
    remove: string
    orderSummary: string
    subtotal: string
    shipping: string
    free: string
    tax: string
    total: string
    freeShippingNote: string
    proceedToCheckout: string
  }
  checkout: {
    title: string
    shippingInfo: string
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    paymentMethod: string
    creditCard: string
    paypal: string
    placeOrder: string
    orderSuccess: string
    orderSuccessDesc: string
    orderNumber: string
    viewOrders: string
    backToHome: string
  }
  auth: {
    signIn: string
    signUp: string
    createAccount: string
    email: string
    password: string
    confirmPassword: string
    name: string
    forgotPassword: string
    noAccount: string
    hasAccount: string
    orContinueWith: string
    signInWithGoogle: string
    rememberMe: string
    signingIn: string
    creatingAccount: string
    minPassword: string
    agreeTerms: string
    passwordMismatch: string
    passwordTooShort: string
  }
  account: {
    title: string
    orders: string
    profile: string
    settings: string
    orderHistory: string
    noOrders: string
    orderDate: string
    orderStatus: string
    orderTotal: string
    viewDetails: string
    dashboard: string
    addresses: string
    welcome: string
    manageAccount: string
    totalOrders: string
    totalSpent: string
    recentOrders: string
    noRecentOrders: string
    startShopping: string
  }
  footer: {
    about: string
    aboutDesc: string
    quickLinks: string
    customerService: string
    contactUs: string
    faq: string
    shippingInfo: string
    returns: string
    privacyPolicy: string
    termsOfService: string
    allRightsReserved: string
  }
  wishlist: {
    title: string
    empty: string
    continueShopping: string
    loginRequired: string
    items: string
    addToCart: string
    adding: string
    remove: string
    addedToWishlist: string
    removedFromWishlist: string
  }
  categories: {
    title: string
    viewAll: string
    products: string
  }
  common: {
    loading: string
    error: string
    success: string
    save: string
    cancel: string
    delete: string
    edit: string
    confirm: string
    back: string
    next: string
    previous: string
    page: string
    of: string
    contactInfo: string
    shippingAddress: string
    apartment: string
    optional: string
  }
}
