import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || '',
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    userRole: (state) => state.user?.role,
    userName: (state) => state.user?.full_name || state.user?.username,
  },

  actions: {
    setAuth(token, user) {
      this.token = token
      this.user = user
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },

    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
    },

    async login(username, password) {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)

      const res = await axios.post('/api/auth/login', formData)
      this.setAuth(res.data.access_token, res.data.user)
      return res.data
    },

    async register(username, email, password, role, fullName, department) {
      const res = await axios.post('/api/auth/register', {
        username, email, password, role, full_name: fullName, department,
      })
      this.setAuth(res.data.access_token, res.data.user)
      return res.data
    },

    async fetchUser() {
      const res = await axios.get('/api/auth/me')
      this.user = res.data
      localStorage.setItem('user', JSON.stringify(res.data))
    },
  },
})

// Configure axios
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';
axios.defaults.baseURL = API_BASE;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      // Only call useAuthStore() if Pinia is already initialized
      try {
        const auth = useAuthStore()
        auth.logout()
      } catch(e) {}
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
