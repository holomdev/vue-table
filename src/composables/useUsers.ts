import { ref, computed } from 'vue'
import { faker } from '@faker-js/faker'

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  status: 'activo' | 'inactivo' | 'pausado' | 'vacacionando'
  workerType: 'empleado' | 'empleador'
}

export const STATUS_OPTIONS = ['activo', 'inactivo', 'pausado', 'vacacionando'] as const
export const WORKER_TYPE_OPTIONS = ['empleado', 'empleador'] as const

export function useUsers() {
  const users = ref<User[]>([])
  const searchQuery = ref('')
  const visibleCount = ref(10)
  const loading = ref(false)
  const lastFullListCount = ref(10)
  const selectedStatus = ref('todos')
  const selectedWorkerType = ref('todos')

  const generateUsers = () => {
    const generatedUsers: User[] = []
    for (let i = 0; i < 300; i++) {
      generatedUsers.push({
        id: i + 1,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        status: STATUS_OPTIONS[Math.floor(Math.random() * STATUS_OPTIONS.length)],
        workerType: WORKER_TYPE_OPTIONS[Math.floor(Math.random() * WORKER_TYPE_OPTIONS.length)]
      })
    }
    users.value = generatedUsers
  }

  const filteredUsers = computed(() => {
    let filtered = users.value

    // Apply name search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
        return fullName.includes(query)
      })
    }

    // Apply status filter
    if (selectedStatus.value !== 'todos') {
      filtered = filtered.filter(user => user.status === selectedStatus.value)
    }

    // Apply worker type filter
    if (selectedWorkerType.value !== 'todos') {
      filtered = filtered.filter(user => user.workerType === selectedWorkerType.value)
    }

    return filtered
  })

  const displayedUsers = computed(() => {
    return filteredUsers.value.slice(0, visibleCount.value)
  })

  const loadMore = async () => {    
    if (visibleCount.value < filteredUsers.value.length && !loading.value) {
      loading.value = true
      await new Promise(resolve => setTimeout(resolve, 300))
      visibleCount.value += 10
      if (!searchQuery.value && selectedStatus.value === 'todos' && selectedWorkerType.value === 'todos') {
        lastFullListCount.value = visibleCount.value
      }
      loading.value = false
    }
  }

  const hasMore = computed(() => {
    return visibleCount.value < filteredUsers.value.length
  })

  const resetVisibleCount = () => {
    visibleCount.value = lastFullListCount.value
    // if (searchQuery.value === '' && selectedStatus.value === 'todos' && selectedWorkerType.value === 'todos') {
    //   visibleCount.value = lastFullListCount.value
    // } else {
    //   visibleCount.value = lastFullListCount.value
    // }
  }

  return {
    users,
    searchQuery,
    selectedStatus,
    selectedWorkerType,
    filteredUsers,
    displayedUsers,
    hasMore,
    loading,
    generateUsers,
    loadMore,
    resetVisibleCount
  }
}