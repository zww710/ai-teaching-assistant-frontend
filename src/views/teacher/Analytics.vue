<template>
  <div class="teacher-analytics">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>课程学情分析</span>
          <el-select v-model="selectedCourse" placeholder="选择课程" style="width: 200px" @change="loadAnalytics">
            <el-option
              v-for="c in courses"
              :key="c.id"
              :label="c.name"
              :value="c.id"
            />
          </el-select>
        </div>
      </template>

      <el-row :gutter="20" v-if="analytics.course_name">
        <!-- Completion Rate -->
        <el-col :span="6">
          <el-card shadow="none" class="metric-card">
            <el-statistic title="课程完成率" :value="analytics.completion_rate" suffix="%">
              <template #prefix>
                <el-icon color="#1890ff"><CircleCheck /></el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="none" class="metric-card">
            <el-statistic title="平均分数" :value="analytics.average_score" suffix="/100" />
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="none" class="metric-card">
            <el-statistic title="总提交数" :value="analytics.total_submissions" />
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="none" class="metric-card">
            <el-statistic title="需关注学生" :value="analytics.students_below_average" />
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px;" v-if="analytics.course_name">
        <!-- Knowledge Heatmap -->
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header><span>知识点掌握热力图</span></template>
            <div v-for="(rate, topic) in analytics.knowledge_heatmap" :key="topic" class="heatmap-item">
              <span>{{ topic }}</span>
              <el-progress
                :percentage="rate"
                :color="getHeatColor(rate)"
                :show-text="true"
              />
            </div>
          </el-card>
        </el-col>

        <!-- Grade Distribution -->
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header><span>成绩分布</span></template>
            <div class="grade-bars">
              <div class="grade-bar" v-for="(count, level) in analytics.grade_distribution" :key="level">
                <span class="grade-label">{{ gradeLabels[level] }}</span>
                <div class="bar-track">
                  <div
                    class="bar-fill"
                    :style="{ width: `${count / Math.max(...Object.values(analytics.grade_distribution)) * 100}%` }"
                    :class="'grade-' + level"
                  ></div>
                </div>
                <span class="grade-count">{{ count }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- Common Errors -->
      <el-card shadow="hover" style="margin-top: 20px;" v-if="analytics.course_name">
        <template #header><span>常见错误统计</span></template>
        <el-tag
          v-for="(count, err) in analytics.common_errors"
          :key="err"
          style="margin: 4px;"
          :type="count > 5 ? 'danger' : count > 2 ? 'warning' : ''"
        >
          {{ err }} × {{ count }}
        </el-tag>
      </el-card>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const courses = ref([])
const selectedCourse = ref(null)
const analytics = ref({})

const gradeLabels = { excellent: '优秀(≥90)', good: '良好(80-89)', pass: '及格(60-79)', fail: '不及格(<60)' }

function getHeatColor(rate) {
  if (rate >= 70) return '#52c41a'
  if (rate >= 50) return '#faad14'
  return '#ff4d4f'
}

async function loadCourses() {
  try {
    const res = await axios.get('/api/teacher/courses')
    courses.value = res.data.courses
    if (courses.value.length > 0) {
      selectedCourse.value = courses.value[0].id
      loadAnalytics()
    }
  } catch (err) {
    console.error(err)
  }
}

async function loadAnalytics() {
  if (!selectedCourse.value) return
  try {
    const res = await axios.get(`/api/teacher/courses/${selectedCourse.value}/analytics`)
    analytics.value = res.data
  } catch (err) {
    console.error(err)
  }
}

onMounted(loadCourses)
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-card {
  text-align: center;
  padding: 15px 0;
}

.heatmap-item {
  margin-bottom: 12px;
}

.heatmap-item span:first-child {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
  color: #666;
}

.grade-bars {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.grade-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.grade-label {
  width: 70px;
  font-size: 13px;
  color: #666;
  text-align: right;
}

.bar-track {
  flex: 1;
  height: 24px;
  background: #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 12px;
  transition: width 0.5s ease;
}

.grade-excellent { background: #52c41a; }
.grade-good { background: #1890ff; }
.grade-pass { background: #faad14; }
.grade-fail { background: #ff4d4f; }

.grade-count {
  width: 30px;
  font-size: 13px;
  color: #999;
}
</style>
