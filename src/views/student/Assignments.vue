<template>
  <div class="student-assignments">
    <el-card shadow="hover">
      <template #header><span>我的作业</span></template>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="待完成" name="pending">
          <el-table :data="pendingAssignments" stripe v-if="pendingAssignments.length">
            <el-table-column prop="title" label="作业标题" min-width="200" />
            <el-table-column prop="course_code" label="课程" width="120" />
            <el-table-column prop="type" label="类型" width="80">
              <template #default="{ row }">
                <el-tag size="small">{{ typeLabels[row.type] || row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="due_date" label="截止" width="120">
              <template #default="{ row }">
                {{ row.due_date ? new Date(row.due_date).toLocaleDateString() : '-' }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="{ row }">
                <el-button type="primary" text @click="openSubmitDialog(row)">提交</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-else description="暂无待完成作业" />
        </el-tab-pane>
        <el-tab-pane label="已完成" name="completed">
          <el-table :data="completedSubmissions" stripe>
            <el-table-column prop="assignment_title" label="作业" min-width="200" />
            <el-table-column label="分数" width="80">
              <template #default="{ row }">
                <el-tag :type="row.score >= 80 ? 'success' : row.score >= 60 ? '' : 'danger'">
                  {{ row.score ?? '-' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="反馈" min-width="200">
              <template #default="{ row }">
                {{ row.feedback ? row.feedback.substring(0, 100) + '...' : '-' }}
              </template>
            </el-table-column>
            <el-table-column prop="submitted_at" label="提交时间" width="160">
              <template #default="{ row }">
                {{ row.submitted_at ? new Date(row.submitted_at).toLocaleDateString() : '-' }}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- Submit Dialog -->
    <el-dialog v-model="submitVisible" title="提交作业" width="700px">
      <el-form label-width="100px">
        <el-form-item label="作业"><strong>{{ currentAssignment?.title }}</strong></el-form-item>
        <el-form-item label="代码内容">
          <el-input v-model="codeContent" type="textarea" :rows="10" placeholder="粘贴你的代码..." />
        </el-form-item>
        <el-form-item label="实验报告">
          <el-input v-model="reportContent" type="textarea" :rows="5" placeholder="实验报告内容（可选）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="submitVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const activeTab = ref('pending')
const pendingAssignments = ref([])
const completedSubmissions = ref([])
const submitVisible = ref(false)
const submitting = ref(false)
const currentAssignment = ref(null)
const codeContent = ref('')
const reportContent = ref('')

const typeLabels = { code: '代码', circuit: '电路', report: '报告', project: '项目' }

async function loadAssignments() {
  try {
    const res = await axios.get('/api/student/dashboard')
    pendingAssignments.value = res.data.pending_assignments || []
  } catch (err) {
    console.error(err)
  }
}

function openSubmitDialog(assignment) {
  currentAssignment.value = assignment
  codeContent.value = ''
  reportContent.value = ''
  submitVisible.value = true
}

async function handleSubmit() {
  if (!codeContent.value.trim()) {
    ElMessage.warning('请输入代码内容')
    return
  }
  submitting.value = true
  try {
    await axios.post('/api/student/submissions', {
      assignment_id: currentAssignment.value.id,
      code_content: codeContent.value,
      report_content: reportContent.value,
    })
    ElMessage.success('提交成功！')
    submitVisible.value = false
    loadAssignments()
  } catch (err) {
    ElMessage.error('提交失败')
  } finally {
    submitting.value = false
  }
}

loadAssignments()
</script>
