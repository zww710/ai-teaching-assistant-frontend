<template>
  <div class="student-dashboard">
    <el-row :gutter="20">
      <!-- Welcome Card -->
      <el-col :span="24">
        <el-card shadow="hover" class="welcome-card">
          <h2>👋 欢迎回来，{{ auth.userName || '同学' }}</h2>
          <p>你的学习进度: {{ progress }}%</p>
          <el-progress :percentage="progress" :status="progress >= 80 ? 'success' : progress >= 50 ? '' : 'exception'" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- Pending Assignments -->
      <el-col :span="14">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>待完成作业</span>
              <el-button type="primary" text size="small" @click="$router.push('/student/assignments')">查看全部</el-button>
            </div>
          </template>
          <el-table :data="dashboard.pending_assignments" stripe>
            <el-table-column prop="title" label="作业标题" min-width="180" show-overflow-tooltip />
            <el-table-column prop="course_code" label="课程" width="100" />
            <el-table-column prop="type" label="类型" width="80">
              <template #default="{ row }">
                <el-tag :type="row.type === 'code' ? '' : row.type === 'circuit' ? 'warning' : 'info'" size="small">
                  {{ typeLabels[row.type] || row.type }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="due_date" label="截止日期" width="120">
              <template #default="{ row }">
                {{ row.due_date ? new Date(row.due_date).toLocaleDateString() : '-' }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template #default="{ row }">
                <el-button type="primary" text size="small" @click="$router.push('/student/assignments')">去提交</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- Ability Radar -->
      <el-col :span="10">
        <el-card shadow="hover">
          <template #header><span>能力雷达图</span></template>
          <div ref="radarChartRef" style="width: 100%; height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- Quick Actions -->
      <el-col :span="6">
        <el-card shadow="hover">
          <el-button type="primary" style="width:100%" @click="$router.push('/student/courses')">
            <el-icon><School /></el-icon> 选课中心
          </el-button>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-button type="success" style="width:100%" @click="$router.push('/student/chat')">
            <el-icon><ChatDotRound /></el-icon> AI导师
          </el-button>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-button style="width:100%" @click="$router.push('/student/portfolio')">
            <el-icon><FolderOpened /></el-icon> 作品集
          </el-button>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-button style="width:100%" @click="$router.push('/student/learning-path')">
            <el-icon><Connection /></el-icon> 学习路径
          </el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import * as echarts from 'echarts'
import { School, ChatDotRound, FolderOpened, Connection } from '@element-plus/icons-vue'
import { useAuthStore } from '../../stores/auth.js'

const auth = useAuthStore()
const dashboard = ref({ pending_assignments: [], learning_progress: 0, ability_radar: {} })
const radarChartRef = ref(null)
const progress = computed(() => dashboard.value.learning_progress || 0)

const typeLabels = { code: '代码', circuit: '电路', report: '报告', project: '项目' }

async function loadDashboard() {
  try {
    const res = await axios.get('/api/student/dashboard')
    dashboard.value = res.data
  } catch (err) {
    console.error(err)
  }
}

function initRadarChart() {
  if (!radarChartRef.value) return
  const chart = echarts.init(radarChartRef.value)
  const radarData = dashboard.value.ability_radar || [
    { name: '编程基础', max: 100, value: 72 },
    { name: '调试能力', max: 100, value: 58 },
    { name: '电路设计', max: 100, value: 45 },
    { name: '文档写作', max: 100, value: 65 },
    { name: '团队协作', max: 100, value: 70 },
    { name: '创新思维', max: 100, value: 55 },
  ]

  chart.setOption({
    radar: {
      indicator: radarData.map(d => ({ name: d.name, max: d.max })),
      radius: '65%',
    },
    series: [{
      type: 'radar',
      data: [{
        value: radarData.map(d => d.value),
        name: '能力值',
        areaStyle: { color: 'rgba(24, 144, 255, 0.2)' },
        lineStyle: { color: '#1890ff' },
        itemStyle: { color: '#1890ff' },
      }],
    }],
    tooltip: { trigger: 'item' },
  })
}

onMounted(async () => {
  await loadDashboard()
  setTimeout(initRadarChart, 100)
})
</script>

<style scoped>
.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.welcome-card h2 {
  margin-bottom: 8px;
}

.welcome-card p {
  opacity: 0.9;
  margin-bottom: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
