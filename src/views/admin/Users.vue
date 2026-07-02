<template>
  <div class="admin-users">
    <el-card shadow="hover">
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span>师生管理</span>
          <el-space>
            <el-select v-model="filterRole" placeholder="按角色筛选" clearable @change="loadUsers" style="width:150px;">
              <el-option label="教师" value="teacher" />
              <el-option label="学生" value="student" />
              <el-option label="管理员" value="admin" />
            </el-select>
            <el-button type="primary" size="small">新增用户</el-button>
          </el-space>
        </div>
      </template>

      <el-table :data="users" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="full_name" label="姓名" width="100" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column label="角色" width="80">
          <template #default="{ row }">
            <el-tag :type="roleTagType(row.role)">{{ roleLabel(row.role) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="院系" width="120" />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.is_active ? 'success' : 'danger'" size="small">
              {{ row.is_active ? '活跃' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button text size="small">编辑</el-button>
            <el-button text size="small" :type="row.is_active ? 'danger' : 'success'">
              {{ row.is_active ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const users = ref([])
const filterRole = ref('')

function roleTagType(role) {
  return { teacher: '', student: 'success', admin: 'warning' }[role] || ''
}

function roleLabel(role) {
  return { teacher: '教师', student: '学生', admin: '管理员' }[role] || role
}

async function loadUsers() {
  try {
    const params = filterRole.value ? { role: filterRole.value } : {}
    const res = await axios.get('/api/admin/users', { params })
    users.value = res.data.users
  } catch (err) { console.error(err) }
}

onMounted(loadUsers)
</script>
