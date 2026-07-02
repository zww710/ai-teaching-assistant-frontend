<template>
  <div class="admin-roi">
    <el-card shadow="hover">
      <template #header><span>ROI 投入产出看板</span></template>

      <el-row :gutter="20" style="margin-bottom: 24px;">
        <el-col :span="8">
          <el-card shadow="none" class="roi-card">
            <h4>💰 年度投入</h4>
            <el-descriptions :column="1" size="small">
              <el-descriptions-item label="SaaS年费">¥{{ roi.investment?.annual_subscription?.toLocaleString() || 0 }}</el-descriptions-item>
              <el-descriptions-item label="部署成本">¥{{ roi.investment?.deployment_cost || 0 }}</el-descriptions-item>
              <el-descriptions-item label="培训成本">¥{{ roi.investment?.training_cost?.toLocaleString() || 0 }}</el-descriptions-item>
              <el-descriptions-item label="总计" style="font-weight:bold;color:#ff4d4f;">
                ¥{{ (roi.investment?.total_annual_cost || 0).toLocaleString() }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card shadow="none" class="roi-card highlight">
            <h4>📈 年度节省</h4>
            <el-descriptions :column="1" size="small">
              <el-descriptions-item label="教师时间价值">¥{{ (roi.savings?.teacher_time_value || 0).toLocaleString() }}</el-descriptions-item>
              <el-descriptions-item label="评估材料节省">¥{{ (roi.savings?.assessment_savings || 0).toLocaleString() }}</el-descriptions-item>
              <el-descriptions-item label="设备维护节省">¥{{ (roi.savings?.device_savings || 0).toLocaleString() }}</el-descriptions-item>
              <el-descriptions-item label="人才质量价值">¥{{ (roi.savings?.talent_value || 0).toLocaleString() }}</el-descriptions-item>
              <el-descriptions-item label="总计" style="font-weight:bold;color:#52c41a;">
                ¥{{ (roi.savings?.total_annual_savings || 0).toLocaleString() }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card shadow="none" class="roi-card success">
            <h4>🎯 投资回报</h4>
            <el-descriptions :column="1" size="small">
              <el-descriptions-item label="ROI比率">
                <el-tag type="success" size="large">{{ roi.roi_metrics?.roi_ratio || 'N/A' }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="回本周期">{{ roi.roi_metrics?.payback_period || 'N/A' }}</el-descriptions-item>
              <el-descriptions-item label="年度净收益">
                <span style="color:#52c41a;font-weight:bold;">
                  ¥{{ (roi.roi_metrics?.annual_net_benefit || 0).toLocaleString() }}
                </span>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>

      <!-- Mode Comparison -->
      <h4 style="margin-bottom: 12px;">传统模式 vs AI助教模式对比</h4>
      <el-table :data="comparisonData" stripe border>
        <el-table-column prop="metric" label="指标" width="180" />
        <el-table-column label="传统模式" align="center">
          <template #default="{ row }">{{ row.traditional }}</template>
        </el-table-column>
        <el-table-column label="AI助教模式" align="center">
          <template #default="{ row }">{{ row.ai }}</template>
        </el-table-column>
        <el-table-column label="改善幅度" align="center">
          <template #default="{ row }">
            <el-tag :type="row.improve > 0 ? 'success' : 'danger'" size="small">
              {{ row.improve > 0 ? '↓' : '↑' }} {{ Math.abs(row.improve) }}%
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const roi = ref({})

const comparisonData = computed(() => {
  const inv = roi.value.investment?.total_annual_cost || 35000
  const sav = roi.value.savings?.total_annual_savings || 120000
  return [
    { metric: '年度成本', traditional: `¥${inv.toLocaleString()}`, ai: `¥${inv.toLocaleString()}`, improve: 0 },
    { metric: '年度节省', traditional: '¥0', ai: `¥${sav.toLocaleString()}`, improve: 100 },
    { metric: 'ROI比率', traditional: '无法量化', ai: roi.value.roi_metrics?.roi_ratio || '1:3.4', improve: 0 },
    { metric: '决策阻力', traditional: '高', ai: '低(价值可量化)', improve: 0 },
  ]
})

async function loadROI() {
  try {
    const res = await axios.get('/api/admin/roi-dashboard')
    roi.value = res.data
  } catch (err) {
    console.error(err)
  }
}

onMounted(loadROI)
</script>

<style scoped>
.roi-card {
  text-align: center;
  padding: 10px 0;
}

.roi-card h4 {
  margin-bottom: 12px;
  color: #666;
}

.highlight {
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
}

.success {
  background: linear-gradient(135deg, #e6f7ff 0%, #f0f5ff 100%);
}
</style>
