import { useState, useEffect } from 'react'
import axios from 'axios'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { Loader2, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

interface Tag {
  _id: string
  name: string
  order: number
}

export function Tags() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [newTagName, setNewTagName] = useState('')
  const [adding, setAdding] = useState(false)
  const { auth } = useAuthStore()

  const fetchTags = async () => {
    try {
      const res = await axios.get(`${API_URL}/tags`)
      // API currently returns string array? No, wait. 
      // The API I wrote for `tagController.js` returns objects with `_id`, `name`, `order`!
      setTags(res.data.data)
    } catch (err) {
      toast.error('Failed to load tags')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTagName.trim()) return

    setAdding(true)
    try {
      const res = await axios.post(
        `${API_URL}/tags`,
        { name: newTagName },
        { headers: { Authorization: `Bearer ${auth.accessToken}` } }
      )
      setTags([...tags, res.data.data])
      setNewTagName('')
      toast.success('Tag added successfully')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add tag')
    } finally {
      setAdding(false)
    }
  }

  const handleDeleteTag = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tag?')) return

    try {
      await axios.delete(`${API_URL}/tags/${id}`, {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      })
      setTags(tags.filter((t) => t._id !== id))
      toast.success('Tag deleted')
    } catch (err) {
      toast.error('Failed to delete tag')
    }
  }

  const moveTag = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === tags.length - 1)
    ) {
      return
    }

    const newTags = [...tags]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    
    // Swap
    const temp = newTags[index]
    newTags[index] = newTags[swapIndex]
    newTags[swapIndex] = temp

    setTags(newTags)

    // Save reorder
    try {
      await axios.put(
        `${API_URL}/tags/reorder`,
        { orderedIds: newTags.map((t) => t._id) },
        { headers: { Authorization: `Bearer ${auth.accessToken}` } }
      )
    } catch (err) {
      toast.error('Failed to save order')
      fetchTags() // revert
    }
  }

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Tag Management</h2>
            <p className='text-muted-foreground'>
              Manage the tags used for categorization. Reorder them to change their display order on the main site.
            </p>
          </div>
        </div>

        <form onSubmit={handleAddTag} className='flex max-w-sm items-center gap-2'>
          <Input
            placeholder='New tag name (e.g. Hero Section)'
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
          />
          <Button type='submit' disabled={adding || !newTagName.trim()}>
            {adding ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Plus className='mr-2 h-4 w-4' />}
            Add
          </Button>
        </form>

        <div className='rounded-md border'>
          {loading ? (
            <div className='flex items-center justify-center p-8'>
              <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
            </div>
          ) : tags.length === 0 ? (
            <div className='p-8 text-center text-muted-foreground'>No tags found</div>
          ) : (
            <div className='divide-y'>
              {tags.map((tag, index) => (
                <div key={tag._id} className='flex items-center justify-between p-4 hover:bg-muted/50'>
                  <div className='flex items-center gap-4'>
                    <div className='flex flex-col'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-6 w-6'
                        onClick={() => moveTag(index, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-6 w-6'
                        onClick={() => moveTag(index, 'down')}
                        disabled={index === tags.length - 1}
                      >
                        <ArrowDown className='h-4 w-4' />
                      </Button>
                    </div>
                    <span className='font-medium'>{tag.name}</span>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='text-destructive hover:bg-destructive/10 hover:text-destructive'
                    onClick={() => handleDeleteTag(tag._id)}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Main>
    </>
  )
}
