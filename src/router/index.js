import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { guest: true },
  },
  {
    path: '/',
    component: () => import('../views/Layout.vue'),
    meta: { requiresAuth: true },
    redirect: '/student/dashboard',
    children: [
      // Teacher routes
      {
        path: 'teacher/dashboard',
        name: 'TeacherDashboard',
        component: () => import('../views/teacher/Dashboard.vue'),
        meta: { role: 'teacher' },
      },
      {
        path: 'teacher/courses',
        name: 'TeacherCourses',
        component: () => import('../views/teacher/Courses.vue'),
        meta: { role: 'teacher' },
      },
      {
        path: 'teacher/grading/:id',
        name: 'TeacherGrading',
        component: () => import('../views/teacher/Grading.vue'),
        meta: { role: 'teacher' },
      },
      {
        path: 'teacher/analytics/:id',
        name: 'TeacherAnalytics',
        component: () => import('../views/teacher/Analytics.vue'),
        meta: { role: 'teacher' },
      },
      {
        path: 'teacher/lesson-plans',
        name: 'LessonPlans',
        component: () => import('../views/teacher/LessonPlans.vue'),
        meta: { role: 'teacher' },
      },
      // Student routes
      {
        path: 'student/dashboard',
        name: 'StudentDashboard',
        component: () => import('../views/student/Dashboard.vue'),
        meta: { role: 'student' },
      },
      {
        path: 'student/chat',
        name: 'StudentChat',
        component: () => import('../views/student/Chat.vue'),
        meta: { role: 'student' },
      },
      {
        path: 'student/assignments',
        name: 'StudentAssignments',
        component: () => import('../views/student/Assignments.vue'),
        meta: { role: 'student' },
      },
      {
        path: 'student/portfolio',
        name: 'StudentPortfolio',
        component: () => import('../views/student/Portfolio.vue'),
        meta: { role: 'student' },
      },
      {
        path: 'student/learning-path',
        name: 'LearningPath',
        component: () => import('../views/student/LearningPath.vue'),
        meta: { role: 'student' },
      },
      {
        path: 'student/courses',
        name: 'StudentCourses',
        component: () => import('../views/student/Courses.vue'),
        meta: { role: 'student' },
      },
      // Admin routes
      {
        path: 'admin/overview',
        name: 'AdminOverview',
        component: () => import('../views/admin/Overview.vue'),
        meta: { role: 'admin' },
      },
      {
        path: 'admin/users',
        name: 'AdminUsers',
        component: () => import('../views/admin/Users.vue'),
        meta: { role: 'admin' },
      },
      {
        path: 'admin/classes',
        name: 'AdminClasses',
        component: () => import('../views/admin/Classes.vue'),
        meta: { role: 'admin' },
      },
      {
        path: 'admin/trends',
        name: 'AdminTrends',
        component: () => import('../views/admin/Trends.vue'),
        meta: { role: 'admin' },
      },
      {
        path: 'admin/reports',
        name: 'AdminReports',
        component: () => import('../views/admin/Reports.vue'),
        meta: { role: 'admin' },
      },
      {
        path: 'admin/roi',
        name: 'AdminROI',
        component: () => import('../views/admin/ROIDashboard.vue'),
        meta: { role: 'admin' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.guest && auth.isLoggedIn) {
    // Redirect based on role
    const roleMap = { teacher: '/teacher/dashboard', student: '/student/dashboard', admin: '/admin/overview' }
    next(roleMap[auth.user?.role] || '/student/dashboard')
    return
  }

  if (to.meta.role && auth.user?.role !== to.meta.role) {
    next('/login')
    return
  }

  next()
})

export default router
