'use client'

import { useState, useRef } from 'react'

// 内容块类型
export type ContentBlock = 
  | { type: 'text'; content: string }
  | { type: 'image'; url: string; caption?: string }
  | { type: 'video'; url: string; caption?: string }

interface RichContentEditorProps {
  value: ContentBlock[]
  onChange: (blocks: ContentBlock[]) => void
}

export default function RichContentEditor({ value, onChange }: RichContentEditorProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadType, setUploadType] = useState<'image' | 'video'>('image')

  // 添加文本块
  const addTextBlock = () => {
    onChange([...value, { type: 'text', content: '' }])
  }

  // 添加图片块
  const addImageBlock = (url: string, caption?: string) => {
    onChange([...value, { type: 'image', url, caption }])
  }

  // 添加视频块
  const addVideoBlock = (url: string, caption?: string) => {
    onChange([...value, { type: 'video', url, caption }])
  }

  // 更新块内容
  const updateBlock = (index: number, updates: Partial<ContentBlock>) => {
    const newBlocks = [...value]
    newBlocks[index] = { ...newBlocks[index], ...updates } as ContentBlock
    onChange(newBlocks)
  }

  // 删除块
  const removeBlock = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  // 移动块
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...value]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return
    ;[newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]]
    onChange(newBlocks)
  }

  // 上传文件
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('files', files[0])

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        if (data.urls && data.urls.length > 0) {
          if (uploadType === 'image') {
            addImageBlock(data.urls[0])
          } else {
            addVideoBlock(data.urls[0])
          }
        }
      }
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // 添加 URL 图片
  const handleAddImageUrl = () => {
    const url = prompt('请输入图片 URL:')
    if (url) {
      addImageBlock(url)
    }
  }

  // 添加视频 URL
  const handleAddVideoUrl = () => {
    const url = prompt('请输入视频 URL (支持 YouTube、Bilibili 等):')
    if (url) {
      addVideoBlock(url)
    }
  }

  // 解析视频嵌入 URL
  const getVideoEmbedUrl = (url: string): string | null => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/)
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`
    }
    
    // Bilibili
    const bilibiliMatch = url.match(/bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/)
    if (bilibiliMatch) {
      return `https://player.bilibili.com/player.html?bvid=${bilibiliMatch[1]}&autoplay=0`
    }

    // 直接视频链接
    if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
      return url
    }

    return null
  }

  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border">
        <button
          type="button"
          onClick={addTextBlock}
          className="inline-flex items-center gap-2 px-3 py-2 bg-white border rounded-lg hover:bg-gray-50 transition text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          添加文字
        </button>

        <label className="cursor-pointer">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              setUploadType('image')
              handleFileUpload(e)
            }}
            className="hidden"
            disabled={isUploading}
          />
          <span className={`inline-flex items-center gap-2 px-3 py-2 bg-white border rounded-lg hover:bg-gray-50 transition text-sm ${isUploading ? 'opacity-50' : ''}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            上传图片
          </span>
        </label>

        <button
          type="button"
          onClick={handleAddImageUrl}
          className="inline-flex items-center gap-2 px-3 py-2 bg-white border rounded-lg hover:bg-gray-50 transition text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          图片链接
        </button>

        <button
          type="button"
          onClick={handleAddVideoUrl}
          className="inline-flex items-center gap-2 px-3 py-2 bg-white border rounded-lg hover:bg-gray-50 transition text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          添加视频
        </button>

        {isUploading && (
          <span className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-500">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            上传中...
          </span>
        )}
      </div>

      {/* 内容块列表 */}
      <div className="space-y-3">
        {value.length === 0 && (
          <div className="text-center py-8 text-gray-400 border-2 border-dashed rounded-lg">
            点击上方按钮添加文字、图片或视频内容
          </div>
        )}

        {value.map((block, index) => (
          <div key={index} className="relative group border rounded-lg overflow-hidden bg-white">
            {/* 操作按钮 */}
            <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition">
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => moveBlock(index, 'up')}
                  className="p-1.5 bg-gray-800 text-white rounded hover:bg-gray-700"
                  title="上移"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              )}
              {index < value.length - 1 && (
                <button
                  type="button"
                  onClick={() => moveBlock(index, 'down')}
                  className="p-1.5 bg-gray-800 text-white rounded hover:bg-gray-700"
                  title="下移"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
              <button
                type="button"
                onClick={() => removeBlock(index)}
                className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600"
                title="删除"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 文字块 */}
            {block.type === 'text' && (
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  文字内容
                </div>
                <textarea
                  value={block.content}
                  onChange={(e) => updateBlock(index, { content: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
                  placeholder="输入文字内容..."
                />
              </div>
            )}

            {/* 图片块 */}
            {block.type === 'image' && (
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  图片
                </div>
                <div className="bg-gray-100 rounded-lg overflow-hidden mb-2">
                  <img
                    src={block.url}
                    alt={block.caption || '商品图片'}
                    className="max-h-64 mx-auto object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" fill="%239ca3af" font-family="Arial" font-size="14" text-anchor="middle" dy=".3em"%3EImage Error%3C/text%3E%3C/svg%3E'
                    }}
                  />
                </div>
                <input
                  type="text"
                  value={block.caption || ''}
                  onChange={(e) => updateBlock(index, { caption: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  placeholder="图片说明（可选）"
                />
              </div>
            )}

            {/* 视频块 */}
            {block.type === 'video' && (
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  视频
                </div>
                <div className="bg-gray-900 rounded-lg overflow-hidden mb-2 aspect-video">
                  {(() => {
                    const embedUrl = getVideoEmbedUrl(block.url)
                    if (embedUrl && embedUrl.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
                      return (
                        <video
                          src={embedUrl}
                          controls
                          className="w-full h-full"
                        />
                      )
                    } else if (embedUrl) {
                      return (
                        <iframe
                          src={embedUrl}
                          className="w-full h-full"
                          frameBorder="0"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      )
                    } else {
                      return (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          无法识别的视频链接
                        </div>
                      )
                    }
                  })()}
                </div>
                <input
                  type="text"
                  value={block.url}
                  onChange={(e) => updateBlock(index, { url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm mb-2"
                  placeholder="视频 URL"
                />
                <input
                  type="text"
                  value={block.caption || ''}
                  onChange={(e) => updateBlock(index, { caption: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  placeholder="视频说明（可选）"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// 用于展示的组件
export function RichContentDisplay({ content }: { content: string | null }) {
  if (!content) return null

  let blocks: ContentBlock[] = []
  try {
    blocks = JSON.parse(content)
    if (!Array.isArray(blocks)) return null
  } catch {
    return null
  }

  if (blocks.length === 0) return null

  const getVideoEmbedUrl = (url: string): string | null => {
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/)
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`
    }
    
    const bilibiliMatch = url.match(/bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/)
    if (bilibiliMatch) {
      return `https://player.bilibili.com/player.html?bvid=${bilibiliMatch[1]}&autoplay=0`
    }

    if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
      return url
    }

    return null
  }

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => (
        <div key={index}>
          {block.type === 'text' && (
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 whitespace-pre-wrap">{block.content}</p>
            </div>
          )}

          {block.type === 'image' && (
            <figure>
              <img
                src={block.url}
                alt={block.caption || '商品图片'}
                className="rounded-lg max-w-full mx-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
              {block.caption && (
                <figcaption className="text-center text-sm text-gray-500 mt-2">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          )}

          {block.type === 'video' && (
            <figure>
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                {(() => {
                  const embedUrl = getVideoEmbedUrl(block.url)
                  if (embedUrl && embedUrl.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
                    return (
                      <video
                        src={embedUrl}
                        controls
                        className="w-full h-full"
                      />
                    )
                  } else if (embedUrl) {
                    return (
                      <iframe
                        src={embedUrl}
                        className="w-full h-full"
                        frameBorder="0"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    )
                  } else {
                    return (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        视频加载失败
                      </div>
                    )
                  }
                })()}
              </div>
              {block.caption && (
                <figcaption className="text-center text-sm text-gray-500 mt-2">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          )}
        </div>
      ))}
    </div>
  )
}
