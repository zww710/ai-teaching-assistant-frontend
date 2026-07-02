<template>
  <div class="teacher-courses">
    <el-card shadow="hover">
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span>课程管理</span>
          <el-button type="primary" @click="showCreateDialog">+ 新建课程</el-button>
        </div>
      </template>

      <el-table :data="courses" stripe>
        <el-table-column prop="name" label="课程名称" min-width="180" />
        <el-table-column prop="code" label="课程编号" width="100" />
        <el-table-column prop="major" label="专业方向" width="120" />
        <el-table-column prop="semester" label="学期" width="100" />
        <el-table-column prop="students_count" label="学生数" width="80" align="center" />
        <el-table-column prop="assignments_count" label="作业数" width="80" align="center" />
        <el-table-column label="操作" width="280">
          <template #default="{ row }">
            <el-button text size="small" @click="goAnalytics(row.id)">学情分析</el-button>
            <el-button text size="small" @click="showAssignments(row.id)">管理作业</el-button>
            <el-button text size="small" type="primary" @click="showCreateAssignment(row.id)">发布作业</el-button>
            <el-button text size="small" type="danger" @click="deleteCourse(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新建课程对话框 -->
    <el-dialog v-model="createDialogVisible" title="新建课程" width="500px">
      <el-form :model="newCourse" label-width="80px">
        <el-form-item label="课程名称">
          <el-input v-model="newCourse.name" placeholder="例如：嵌入式系统设计" />
        </el-form-item>
        <el-form-item label="课程编号">
          <el-input v-model="newCourse.code" placeholder="例如：CS301" />
        </el-form-item>
        <el-form-item label="专业方向">
          <el-select v-model="newCourse.major" placeholder="选择专业方向" style="width:100%">
            <el-option label="计算机科学与技术" value="计算机科学与技术" />
            <el-option label="人工智能" value="人工智能" />
            <el-option label="电子信息工程" value="电子信息工程" />
            <el-option label="嵌入式技术" value="嵌入式技术" />
            <el-option label="物联网工程" value="物联网工程" />
            <el-option label="大数据技术" value="大数据技术" />
          </el-select>
        </el-form-item>
        <el-form-item label="学期">
          <el-input v-model="newCourse.semester" placeholder="例如：2025-2026-1" />
        </el-form-item>
        <el-form-item label="最大人数">
          <el-input-number v-model="newCourse.max_students" :min="10" :max="200" />
        </el-form-item>
        <el-form-item label="教学大纲">
          <el-input v-model="newCourse.syllabus" type="textarea" :rows="3" placeholder="课程教学大纲..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createCourse">创建</el-button>
      </template>
    </el-dialog>

    <!-- 管理作业对话框 -->
    <el-dialog v-model="assignmentsDialogVisible" title="管理作业" width="600px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <span>课程: {{ currentCourseName }}</span>
        <el-button type="primary" size="small" @click="showCreateAssignment(currentCourseId)">+ 发布作业</el-button>
      </div>

      <el-table :data="assignments" stripe>
        <el-table-column prop="title" label="作业标题" min-width="150" />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="row.type === 'code' ? '' : row.type === 'circuit' ? 'warning' : 'info'" size="small">
              {{ typeLabels[row.type] || row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="language" label="语言" width="80" />
        <el-table-column prop="due_date" label="截止日期" width="120">
          <template #default="{ row }">
            {{ row.due_date ? new Date(row.due_date).toLocaleDateString() : '无' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template #default="{ row }">
            <el-button text size="small" type="danger" @click="deleteAssignment(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 发布作业对话框 -->
    <el-dialog v-model="createAssignmentDialogVisible" title="发布作业" width="600px">
      <el-form :model="newAssignment" label-width="100px">
        <el-form-item label="作业标题">
          <el-input v-model="newAssignment.title" placeholder="例如：LED闪烁程序设计" />
        </el-form-item>
        <el-form-item label="作业描述">
          <el-input v-model="newAssignment.description" type="textarea" :rows="4" placeholder="详细描述作业要求和评分标准..." />
        </el-form-item>
        <el-form-item label="作业类型">
          <el-select v-model="newAssignment.type" placeholder="选择类型" style="width:100%">
            <el-option label="代码编程" value="code" />
            <el-option label="电路图设计" value="circuit" />
            <el-option label="实验报告" value="report" />
            <el-option label="综合项目" value="project" />
          </el-select>
        </el-form-item>
        <el-form-item label="编程语言">
          <el-select v-model="newAssignment.language" placeholder="选择语言" style="width:100%">
            <el-option label="C语言" value="C" />
            <el-option label="Python" value="Python" />
            <el-option label="Java" value="Java" />
            <el-option label="汇编语言" value="Assembly" />
            <el-option label="Verilog" value="Verilog" />
            <el-option label="不适用" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="截止时间">
          <el-date-picker v-model="newAssignment.due_date" type="datetime" placeholder="选择截止时间" style="width:100%" />
        </el-form-item>
        <el-form-item label="AI预批改">
          <el-switch v-model="newAssignment.auto_grade" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createAssignmentDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createAssignment">发布</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

const courses = ref([])
const assignments = ref([])
const currentCourseId = ref(null)
const currentCourseName = ref('')

// 新建课程
const createDialogVisible = ref(false)
const newCourse = ref({
  name: '',
  code: '',
  major: '计算机科学与技术',
  semester: '2025-2026-1',
  max_students: 60,
  syllabus: '',
})

// 管理作业
const assignmentsDialogVisible = ref(false)

// 发布作业
const createAssignmentDialogVisible = ref(false)
const newAssignment = ref({
  title: '',
  description: '',
  type: 'code',
  language: 'C',
  due_date: '',
  auto_grade: true,
})

const typeLabels = { code: '代码', circuit: '电路', report: '报告', project: '项目' }

async function loadCourses() {
  try {
    const res = await axios.get('/api/teacher/courses')
    courses.value = res.data.courses
  } catch (err) {
    console.error('加载课程失败:', err)
  }
}

async function createCourse() {
  try {
    const res = await axios.post('/api/teacher/courses', newCourse.value)
    ElMessage.success(res.data.message)
    createDialogVisible.value = false
    newCourse.value = { name: '', code: '', major: '计算机科学与技术', semester: '2025-2026-1', max_students: 60, syllabus: '' }
    await loadCourses()
  } catch (err) {
    ElMessage.error(err.response?.data?.detail || '创建课程失败')
  }
}

async function deleteCourse(courseId) {
  try {
    await ElMessageBox.confirm('确定要删除此课程吗？所有相关作业和学生选课也将被删除。', '警告', { type: 'warning' })
    await axios.delete(`/api/teacher/courses/${courseId}`)
    ElMessage.success('课程删除成功')
    await loadCourses()
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error(err.response?.data?.detail || '删除失败')
    }
  }
}

async function showAssignments(courseId) {
  currentCourseId.value = courseId
  const course = courses.value.find(c => c.id === courseId)
  currentCourseName.value = course?.name || ''

  try {
    const res = await axios.get(`/api/teacher/courses/${courseId}/assignments`)
    assignments.value = res.data.assignments || []
  } catch (err) {
    assignments.value = []
  }

  assignmentsDialogVisible.value = true
}

async function showCreateAssignment(courseId) {
  currentCourseId.value = courseId
  const course = courses.value.find(c => c.id === courseId)
  currentCourseName.value = course?.name || ''
  createAssignmentDialogVisible.value = true
}

async function createAssignment() {
  try {
    const data = {
      title: newAssignment.value.title,
      description: newAssignment.value.description,
      assignment_type: newAssignment.value.type,
      programming_language: newAssignment.value.language,
      due_date: newAssignment.value.due_date,
      ai_pre_grade_enabled: newAssignment.value.auto_grade,
    }

    const res = await axios.post(`/api/teacher/courses/${currentCourseId.value}/assignments`, data)
    ElMessage.success(res.data.message)
    createAssignmentDialogVisible.value = false
    newAssignment.value = { title: '', description: '', type: 'code', language: 'C', due_date: '', auto_grade: true }

    // 刷新课程列表（更新作业数）
    await loadCourses()
  } catch (err) {
    ElMessage.error(err.response?.data?.detail || '发布作业失败')
  }
}

function goAnalytics(courseId) {
  window.location.hash = `#/teacher/analytics/${courseId}`
}

onMounted(loadCourses)
</script>

<style scoped>
.teacher-courses {
  padding: 0;
}
</style>
