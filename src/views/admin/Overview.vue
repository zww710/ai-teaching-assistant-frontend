<template>
  <div class="admin-overview">
    <!-- Summary Metrics -->
    <el-row :gutter="20">
      <el-col :span="4" v-for="(item, i) in summaryCards" :key="i">
        <el-card shadow="hover" class="metric-big">
          <el-statistic :title="item.title" :value="item.value" :suffix="item.suffix">
            <template #prefix>
              <el-icon :size="24" :color="item.color">{{ item.icon }}</el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- ROI Overview -->
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span>ROI 投入产出分析</span></template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="年度系统投入">{{ overview.roi?.annual_investment?.toLocaleString() || 0 }} 元</el-descriptions-item>
            <el-descriptions-item label="教师时间价值">{{ (overview.roi?.savings?.teacher_time_value || 0).toLocaleString() }} 元</el-descriptions-item>
            <el-descriptions-item label="评估材料节省">{{ (overview.roi?.savings?.assessment_savings || 0).toLocaleString() }} 元</el-descriptions-item>
            <el-descriptions-item label="设备维护节省">{{ (overview.roi?.savings?.device_savings || 0).toLocaleString() }} 元</el-descriptions-item>
            <el-descriptions-item label="年度总节省" style="color: #52c41a; font-weight: bold;">
              {{ (overview.roi?.savings?.total_annual_savings || 0).toLocaleString() }} 元
            </el-descriptions-item>
            <el-descriptions-item label="ROI比率">
              <el-tag type="success" size="large">{{ overview.roi?.roi_metrics?.roi_ratio }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="回本周期">{{ overview.roi?.roi_metrics?.payback_period }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <!-- Recent Activity -->
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span>最近活动</span></template>
          <el-timeline>
            <el-timeline-item
              v-for="(activity, i) in overview.recent_activity"
              :key="i"
              :timestamp="activity.time"
              placement="top"
            >
              {{ activity.message }}
            </el-timeline-item>
          </el-timeline>
          <el-empty v-if="!overview.recent_activity?.length" description="暂无活动记录" />
        </el-card>
      </el-col>
    </el-row>

    <!-- Quick Navigation -->
    <el-card shadow="hover" style="margin-top: 20px;">
      <template #header><span>快捷导航</span></template>
      <el-row :gutter="16">
        <el-col :span="4" v-for="nav in quickNavs" :key="nav.name">
          <el-card shadow="hover" class="nav-card" @click="$router.push(nav.path)">
            <el-icon :size="32" :color="nav.color">{{ nav.icon }}</el-icon>
            <div>{{ nav.name }}</div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const overview = ref({ summary: {}, roi: {}, recent_activity: [] })

const summaryCards = ref([])
const quickNavs = [
  { name: '师生管理', path: '/admin/users', icon: 'User', color: '#1890ff' },
  { name: '班级管理', path: '/admin/classes', icon: 'School', color: '#52c41a' },
  { name: '学情趋势', path: '/admin/trends', icon: 'TrendCharts', color: '#722ed1' },
  { name: '评估报告', path: '/admin/reports', icon: 'DocumentChecked', color: '#fa8c16' },
  { name: 'ROI看板', path: '/admin/roi', icon: 'Money', color: '#eb2f96' },
  { name: '数据详情', path: '/admin/overview', icon: 'DataAnalysis', color: '#13c2c2' },
]

async function loadOverview() {
  try {
    const res = await axios.get('/api/admin/overview')
    overview.value = res.data
    const s = res.data.summary
    summaryCards.value = [
      { title: '教师数', value: s.total_teachers, suffix: '人', icon: 'User', color: '#1890ff' },
      { title: '学生数', value: s.total_students, suffix: '人', icon: 'UserFilled', color: '#52c41a' },
      { title: '课程数', value: s.total_courses, suffix: '门', icon: 'Reading', color: '#722ed1' },
      { title: '总提交', value: s.total_submissions, suffix: '次', icon: 'Document', color: '#fa8c16' },
      { title: '完成率', value: parseFloat(s.completion_rate) || 0, suffix: '%', icon: 'CircleCheck', color: '#13c2c2' },
      { title: '平均分', value: parseFloat(s.average_score) || 0, suffix: '/100', icon: 'TrendCharts', color: '#eb2f96' },
    ]
  } catch (err) {
    console.error(err)
  }
}

onMounted(loadOverview)
</script>

<style scoped>
.metric-big {
  text-align: center;
  padding: 10px 0;
}

.nav-card {
  text-align: center;
  cursor: pointer;
  padding: 20px 0;
  transition: transform 0.2s;
}

.nav-card:hover {
  transform: translateY(-4px);
}

.nav-card div {
  margin-top: 8px;
  font-size: 13px;
  color: #666;
}
</style>
