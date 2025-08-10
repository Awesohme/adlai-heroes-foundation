'use client'

import { useState, useEffect, useRef } from 'react'
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Quote,
  Type
} from "lucide-react"

interface WYSIWYGEditorProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  className?: string
  minHeight?: string
  required?: boolean
}

export default function WYSIWYGEditor({
  value,
  onChange,
  label,
  placeholder = "Enter content...",
  className,
  minHeight = "200px",
  required = false
}: WYSIWYGEditorProps) {
  const [isPreview, setIsPreview] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const applyFormat = (format: string) => {
    if (!isMounted) return
    
    // Use ref instead of document.getElementById
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    let newText = value

    if (selectedText) {
      let formattedText = selectedText
      
      switch (format) {
        case 'bold':
          formattedText = `**${selectedText}**`
          break
        case 'italic':
          formattedText = `*${selectedText}*`
          break
        case 'underline':
          formattedText = `<u>${selectedText}</u>`
          break
        case 'list':
          formattedText = `- ${selectedText}`
          break
        case 'ordered-list':
          formattedText = `1. ${selectedText}`
          break
        case 'link':
          const url = prompt('Enter URL:')
          if (url) formattedText = `[${selectedText}](${url})`
          break
        case 'quote':
          formattedText = `> ${selectedText}`
          break
        case 'h1':
          formattedText = `# ${selectedText}`
          break
        case 'h2':
          formattedText = `## ${selectedText}`
          break
        case 'h3':
          formattedText = `### ${selectedText}`
          break
      }
      
      newText = value.substring(0, start) + formattedText + value.substring(end)
      onChange(newText)
    }
  }

  const renderPreview = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, '<br>')
  }

  // Don't render until mounted to prevent hydration issues  
  if (!isMounted) {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label htmlFor="rich-editor">
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        <div className="border border-gray-300 rounded-md overflow-hidden">
          <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-500">Loading editor...</div>
          </div>
          <div className="p-4 min-h-[200px] bg-gray-50"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor="rich-editor">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      
      <div className="border border-gray-300 rounded-md overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('bold')}
            className="h-8 w-8 p-0"
          >
            <Bold className="w-4 h-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('italic')}
            className="h-8 w-8 p-0"
          >
            <Italic className="w-4 h-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('underline')}
            className="h-8 w-8 p-0"
          >
            <Underline className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-1" />
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('h1')}
            className="h-8 px-2"
          >
            H1
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('h2')}
            className="h-8 px-2"
          >
            H2
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-1" />
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('list')}
            className="h-8 w-8 p-0"
          >
            <List className="w-4 h-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('ordered-list')}
            className="h-8 w-8 p-0"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('link')}
            className="h-8 w-8 p-0"
          >
            <Link className="w-4 h-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('quote')}
            className="h-8 w-8 p-0"
          >
            <Quote className="w-4 h-4" />
          </Button>

          <div className="flex-1" />
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            className="h-8 px-3 text-sm"
          >
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
        </div>

        {/* Editor/Preview Area */}
        {isPreview ? (
          <div 
            className="p-4 prose max-w-none"
            style={{ minHeight }}
            dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            id="rich-editor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 border-0 resize-none focus:outline-none focus:ring-0"
            style={{ minHeight }}
            rows={Math.max(8, Math.ceil(parseInt(minHeight) / 24))}
          />
        )}
      </div>

      <div className="text-sm text-gray-500">
        <p className="mb-1">Formatting help:</p>
        <div className="flex flex-wrap gap-4 text-xs">
          <span>**bold**</span>
          <span>*italic*</span>
          <span># Heading</span>
          <span>- List item</span>
          <span>[link](url)</span>
          <span>&gt; Quote</span>
        </div>
      </div>
    </div>
  )
}