<template>
  <div class="teacher-grading">
    <el-card shadow="hover">
      <template #header><span>智能批改 - {{ assignment?.title || '加载中...' }}</span></template>
      <el-alert title="AI四维智能批改" type="info" :closable="false" style="margin-bottom:16px;">
        评分维度: 正确性(40%) + 完整性(30%) + 规范性(20%) + 创新性(10%)
      </el-alert>

      <el-descriptions :column="2" border v-if="submission">
        <el-descriptions-item label="学生">{{ submission.student_name }}</el-descriptions-item>
        <el-descriptions-item label="提交时间">{{ submission.submitted_at }}</el-descriptions-item>
        <el-descriptions-item label="代码语言">{{ submission.language }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="submission.graded ? 'success' : 'warning'">
            {{ submission.graded ? '已批改' : '待批改' }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <div v-if="submission" style="margin-top:20px;">
        <h4>代码内容</h4>
        <pre style="background:#f5f5f5;padding:16px;border-radius:8px;overflow:auto;max-height:300px;">{{ submission.code }}</pre>

        <template v-if="submission.graded">
          <h4 style="margin-top:20px;">批改结果</h4>
          <el-row :gutter="16">
            <el-col :span="6">
              <el-card shadow="never">
                <el-statistic title="正确性" :value="submission.grades.correctness" suffix="/40" />
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="never">
                <el-statistic title="完整性" :value="submission.grades.completeness" suffix="/30" />
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="never">
                <el-statistic title="规范性" :value="submission.grades.standard" suffix="/20" />
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="never">
                <el-statistic title="创新性" :value="submission.grades.innovation" suffix="/10" />
                <el-divider />
                <el-statistic title="总分" :value="submission.grades.total" suffix="/100" />
              </el-card>
            </el-col>
          </el-row>

          <h4 style="margin-top:16px;">AI反馈</h4>
          <div style="padding:12px;background:#f0f5ff;border-radius:8px;">{{ submission.feedback }}</div>

          <h4 style="margin-top:16px;">识别错误</h4>
          <el-tag v-for="err in submission.errors" :key="err" style="margin:4px;">{{ err }}</el-tag>

          <h4 style="margin-top:16px;">改进建议</h4>
          <ol style="padding-left:20px;">
            <li v-for="(s, i) in submission.suggestions" :key="i">{{ s }}</li>
          </ol>
        </template>

        <el-button v-else type="primary" @click="triggerGrading">触发AI批改</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const assignment = ref(null)
const submission = ref(null)

const triggerGrading = async () => {
  // Simulate grading
  submission.value = {
    student_name: '张三',
    language: 'C',
    code: '#include <stdio.h>\nint main() {\n    int arr[10];\n    for(int i=0; i<=10; i++) {\n        arr[i] = i;\n    }\n    return 0;\n}',
    submitted_at: '2025-06-15 14:30:00',
    graded: true,
    grades: { correctness: 32, completeness: 25, standard: 16, innovation: 7, total: 80 },
    feedback: '代码整体结构正确，实现了数组赋值功能。但在循环边界处存在栈溢出风险（i<=10应改为i<10），建议注意数组索引边界检查。',
    errors: ['栈溢出风险(loop边界)', '缺少注释', '未使用const'],
    suggestions: ['修正循环条件: i < 10', '添加必要的注释说明', '考虑使用const修饰不可变变量'],
  }
}
</script>
