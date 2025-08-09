'use client'

import { useState, useEffect } from 'react'
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface ExistingItem {
  id: number
  title: string
  order_index: number
}

interface OrderInputProps {
  value: number
  onChange: (value: number) => void
  existingItems?: ExistingItem[]
  label?: string
  currentItemId?: number
  className?: string
}

export default function OrderInput({
  value,
  onChange,
  existingItems = [],
  label = "Display Order",
  currentItemId,
  className
}: OrderInputProps) {
  const [mode, setMode] = useState<'manual' | 'position'>('position')
  const [selectedPosition, setSelectedPosition] = useState<string>('end')

  // Filter out current item if editing
  const otherItems = existingItems.filter(item => item.id !== currentItemId)
  
  // Sort items by order_index for display
  const sortedItems = [...otherItems].sort((a, b) => a.order_index - b.order_index)

  useEffect(() => {
    if (mode === 'position') {
      calculateOrderIndex()
    }
  }, [selectedPosition, sortedItems])

  const calculateOrderIndex = () => {
    if (selectedPosition === 'start') {
      const minOrder = sortedItems.length > 0 ? Math.min(...sortedItems.map(item => item.order_index)) : 1
      onChange(Math.max(0, minOrder - 1))
    } else if (selectedPosition === 'end') {
      const maxOrder = sortedItems.length > 0 ? Math.max(...sortedItems.map(item => item.order_index)) : 0
      onChange(maxOrder + 1)
    } else if (selectedPosition.startsWith('after_')) {
      const afterId = parseInt(selectedPosition.replace('after_', ''))
      const afterItem = sortedItems.find(item => item.id === afterId)
      if (afterItem) {
        const nextItems = sortedItems.filter(item => item.order_index > afterItem.order_index)
        if (nextItems.length > 0) {
          const nextOrder = Math.min(...nextItems.map(item => item.order_index))
          onChange(afterItem.order_index + Math.max(1, Math.floor((nextOrder - afterItem.order_index) / 2)))
        } else {
          onChange(afterItem.order_index + 1)
        }
      }
    } else if (selectedPosition.startsWith('before_')) {
      const beforeId = parseInt(selectedPosition.replace('before_', ''))
      const beforeItem = sortedItems.find(item => item.id === beforeId)
      if (beforeItem) {
        const prevItems = sortedItems.filter(item => item.order_index < beforeItem.order_index)
        if (prevItems.length > 0) {
          const prevOrder = Math.max(...prevItems.map(item => item.order_index))
          onChange(prevOrder + Math.max(1, Math.floor((beforeItem.order_index - prevOrder) / 2)))
        } else {
          onChange(Math.max(0, beforeItem.order_index - 1))
        }
      }
    }
  }

  return (
    <div className={className}>
      <Label>{label}</Label>
      
      <div className="space-y-4 mt-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('position')}
            className={`px-3 py-2 rounded text-sm ${
              mode === 'position' 
                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Position Relative
          </button>
          <button
            type="button"
            onClick={() => setMode('manual')}
            className={`px-3 py-2 rounded text-sm ${
              mode === 'manual' 
                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Manual Number
          </button>
        </div>

        {mode === 'position' ? (
          <Select value={selectedPosition} onValueChange={setSelectedPosition}>
            <SelectTrigger>
              <SelectValue placeholder="Choose position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="start">Place at the beginning</SelectItem>
              {sortedItems.map((item, index) => (
                <div key={item.id}>
                  <SelectItem value={`after_${item.id}`}>
                    After "{item.title}"
                  </SelectItem>
                  {index < sortedItems.length - 1 && (
                    <SelectItem value={`before_${sortedItems[index + 1].id}`}>
                      Before "{sortedItems[index + 1].title}"
                    </SelectItem>
                  )}
                </div>
              ))}
              <SelectItem value="end">Place at the end</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Input
            type="number"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            placeholder="Enter order number"
            min="0"
          />
        )}

        {sortedItems.length > 0 && (
          <Card className="border-blue-100 bg-blue-50/50">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-2">
                <span>📋</span>
                Current Items ({sortedItems.length} total)
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {sortedItems.map((item, index) => (
                  <div key={item.id} className="flex justify-between items-center bg-white px-3 py-2 rounded-lg border-l-4 border-blue-200 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-800 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-700 truncate max-w-[200px]" title={item.title}>
                        {item.title}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded font-mono">
                      #{item.order_index}
                    </span>
                  </div>
                ))}
              </div>
              {mode === 'position' && (
                <div className="mt-3 p-3 bg-blue-100 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <strong>💡 Tip:</strong> Use the dropdown above to place your new item relative to these existing items.
                  </p>
                </div>
              )}
              {mode === 'manual' && (
                <div className="mt-3 p-3 bg-amber-100 rounded-lg">
                  <p className="text-xs text-amber-800">
                    <strong>⚠️ Manual Mode:</strong> Lower numbers appear first. Choose a unique number that fits your desired position.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="text-xs text-gray-500">
          Calculated order index: <strong>{value}</strong>
        </div>
      </div>
    </div>
  )
}