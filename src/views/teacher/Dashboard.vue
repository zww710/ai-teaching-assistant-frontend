<template>
  <div class="teacher-dashboard">
    <!-- Stats Cards -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="课程数量" :value="dashboard.courses_count" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="学生总数" :value="dashboard.total_students" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="待批改" :value="dashboard.pending_assignments">
            <template #suffix>
              <el-tag type="warning" size="small">待处理</el-tag>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card highlight">
          <el-statistic title="本周节省工时" :value="dashboard.estimated_time_saved_hours" suffix="小时">
            <template #prefix>
              <el-icon color="#52c41a"><Clock /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- Recent Submissions -->
      <el-col :span="14">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>最近提交</span>
              <el-button type="primary" text size="small" @click="$router.push('/teacher/courses')">查看全部</el-button>
            </div>
          </template>
          <el-table :data="dashboard.recent_submissions" stripe size="small">
            <el-table-column prop="student_name" label="学生" width="120" />
            <el-table-column prop="assignment_title" label="作业" min-width="150" show-overflow-tooltip />
            <el-table-column label="分数" width="80" align="center">
              <template #default="{ row }">
                <el-tag :type="row.score >= 80 ? 'success' : row.score >= 60 ? '' : 'danger'" size="small">
                  {{ row.score ?? '-' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="submitted_at" label="提交时间" width="160">
              <template #default="{ row }">
                {{ row.submitted_at ? new Date(row.submitted_at).toLocaleDateString() : '-' }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- Quick Actions -->
      <el-col :span="10">
        <el-card shadow="hover">
          <template #header><span>快捷操作</span></template>
          <el-space direction="vertical" style="width: 100%;" :size="12">
            <el-button type="primary" style="width: 100%; text-align: left;" @click="$router.push('/teacher/lesson-plans')">
              <el-icon><EditPen /></el-icon> AI备课助手
            </el-button>
            <el-button style="width: 100%; text-align: left;" @click="loadDashboard">
              <el-icon><Refresh /></el-icon> 刷新数据
            </el-button>
          </el-space>

          <div style="margin-top: 20px;">
            <h4 style="margin-bottom: 12px; color: #666;">系统亮点</h4>
            <el-descriptions :column="1" size="small">
              <el-descriptions-item label="教师减负率">80%</el-descriptions-item>
              <el-descriptions-item label="项目完成率提升">60% → 90%+</el-descriptions-item>
              <el-descriptions-item label="ROI">3.4:1</el-descriptions-item>
              <el-descriptions-item label="部署方式">云端SaaS / 私有化</el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const dashboard = ref({
  courses_count: 0,
  total_students: 0,
  pending_assignments: 0,
  weekly_submissions: 0,
  estimated_time_saved_hours: 0,
  recent_submissions: [],
})

async function loadDashboard() {
  try {
    const res = await axios.get('/api/teacher/dashboard')
    dashboard.value = res.data
  } catch (err) {
    console.error('Failed to load dashboard:', err)
  }
}

onMounted(loadDashboard)
</script>

<style scoped>
.stat-card {
  text-align: center;
  padding: 10px 0;
}

.stat-card.highlight {
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
