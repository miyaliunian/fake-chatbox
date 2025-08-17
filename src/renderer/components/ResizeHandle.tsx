import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAtom } from 'jotai'
import { sidebarWidthAtom } from '@/stores/atoms/uiAtoms'
import { cn } from '@/lib/utils'

interface ResizeHandleProps {
  className?: string
  minWidth?: number
  maxWidth?: number
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({ className, minWidth = 200, maxWidth = 400 }) => {
  const [sidebarWidth, setSidebarWidth] = useAtom(sidebarWidthAtom)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startWidth, setStartWidth] = useState(0)
  const handleRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)
      setStartX(e.clientX)
      setStartWidth(sidebarWidth)

      // 添加 document 事件监听器
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    },
    [sidebarWidth]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return

      const deltaX = e.clientX - startX
      const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + deltaX))
      setSidebarWidth(newWidth)
    },
    [isDragging, startX, startWidth, minWidth, maxWidth, setSidebarWidth]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div
      ref={handleRef}
      className={cn(
        'absolute top-0 right-0 h-full cursor-col-resize bg-transparent hover:bg-blue-500/20 transition-colors z-10',
        isDragging && 'bg-blue-500/30',
        className
      )}
      onMouseDown={handleMouseDown}
      style={{
        right: 0, // 不超出边界
        width: 6, // 增加可点击区域，但不超出容器
      }}
    >
      {/* 可视化的拖动指示器 */}
      <div
        className={cn(
          'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
          'w-1 h-8 bg-gray-400 rounded-full opacity-0 transition-opacity',
          'hover:opacity-50',
          isDragging && 'opacity-70'
        )}
        style={{
          maxWidth: '2px', // 确保指示器不会超出容器
        }}
      />
    </div>
  )
}

export default ResizeHandle
