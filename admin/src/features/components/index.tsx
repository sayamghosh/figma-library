import { useState, useEffect } from 'react'
import axios from 'axios'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { useAuthStore } from '@/stores/auth-store'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export function ComponentsModeration() {
  const [components, setComponents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { accessToken } = useAuthStore.getState().auth

  const fetchComponents = async () => {
    try {
      setLoading(true)
      // Note: We need a way to fetch ALL components including pending ones.
      // For now, let's assume /api/components with a special flag or separate admin route.
      // Since I added status filtering to /api/components, I should probably add an admin route.
      // I'll use the same route but maybe the backend should allow admins to see all.
      // For this task, I'll just try to fetch and filter pending ones if possible, 
      // but I should have added a dedicated admin route in the backend.
      
      const response = await axios.get(`${API_URL}/components/admin`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      // Filtering is better done on backend, but let's see what we get.
      setComponents(response.data.data.items)
    } catch (error) {
      toast.error('Failed to fetch components')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComponents()
  }, [])

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await axios.patch(`${API_URL}/components/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      toast.success(`Component ${status}`)
      fetchComponents()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  return (
    <>
      <Header fixed>
        <div className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Component Moderation</h2>
          <p className='text-muted-foreground'>
            Review and approve components submitted by users.
          </p>
        </div>

        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Pricing</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className='text-center'>Loading...</TableCell>
                </TableRow>
              ) : components.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className='text-center'>No components found.</TableCell>
                </TableRow>
              ) : (
                components.map((comp) => (
                  <TableRow key={comp._id}>
                    <TableCell className='font-medium'>{comp.name}</TableCell>
                    <TableCell>{comp.createdBy?.name || 'Unknown'}</TableCell>
                    <TableCell>{comp.pricingType}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        comp.status === 'approved' ? 'bg-green-100 text-green-700' :
                        comp.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {comp.status}
                      </span>
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex justify-end gap-2'>
                        {comp.status === 'pending' && (
                          <>
                            <Button 
                              variant='outline' 
                              size='sm'
                              onClick={() => handleStatusUpdate(comp._id, 'approved')}
                              className='text-green-600 hover:text-green-700'
                            >
                              Approve
                            </Button>
                            <Button 
                              variant='outline' 
                              size='sm'
                              onClick={() => handleStatusUpdate(comp._id, 'rejected')}
                              className='text-red-600 hover:text-red-700'
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Main>
    </>
  )
}
