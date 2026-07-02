<template>
  <div class="courses-page">
    <h2 style="margin-bottom: 20px;">📚 选课中心</h2>

    <el-alert
      title="选择你感兴趣的课程加入学习"
      type="info"
      :closable="false"
      show-icon
      style="margin-bottom: 20px;"
    />

    <el-row :gutter="20">
      <el-col :span="8" v-for="course in courses" :key="course.id">
        <el-card shadow="hover" class="course-card" :class="{ enrolled: course.is_enrolled }">
          <template #header>
            <div class="course-header">
              <span class="course-code">{{ course.code }}</span>
              <el-tag v-if="course.is_enrolled" type="success" size="small">已加入</el-tag>
              <el-tag v-else type="info" size="small">可选</el-tag>
            </div>
          </template>

          <h3>{{ course.name }}</h3>
          <p class="teacher">👨‍🏫 教师: {{ course.teacher_name }}</p>
          <p class="major">🎯 专业: {{ course.major }}</p>
          <p class="semester">📅 学期: {{ course.semester }}</p>

          <div class="stats">
            <span>👥 {{ course.students_count }}/{{ course.max_students }} 人</span>
            <span>📝 {{ course.assignments_count }} 个作业</span>
          </div>

          <el-progress
            :percentage="Math.round(course.students_count / course.max_students * 100)"
            :status="course.students_count >= course.max_students ? 'exception' : ''"
            style="margin: 12px 0;"
          />

          <el-button
            :type="course.is_enrolled ? 'success' : 'primary'"
            :disabled="course.is_enrolled || course.students_count >= course.max_students"
            @click="enroll(course.id)"
            style="width: 100%;"
          >
            {{ course.is_enrolled ? '✓ 已加入' : course.students_count >= course.max_students ? '已满员' : '加入课程' }}
          </el-button>
        </el-card>
      </el-col>
    </el-row>

    <el-empty v-if="courses.length === 0" description="暂无可用课程" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const courses = ref([])

async function loadCourses() {
  try {
    const res = await axios.get('/api/student/courses')
    courses.value = res.data.courses
  } catch (err) {
    console.error('加载课程失败:', err)
  }
}

async function enroll(courseId) {
  try {
    const res = await axios.post(`/api/student/courses/${courseId}/enroll`)
    ElMessage.success(res.data.message)
    await loadCourses()
  } catch (err) {
    ElMessage.error(err.response?.data?.detail || '加入课程失败')
  }
}

onMounted(loadCourses)
</script>

<style scoped>
.course-card {
  margin-bottom: 20px;
  transition: transform 0.2s;
}

.course-card:hover {
  transform: translateY(-4px);
}

.course-card.enrolled {
  border-color: #67c23a;
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-code {
  font-weight: bold;
  font-size: 16px;
  color: #409eff;
}

h3 {
  margin: 10px 0 8px;
  color: #303133;
}

.teacher, .major, .semester {
  margin: 4px 0;
  color: #606266;
  font-size: 14px;
}

.stats {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #909399;
  margin-top: 8px;
}
</style>
