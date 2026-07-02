<template>
  <div class="admin-trends">
    <el-card shadow="hover">
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span>学情趋势分析</span>
          <el-select v-model="days" placeholder="时间范围" style="width:120px" @change="loadTrends">
            <el-option label="7天" :value="7" />
            <el-option label="14天" :value="14" />
            <el-option label="30天" :value="30" />
            <el-option label="90天" :value="90" />
          </el-select>
        </div>
      </template>
      <div ref="trendChartRef" style="width:100%;height:400px;"></div>
      <el-table :data="trendData" stripe style="margin-top:20px;">
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="submissions" label="提交数" width="100" align="center" />
        <el-table-column prop="avg_score" label="平均分" width="100" align="center" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import * as echarts from 'echarts'

const trendChartRef = ref(null)
const days = ref(30)
const trendData = ref([])

let chartInstance = null

async function loadTrends() {
  try {
    const res = await axios.get('/api/admin/analytics/trends', { params: { days: days.value } })
    trendData.value = res.data.trends || []
    renderChart()
  } catch (err) { console.error(err) }
}

function renderChart() {
  if (!trendChartRef.value) return
  if (!chartInstance) chartInstance = echarts.init(trendChartRef.value)

  const dates = trendData.value.map(d => d.date)
  const scores = trendData.value.map(d => d.avg_score)
  const counts = trendData.value.map(d => d.submissions)

  chartInstance.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['平均分', '提交数'] },
    xAxis: { type: 'category', data: dates },
    yAxis: [
      { type: 'value', name: '平均分', min: 0, max: 100 },
      { type: 'value', name: '提交数' },
    ],
    series: [
      { name: '平均分', type: 'line', data: scores, smooth: true, areaStyle: { opacity: 0.1 } },
      { name: '提交数', type: 'bar', yAxisIndex: 1, data: counts },
    ],
  })
}

onMounted(loadTrends)
</script>
