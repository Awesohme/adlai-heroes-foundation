'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className="h-32 bg-gray-50 animate-pulse rounded-md" />
})

// Import Quill styles
import 'react-quill/dist/quill.snow.css'

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
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'blockquote'],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  }

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'align', 'color', 'background'
  ]

  if (!isMounted) {
    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor="wysiwyg-editor">
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        <div className="h-32 bg-gray-50 animate-pulse rounded-md" />
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor="wysiwyg-editor">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      
      <div className="wysiwyg-editor-wrapper">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="bg-white"
          style={{
            minHeight: minHeight,
            '--quill-editor-height': minHeight
          } as React.CSSProperties}
        />
      </div>

      <style jsx global>{`
        .wysiwyg-editor-wrapper .ql-editor {
          min-height: ${minHeight};
          font-family: inherit;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .wysiwyg-editor-wrapper .ql-toolbar {
          border-top: 1px solid #e2e8f0;
          border-left: 1px solid #e2e8f0;
          border-right: 1px solid #e2e8f0;
          border-bottom: none;
          border-radius: 0.375rem 0.375rem 0 0;
          background: #f8fafc;
        }
        
        .wysiwyg-editor-wrapper .ql-container {
          border: 1px solid #e2e8f0;
          border-top: none;
          border-radius: 0 0 0.375rem 0.375rem;
          font-size: 14px;
        }
        
        .wysiwyg-editor-wrapper .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
          font-size: 14px;
        }
        
        .wysiwyg-editor-wrapper .ql-editor:focus {
          outline: none;
        }
        
        .wysiwyg-editor-wrapper .ql-container.ql-snow {
          border: 1px solid #e2e8f0;
          border-top: none;
        }
        
        .wysiwyg-editor-wrapper:focus-within .ql-toolbar,
        .wysiwyg-editor-wrapper:focus-within .ql-container {
          border-color: #3b82f6;
          box-shadow: 0 0 0 1px #3b82f6;
        }

        /* Dark mode styles */
        @media (prefers-color-scheme: dark) {
          .wysiwyg-editor-wrapper .ql-toolbar {
            background: #1e293b;
            border-color: #334155;
          }
          
          .wysiwyg-editor-wrapper .ql-container {
            border-color: #334155;
            background: #0f172a;
          }
          
          .wysiwyg-editor-wrapper .ql-editor {
            color: #f1f5f9;
          }
          
          .wysiwyg-editor-wrapper .ql-editor.ql-blank::before {
            color: #64748b;
          }
        }
      `}</style>
    </div>
  )
}