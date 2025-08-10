'use client'

import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { adminApi } from '@/lib/admin-api'
import type { Author } from '@/lib/supabase'
import { toast } from 'sonner'
import { isSuperAdmin } from '@/lib/admin-utils'

interface AuthorComboboxProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function AuthorCombobox({ value, onChange, placeholder = "Select author..." }: AuthorComboboxProps) {
  const [open, setOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [newAuthorName, setNewAuthorName] = useState('')
  const [newAuthorEmail, setNewAuthorEmail] = useState('')
  const [isUserSuperAdmin] = useState(isSuperAdmin())

  useEffect(() => {
    loadAuthors()
  }, [])

  const loadAuthors = async () => {
    try {
      setLoading(true)
      const data = await adminApi.getAuthors()
      setAuthors(data)
    } catch (error) {
      console.error('Error loading authors:', error)
      toast.error('Failed to load authors')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAuthor = async () => {
    if (!newAuthorName.trim()) {
      toast.error('Please enter an author name')
      return
    }

    try {
      setCreating(true)
      const newAuthor = await adminApi.createAuthor({
        name: newAuthorName.trim(),
        email: newAuthorEmail.trim() || undefined,
        is_active: true,
      })
      
      setAuthors(prev => [...prev, newAuthor].sort((a, b) => a.name.localeCompare(b.name)))
      onChange(newAuthor.name)
      setDialogOpen(false)
      setNewAuthorName('')
      setNewAuthorEmail('')
      toast.success('Author created successfully!')
    } catch (error) {
      console.error('Error creating author:', error)
      toast.error('Failed to create author')
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteAuthor = async (authorId: number, authorName: string) => {
    if (!isUserSuperAdmin) {
      toast.error('Delete author requires super admin privileges')
      return
    }

    // Prevent deleting "Adlai Heroes Team"
    if (authorName === 'Adlai Heroes Team') {
      toast.error('Cannot delete the default Adlai Heroes Team author')
      return
    }

    if (!confirm(`Are you sure you want to delete "${authorName}"? This action cannot be undone.`)) {
      return
    }

    try {
      setDeleting(authorId)
      await adminApi.deleteAuthor(authorId)
      setAuthors(prev => prev.filter(author => author.id !== authorId))
      
      // If deleted author was selected, reset to default
      if (value === authorName) {
        onChange('Adlai Heroes Team')
      }
      
      toast.success('Author deleted successfully!')
    } catch (error) {
      console.error('Error deleting author:', error)
      toast.error('Failed to delete author')
    } finally {
      setDeleting(null)
    }
  }

  const selectedAuthor = authors.find(author => author.name === value)

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={loading}
          >
            {loading ? (
              "Loading authors..."
            ) : selectedAuthor ? (
              selectedAuthor.name
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search authors..." />
            <CommandEmpty>
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500 mb-3">No authors found</p>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Author
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Author</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label htmlFor="author-name">Author Name *</Label>
                        <Input
                          id="author-name"
                          value={newAuthorName}
                          onChange={(e) => setNewAuthorName(e.target.value)}
                          placeholder="Enter author name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="author-email">Email (optional)</Label>
                        <Input
                          id="author-email"
                          type="email"
                          value={newAuthorEmail}
                          onChange={(e) => setNewAuthorEmail(e.target.value)}
                          placeholder="author@example.com"
                          className="mt-1"
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button 
                          onClick={handleCreateAuthor} 
                          disabled={creating}
                          className="flex-1"
                        >
                          {creating ? 'Creating...' : 'Create Author'}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setDialogOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {authors.map((author) => (
                <CommandItem
                  key={author.id}
                  className="flex items-center justify-between"
                >
                  <div 
                    className="flex items-center flex-1 cursor-pointer"
                    onClick={() => {
                      onChange(author.name)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === author.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{author.name}</div>
                      {/* Show only team name, no individual emails/images for Adlai Heroes Team */}
                      {author.name !== 'Adlai Heroes Team' && author.email && (
                        <div className="text-xs text-gray-500">{author.email}</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Delete button - only for super admin and not for Adlai Heroes Team */}
                  {isUserSuperAdmin && author.name !== 'Adlai Heroes Team' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteAuthor(author.id, author.name)
                      }}
                      disabled={deleting === author.id}
                    >
                      {deleting === author.id ? (
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  )}
                </CommandItem>
              ))}
              
              {authors.length > 0 && (
                <CommandItem
                  onSelect={() => {
                    setDialogOpen(true)
                    setOpen(false)
                  }}
                  className="border-t mt-2 pt-2"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Author
                </CommandItem>
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}