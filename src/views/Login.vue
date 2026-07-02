<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <el-icon :size="48" color="#1890ff"><Cpu /></el-icon>
        <h2>全链路AI智能Copilot助教系统</h2>
        <p>高校工科专业AI实训助教平台</p>
      </div>

      <el-tabs v-model="activeTab" class="login-tabs">
        <el-tab-pane label="登录" name="login">
          <el-form @submit.prevent="handleLogin" class="login-form">
            <el-form-item>
              <el-input
                v-model="form.username"
                placeholder="用户名"
                prefix-icon="User"
                size="large"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="form.password"
                type="password"
                placeholder="密码"
                prefix-icon="Lock"
                size="large"
                show-password
                @keyup.enter="handleLogin"
              />
            </el-form-item>
            <el-button type="primary" size="large" style="width:100%" :loading="loading" @click="handleLogin">
              登 录
            </el-button>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="注册" name="register">
          <el-form @submit.prevent="handleRegister" class="login-form">
            <el-form-item>
              <el-input v-model="form.username" placeholder="用户名" size="large" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="form.email" placeholder="邮箱" size="large" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="form.password" type="password" placeholder="密码" size="large" show-password />
            </el-form-item>
            <el-form-item>
              <el-select v-model="form.role" placeholder="角色" size="large" style="width:100%">
                <el-option label="教师" value="teacher" />
                <el-option label="学生" value="student" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="form.fullName" placeholder="姓名" size="large" />
            </el-form-item>
            <el-button type="primary" size="large" style="width:100%" :loading="loading" @click="handleRegister">
              注 册
            </el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <!-- Demo login hints -->
      <div class="demo-hints">
        <p><strong>演示账号：</strong></p>
        <p>教师: teacher / password</p>
        <p>学生: student / password</p>
        <p>管理员: admin / password</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const activeTab = ref('login')
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
  email: '',
  role: 'student',
  fullName: '',
})

async function handleLogin() {
  if (!form.username || !form.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  loading.value = true
  try {
    await auth.login(form.username, form.password)
    ElMessage.success('登录成功')
    const roleMap = { teacher: '/teacher/dashboard', student: '/student/dashboard', admin: '/admin/overview' }
    const redirect = route.query.redirect || roleMap[auth.user?.role] || '/student/dashboard'
    router.push(redirect)
  } catch (err) {
    ElMessage.error(err.response?.data?.detail || '登录失败')
  } finally {
    loading.value = false
  }
}

async function handleRegister() {
  if (!form.username || !form.password || !form.email) {
    ElMessage.warning('请填写必填字段')
    return
  }
  loading.value = true
  try {
    await auth.register(form.username, form.email, form.password, form.role, form.fullName, '')
    ElMessage.success('注册成功')
    const roleMap = { teacher: '/teacher/dashboard', student: '/student/dashboard', admin: '/admin/overview' }
    router.push(roleMap[form.role] || '/student/dashboard')
  } catch (err) {
    ElMessage.error(err.response?.data?.detail || '注册失败')
  } finally {
    loading.value = false
  }
}
</script>
