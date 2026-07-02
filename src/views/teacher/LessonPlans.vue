<template>
  <div class="lesson-plans">
    <el-card shadow="hover">
      <template #header><span>AI备课助手</span></template>

      <el-form :model="form" label-width="100px" style="max-width: 600px;">
        <el-form-item label="课程名称">
          <el-input v-model="form.course_name" placeholder="例如: 嵌入式系统设计" />
        </el-form-item>
        <el-form-item label="教学主题">
          <el-input v-model="form.topic" placeholder="例如: 单片机中断系统" />
        </el-form-item>
        <el-form-item label="课时">
          <el-input-number v-model="form.duration" :min="30" :max="180" :step="30" />
          <span style="margin-left: 8px; color: #999;">分钟</span>
        </el-form-item>
        <el-form-item label="难度">
          <el-radio-group v-model="form.difficulty">
            <el-radio-button label="beginner">基础</el-radio-button>
            <el-radio-button label="intermediate">中等</el-radio-button>
            <el-radio-button label="advanced">进阶</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="generatePlan" :loading="loading">
            <el-icon><MagicStick /></el-icon> 生成教案
          </el-button>
        </el-form-item>
      </el-form>

      <div v-if="lessonPlan" style="margin-top: 24px;">
        <el-divider>生成的教案</el-divider>
        <div class="plan-content" v-html="renderedPlan"></div>
        <el-button type="success" size="small" style="margin-top: 12px;" @click="copyPlan">
          <el-icon><DocumentCopy /></el-icon> 复制教案
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
const form = ref({
  course_name: '',
  topic: '',
  duration: 90,
  difficulty: 'intermediate',
})
const lessonPlan = ref('')

const renderedPlan = computed(() => {
  return lessonPlan.value ? marked.parse(lessonPlan.value) : ''
})

async function generatePlan() {
  if (!form.value.course_name || !form.value.topic) {
    ElMessage.warning('请填写课程名称和教学主题')
    return
  }
  loading.value = true
  try {
    const res = await axios.post('/api/teacher/ai/lesson-plan', {
      course_name: form.value.course_name,
      topic: form.value.topic,
      duration_minutes: form.value.duration,
      difficulty: form.value.difficulty,
    })
    lessonPlan.value = res.data.lesson_plan
    ElMessage.success('教案生成成功')
  } catch (err) {
    ElMessage.error('教案生成失败')
  } finally {
    loading.value = false
  }
}

function copyPlan() {
  navigator.clipboard.writeText(lessonPlan.value)
  ElMessage.success('已复制到剪贴板')
}
</script>

<style scoped>
.plan-content {
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  line-height: 1.8;
  font-size: 14px;
}

.plan-content h1, .plan-content h2, .plan-content h3 {
  color: #333;
  margin: 16px 0 8px;
}

.plan-content ul, .plan-content ol {
  padding-left: 24px;
}

.plan-content code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
}
</style>
