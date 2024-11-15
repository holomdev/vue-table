<script setup lang="ts">
import UserTable from './components/UserTable.vue'
</script>

<template>
  <div class="h-screen w-screen p-6 bg-slate-100">
  
    <div className="mb-[18px] flex items-center justify-between">
      <div className="flex w-[226px] items-center gap-2">
        <h1 className="text-2xl font-[700] leading-[32px]">Usuarios</h1>
      </div>
      <el-button type="success">Agregar Usuario</el-button>
    </div>
    <UserTable />
  </div>
</template>
