<template>
  <div class="admin-classes">
    <el-card shadow="hover">
      <template #header><span>班级管理</span></template>
      <el-table :data="classes" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="课程名称" min-width="180" />
        <el-table-column prop="code" label="课程编号" width="100" />
        <el-table-column prop="major" label="专业方向" width="120" />
        <el-table-column prop="teacher" label="授课教师" width="100" />
        <el-table-column prop="students_count" label="学生数" width="80" align="center" />
        <el-table-column prop="assignments_count" label="作业数" width="80" align="center" />
        <el-table-column prop="semester" label="学期" width="100" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const classes = ref([])
onMounted(async () => {
  try {
    const res = await axios.get('/api/admin/classes')
    classes.value = res.data.classes
  } catch (err) { console.error(err) }
})
</script>
