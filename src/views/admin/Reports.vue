<template>
  <div class="admin-reports">
    <el-card shadow="hover">
      <template #header><span>评估报告一键生成</span></template>

      <el-form :model="form" label-width="120px" style="max-width:500px;">
        <el-form-item label="报告类型">
          <el-select v-model="form.report_type">
            <el-option label="新双高建设" value="新双高" />
            <el-option label="专业认证" value="专业认证" />
            <el-option label="教学评估" value="教学评估" />
          </el-select>
        </el-form-item>
        <el-form-item label="学校名称">
          <el-input v-model="form.school_name" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="generateReport" :loading="loading">
            <el-icon><Document /></el-icon> 生成报告
          </el-button>
        </el-form-item>
      </el-form>

      <div v-if="reportContent" style="margin-top:24px;">
        <el-divider>报告预览</el-divider>
        <div class="report-preview" v-html="renderedReport"></div>
        <el-button type="success" style="margin-top:12px;" @click="copyReport">
          <el-icon><DocumentCopy /></el-icon> 复制报告
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { marked } from 'marked'

const loading = ref(false)
const form = ref({ report_type: '新双高', school_name: '示例高校' })
const reportContent = ref('')

const renderedReport = computed(() => {
  return reportContent.value ? marked.parse(reportContent.value) : ''
})

async function generateReport() {
  loading.value = true
  try {
    const res = await axios.post('/api/admin/reports/evaluate', null, {
      params: { report_type: form.value.report_type, school_name: form.value.school_name },
    })
    reportContent.value = res.data.report_content
    ElMessage.success('报告生成成功')
  } catch (err) {
    ElMessage.error('报告生成失败')
  } finally {
    loading.value = false
  }
}

function copyReport() {
  navigator.clipboard.writeText(reportContent.value)
  ElMessage.success('已复制')
}
</script>

<style scoped>
.report-preview {
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  line-height: 1.8;
  max-height: 600px;
  overflow-y: auto;
}
</style>
