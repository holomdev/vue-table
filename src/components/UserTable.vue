<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { ElTable, ElTableColumn, ElInput, ElPopover, ElRadioGroup, ElRadio } from 'element-plus'
import { useUsers, STATUS_OPTIONS, WORKER_TYPE_OPTIONS } from '../composables/useUsers'

const {
  searchQuery,
  selectedStatus,
  selectedWorkerType,
  displayedUsers,
  hasMore,
  generateUsers,
  loadMore,
  resetVisibleCount,
  loading,
  filteredUsers
} = useUsers()

const tableRef = ref()

const userCountText = computed(() => {
  return `Mostrando ${displayedUsers.value.length} de ${filteredUsers.value.length} usuarios`
})

const handleScroll = (event: { target: any; }) => {
  const table = event.target
  const { scrollTop, scrollHeight, clientHeight } = table
  const threshold = 50 // pixels from bottom

  if (scrollHeight - scrollTop - clientHeight <= threshold && hasMore.value && !loading.value) {
    loadMore()
  }
}

// Watch for filter changes
watch([() => searchQuery.value, () => selectedStatus.value, () => selectedWorkerType.value], () => {
  resetVisibleCount()
}, { flush: 'post' })

onMounted(() => {
  generateUsers()
  const tableBody = tableRef.value.$el.querySelector('.el-scrollbar__wrap')
  if (tableBody) {
    tableBody.addEventListener('scroll', handleScroll)
  }
})

type StatusType = 'activo' | 'inactivo' | 'pausado' | 'vacacionando';

const getStatusClass = (status: StatusType) => {
  const classes = {
    activo: 'status-active',
    inactivo: 'status-inactive',
    pausado: 'status-paused',
    vacacionando: 'status-vacation'
  }
  return classes[status]
}
</script>

<template>
  <div class="user-table-container">
    <div class="filters-container">
      <el-input
        v-model="searchQuery"
        placeholder="Buscar por nombre..."
        class="search-input"
        clearable
      />
      
      <el-popover
        placement="bottom"
        :width="300"
        trigger="click"
      >
        <template #reference>
          <el-button>Filtros</el-button>
        </template>
        
        <div class="filters-content">
          <div class="filter-section">
            <h4>Tipo de Trabajador</h4>
            <el-radio-group v-model="selectedWorkerType">
              <el-radio value="todos">Todos</el-radio>

              <el-radio v-for="worker in WORKER_TYPE_OPTIONS" :key="worker" :value="worker">
                {{ worker.charAt(0).toUpperCase() + worker.slice(1) }}
              </el-radio>

              <!-- <el-radio value="empleado">Empleado</el-radio>
              <el-radio value="empleador">Empleador</el-radio> -->
            </el-radio-group>
          </div>
          
          <div class="filter-section">
            <h4>Estado</h4>
            <el-radio-group v-model="selectedStatus">
              <el-radio value="todos">Todos</el-radio>
              <el-radio v-for="status in STATUS_OPTIONS" :key="status" :value="status">
                {{ status.charAt(0).toUpperCase() + status.slice(1) }}
              </el-radio>
            </el-radio-group>
          </div>
        </div>
      </el-popover>
    </div>
    
    <div class="bg-red-700 rounded-lg">
      <el-table
        ref="tableRef"
        :data="displayedUsers"
        height="500"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column
          prop="firstName"
          label="Nombre"
          width="140"
        />
        <el-table-column
          prop="lastName"
          label="Apellido"
          width="140"
        />
        <el-table-column
          prop="email"
          label="Email"
          width="230"
        />
        <el-table-column
          prop="phone"
          label="Teléfono"
          width="150"
        />
        <el-table-column
          prop="workerType"
          label="Tipo"
          width="120"
        >
          <template #default="{ row }">
            <span class="worker-type">
              {{ row.workerType.charAt(0).toUpperCase() + row.workerType.slice(1) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="Estado"
          width="120"
        >
          <template #default="{ row }">
            <span :class="['status-badge', getStatusClass(row.status)]">
              {{ row.status.charAt(0).toUpperCase() + row.status.slice(1) }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="loading-indicator">
      <span>{{ userCountText }}</span>
      <span v-if="hasMore">
        {{ loading ? ' - Cargando más usuarios...' : ' - Desplázate para ver más' }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.user-table-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.filters-container {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
}

.filters-content {
  padding: 16px;
}

.filter-section {
  margin-bottom: 16px;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.filter-section h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #606266;
}

.loading-indicator {
  text-align: center;
  padding: 10px;
  color: #666;
  font-size: 0.9em;
}

:deep(.el-radio-group) {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background-color: #67C23A;
  color: white;
}

.status-inactive {
  background-color: #F56C6C;
  color: white;
}

.status-paused {
  background-color: #E6A23C;
  color: white;
}

.status-vacation {
  background-color: #409EFF;
  color: white;
}

.worker-type {
  font-weight: 500;
}

:deep(.el-scrollbar__wrap) {
  overflow-x: hidden !important;
}

:deep(.el-table__body-wrapper) {
  overflow-y: auto;
}
</style>