<template>
  <div class="student-portfolio">
    <el-card shadow="hover">
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span>个人作品集</span>
          <el-tag type="success">共 {{ portfolio.projects?.length || 0 }} 个项目</el-tag>
        </div>
      </template>

      <div style="text-align:center;margin-bottom:20px;">
        <h3>{{ portfolio.student_name || '同学' }}</h3>
        <p>平均分数: <strong style="color:#1890ff;">{{ portfolio.average_score || 0 }}/100</strong></p>
      </div>

      <el-row :gutter="20">
        <el-col :span="8" v-for="(project, i) in portfolio.projects" :key="i">
          <el-card shadow="hover" class="project-card">
            <h4>{{ project.title }}</h4>
            <p style="color:#999;font-size:13px;">{{ project.course }} · {{ project.language }}</p>
            <el-rate :model-value="Math.round((project.score || 0) / 20)" disabled style="margin: 8px 0;" />
            <p style="font-size:13px;color:#666;">
              得分: <strong :style="{ color: (project.score || 0) >= 80 ? '#52c41a' : '#fa8c16' }">{{ project.score }}</strong> / 100
            </p>
            <el-collapse accordion>
              <el-collapse-item name="1">
                <template #title>查看代码片段</template>
                <pre style="background:#f5f5f5;padding:10px;border-radius:4px;font-size:12px;overflow:auto;max-height:200px;">{{ project.code_snippet || '无代码' }}</pre>
              </el-collapse-item>
              <el-collapse-item name="2">
                <template #title>AI反馈</template>
                <p style="font-size:13px;color:#666;">{{ project.feedback || '暂无反馈' }}</p>
              </el-collapse-item>
            </el-collapse>
          </el-card>
        </el-col>
      </el-row>

      <el-empty v-if="!portfolio.projects?.length" description="暂无项目作品，完成作业后将自动生成作品集" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const portfolio = ref({ projects: [] })

async function loadPortfolio() {
  try {
    const res = await axios.get('/api/student/portfolio')
    portfolio.value = res.data
  } catch (err) {
    console.error(err)
  }
}

onMounted(loadPortfolio)
</script>

<style scoped>
.project-card {
  margin-bottom: 16px;
  transition: transform 0.2s;
}

.project-card:hover {
  transform: translateY(-4px);
}

.project-card h4 {
  margin-bottom: 4px;
}
</style>
