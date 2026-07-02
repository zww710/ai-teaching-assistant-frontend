<template>
  <el-container class="layout-container">
    <!-- Sidebar -->
    <el-aside :width="isCollapsed ? '64px' : '220px'" class="sidebar">
      <div class="logo-area">
        <el-icon :size="28"><School /></el-icon>
        <span v-if="!isCollapsed" class="logo-text">AI助教Copilot</span>
      </div>

      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapsed"
        router
        background-color="#001529"
        text-color="#ffffffa6"
        active-text-color="#1890ff"
      >
        <!-- Teacher Menu -->
        <template v-if="userRole === 'teacher'">
          <el-menu-item index="/teacher/dashboard">
            <el-icon><DataAnalysis /></el-icon>
            <span>工作台</span>
          </el-menu-item>
          <el-menu-item index="/teacher/courses">
            <el-icon><Reading /></el-icon>
            <span>课程管理</span>
          </el-menu-item>
          <el-menu-item index="/teacher/lesson-plans">
            <el-icon><EditPen /></el-icon>
            <span>AI备课</span>
          </el-menu-item>
        </template>

        <!-- Student Menu -->
        <template v-if="userRole === 'student'">
          <el-menu-item index="/student/dashboard">
            <el-icon><HomeFilled /></el-icon>
            <span>我的主页</span>
          </el-menu-item>
          <el-menu-item index="/student/chat">
            <el-icon><ChatDotRound /></el-icon>
            <span>AI导师</span>
          </el-menu-item>
          <el-menu-item index="/student/assignments">
            <el-icon><Document /></el-icon>
            <span>我的作业</span>
          </el-menu-item>
          <el-menu-item index="/student/portfolio">
            <el-icon><FolderOpened /></el-icon>
            <span>作品集</span>
          </el-menu-item>
          <el-menu-item index="/student/learning-path">
            <el-icon><Connection /></el-icon>
            <span>学习路径</span>
          </el-menu-item>
          <el-menu-item index="/student/courses">
            <el-icon><School /></el-icon>
            <span>选课中心</span>
          </el-menu-item>
        </template>

        <!-- Admin Menu -->
        <template v-if="userRole === 'admin'">
          <el-menu-item index="/admin/overview">
            <el-icon><Odometer /></el-icon>
            <span>数据驾驶舱</span>
          </el-menu-item>
          <el-menu-item index="/admin/users">
            <el-icon><User /></el-icon>
            <span>师生管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/classes">
            <el-icon><School /></el-icon>
            <span>班级管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/trends">
            <el-icon><TrendCharts /></el-icon>
            <span>学情趋势</span>
          </el-menu-item>
          <el-menu-item index="/admin/reports">
            <el-icon><DocumentChecked /></el-icon>
            <span>评估报告</span>
          </el-menu-item>
          <el-menu-item index="/admin/roi">
            <el-icon><Money /></el-icon>
            <span>ROI看板</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <!-- Main Content -->
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-icon :size="20" class="collapse-btn" @click="isCollapsed = !isCollapsed">
            <Fold v-if="!isCollapsed" />
            <Expand v-else />
          </el-icon>
          <span class="page-title">{{ pageTitle }}</span>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32">{{ userName?.charAt(0) || 'U' }}</el-avatar>
              <span class="user-name">{{ userName }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const isCollapsed = ref(false)

const userRole = computed(() => auth.user?.role)
const userName = computed(() => auth.userName)

const menuTitles = {
  '/teacher/dashboard': '教师工作台',
  '/teacher/courses': '课程管理',
  '/teacher/grading': '智能批改',
  '/teacher/analytics': '学情分析',
  '/teacher/lesson-plans': 'AI备课助手',
  '/student/dashboard': '学生主页',
  '/student/chat': 'AI智能导师',
  '/student/assignments': '我的作业',
  '/student/portfolio': '个人作品集',
  '/student/learning-path': '自适应学习路径',
  '/student/courses': '选课中心',
  '/admin/overview': '全校数据驾驶舱',
  '/admin/users': '师生管理',
  '/admin/classes': '班级管理',
  '/admin/trends': '学情趋势分析',
  '/admin/reports': '评估报告生成',
  '/admin/roi': 'ROI投入产出看板',
}

const pageTitle = computed(() => menuTitles[route.path] || 'AI助教系统')
const activeMenu = computed(() => route.path)

function handleCommand(cmd) {
  if (cmd === 'logout') {
    auth.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.sidebar {
  background-color: #001529;
  transition: width 0.3s;
  overflow: hidden;
}

.logo-area {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #fff;
  border-bottom: 1px solid #ffffff1a;
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}

.el-menu {
  border-right: none;
}

.header {
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.collapse-btn {
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.collapse-btn:hover {
  background: #f0f0f0;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.user-name {
  font-size: 14px;
  color: #333;
}

.main-content {
  background: #f5f7fa;
  padding: 20px;
  overflow-y: auto;
}
</style>
