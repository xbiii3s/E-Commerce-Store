'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import RichContentEditor, { ContentBlock } from './RichContentEditor'

interface Category {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  content: string | null
  price: number
  comparePrice: number | null
  inventory: number
  sku: string | null
  images: string
  featured: boolean
  categoryId: string | null
}

export default function ProductForm({
  categories,
  product,
}: {
  categories: Category[]
  product?: Product
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 解析已有图片
  const parseImages = (imagesStr: string): string[] => {
    try {
      const parsed = JSON.parse(imagesStr)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  // 解析富文本内容
  const parseContent = (contentStr: string | null): ContentBlock[] => {
    if (!contentStr) return []
    try {
      const parsed = JSON.parse(contentStr)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    content: product?.content || '[]',
    price: product?.price?.toString() || '',
    comparePrice: product?.comparePrice?.toString() || '',
    inventory: product?.inventory?.toString() || '0',
    sku: product?.sku || '',
    images: product?.images || '[]',
    featured: product?.featured || false,
    categoryId: product?.categoryId || '',
  })

  const [imageList, setImageList] = useState<string[]>(parseImages(product?.images || '[]'))
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>(parseContent(product?.content || null))

  // 更新富文本内容
  const handleContentChange = (blocks: ContentBlock[]) => {
    setContentBlocks(blocks)
    setFormData(prev => ({
      ...prev,
      content: JSON.stringify(blocks),
    }))
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name),
    }))
  }

  // 上传图片
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setError('')

    try {
      const formDataUpload = new FormData()
      Array.from(files).forEach((file) => {
        formDataUpload.append('files', file)
      })

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      if (res.ok) {
        const data = await res.json()
        const newImages = [...imageList, ...data.urls]
        setImageList(newImages)
        setFormData((prev) => ({
          ...prev,
          images: JSON.stringify(newImages),
        }))
      } else {
        const data = await res.json()
        setError(data.error || '上传失败')
      }
    } catch (err) {
      setError('上传失败，请重试')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // 删除图片
  const handleRemoveImage = (index: number) => {
    const newImages = imageList.filter((_, i) => i !== index)
    setImageList(newImages)
    setFormData((prev) => ({
      ...prev,
      images: JSON.stringify(newImages),
    }))
  }

  // 添加 URL 图片
  const handleAddImageUrl = () => {
    const url = prompt('请输入图片 URL:')
    if (url && url.trim()) {
      const newImages = [...imageList, url.trim()]
      setImageList(newImages)
      setFormData((prev) => ({
        ...prev,
        images: JSON.stringify(newImages),
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const url = product 
        ? `/api/admin/products/${product.id}` 
        : '/api/admin/products'
      
      const res = await fetch(url, {
        method: product ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
          inventory: parseInt(formData.inventory),
        }),
      })

      if (res.ok) {
        router.push('/admin/products')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || '保存失败，请重试')
      }
    } catch (err) {
      setError('保存失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 主要信息 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold">基本信息</h2>
            
            <div>
              <label className="block text-sm font-medium mb-1">商品名称 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="输入商品名称"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">URL 别名</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="product-url-slug"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">简短描述</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="简要描述商品（显示在商品信息区域）"
              />
            </div>
          </div>

          {/* 商品详情富文本 */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">商品详情</h2>
              <span className="text-sm text-gray-500">支持文字、图片、视频</span>
            </div>
            <RichContentEditor
              value={contentBlocks}
              onChange={handleContentChange}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold">商品图片</h2>
            
            {/* 已上传图片预览 */}
            {imageList.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imageList.map((url, index) => (
                  <div key={index} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={url}
                      alt={`商品图片 ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" fill="%239ca3af" font-family="Arial" font-size="14" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-lg font-bold shadow-lg hover:bg-red-600"
                    >
                      ×
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 px-2 py-1 bg-primary-600 text-white text-xs rounded">
                        主图
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 上传按钮 */}
            <div className="flex flex-wrap gap-3">
              <label className="cursor-pointer">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <span className={`inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {isUploading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>上传中...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>上传本地图片</span>
                    </>
                  )}
                </span>
              </label>
              
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span>添加图片 URL</span>
              </button>
            </div>
            
            <p className="text-xs text-gray-500">
              支持 JPG、PNG、GIF、WebP 格式，单张图片最大 5MB。第一张图片将作为商品主图。
            </p>
          </div>
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold">状态</h2>
            
            <div>
              <label className="block text-sm font-medium mb-1">分类</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">选择分类</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300"
              />
              <label htmlFor="featured" className="text-sm">设为推荐商品</label>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold">价格与库存</h2>
            
            <div>
              <label className="block text-sm font-medium mb-1">价格 *</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">原价（可选）</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.comparePrice}
                  onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">库存 *</label>
              <input
                type="number"
                min="0"
                value={formData.inventory}
                onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">SKU</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="SKU-001"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:bg-gray-400"
        >
          {isSubmitting ? '保存中...' : product ? '更新商品' : '创建商品'}
        </button>
        <Link
          href="/admin/products"
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          取消
        </Link>
      </div>
    </form>
  )
}
