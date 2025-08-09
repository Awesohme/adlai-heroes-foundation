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
          <Card>
            <CardContent className="p-3">
              <div className="text-sm text-gray-600 mb-2">Current order:</div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {sortedItems.map((item, index) => (
                  <div key={item.id} className="flex justify-between text-xs">
                    <span className="truncate flex-1 mr-2">{index + 1}. {item.title}</span>
                    <span className="text-gray-400">({item.order_index})</span>
                  </div>
                ))}
              </div>
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