<template>
  <div class="student-chat">
    <el-row :gutter="20" style="height: calc(100vh - 140px);">
      <!-- Chat Area -->
      <el-col :span="16">
        <el-card shadow="hover" class="chat-card">
          <template #header>
            <div style="display:flex;align-items:center;gap:8px;">
              <el-icon :size="20" color="#1890ff"><ChatDotRound /></el-icon>
              <span>AI智能导师</span>
              <el-tag size="small" type="success">7×24在线</el-tag>
            </div>
          </template>

          <div ref="chatContainer" class="chat-messages">
            <div v-for="(msg, i) in messages" :key="i" class="message" :class="msg.role">
              <el-avatar :size="36" :style="{ background: msg.role === 'user' ? '#1890ff' : '#52c41a' }">
                {{ msg.role === 'user' ? '我' : 'AI' }}
              </el-avatar>
              <div class="message-bubble">
                <div class="message-content" v-html="renderMarkdown(msg.content)"></div>
                <div class="message-time">{{ msg.time }}</div>
              </div>
            </div>

            <div v-if="sending" class="message ai">
              <el-avatar :size="36" style="background:#52c41a">AI</el-avatar>
              <div class="message-bubble">
                <el-skeleton :rows="3" animated />
              </div>
            </div>
          </div>

          <div class="chat-input-area">
            <el-input
              v-model="inputMessage"
              type="textarea"
              :rows="3"
              placeholder="输入你的问题... (支持代码、电路图描述、报错信息)"
              @keydown.ctrl.enter="sendMessage"
            />
            <div class="input-actions">
              <el-space>
                <el-upload :show-file-list="false" accept=".txt,.py,.c,.java,.verilog" :before-upload="handleFileUpload">
                  <el-button size="small" text>
                    <el-icon><Upload /></el-icon> 上传代码
                  </el-button>
                </el-upload>
                <el-button size="small" text @click="inputMessage = ''">清空</el-button>
              </el-space>
              <el-button type="primary" @click="sendMessage" :loading="sending" :disabled="!inputMessage.trim()">
                <el-icon><Promotion /></el-icon> 发送
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- Sidebar: Follow-ups & Info -->
      <el-col :span="8">
        <el-card shadow="hover" style="margin-bottom: 20px;">
          <template #header><span>建议追问</span></template>
          <el-space direction="vertical" style="width:100%">
            <el-tag
              v-for="(q, i) in suggestedFollowUps"
              :key="i"
              closable
              @close="suggestedFollowUps.splice(i, 1)"
              @click="inputMessage = q"
              style="cursor:pointer;width:100%"
            >
              {{ q }}
            </el-tag>
            <el-empty v-if="suggestedFollowUps.length === 0" description="开始对话后显示建议" :image-size="40" />
          </el-space>
        </el-card>

        <el-card shadow="hover">
          <template #header><span>快捷提问</span></template>
          <el-space direction="vertical" style="width:100%">
            <el-button size="small" text @click="inputMessage='什么是栈溢出？如何避免？'">
              🐛 栈溢出问题
            </el-button>
            <el-button size="small" text @click="inputMessage='帮我分析这段代码的错误'">
              🔍 代码错误分析
            </el-button>
            <el-button size="small" text @click="inputMessage='如何设计一个单片机中断系统？'">
              💡 单片机中断设计
            </el-button>
            <el-button size="small" text @click="inputMessage='解释一下总线错误的含义'">
              ⚡ 总线错误排查
            </el-button>
            <el-button size="small" text @click="inputMessage='帮我理解这段电路图的逻辑'">
              🔌 电路图分析
            </el-button>
          </el-space>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { marked } from 'marked'

const chatContainer = ref(null)
const inputMessage = ref('')
const sending = ref(false)
const messages = ref([
  {
    role: 'ai',
    content: '你好！我是你的AI智能导师 🎓\n\n我支持多种模态的交互：\n- 💻 代码问题分析（C/Python/Java/Verilog/汇编）\n- ⚡ 电路图和嵌入式故障排查\n- 📊 报错信息诊断\n- 📚 专业知识答疑\n\n我会用引导式的方式帮助你独立思考，不会直接给你答案哦～',
    time: new Date().toLocaleTimeString(),
  },
])
const suggestedFollowUps = ref([])

function renderMarkdown(text) {
  try {
    return marked.parse(text || '')
  } catch {
    return text
  }
}

async function sendMessage() {
  const text = inputMessage.value.trim()
  if (!text || sending.value) return

  messages.value.push({ role: 'user', content: text, time: new Date().toLocaleTimeString() })
  inputMessage.value = ''
  sending.value = true

  try {
    const res = await axios.post('/api/student/chat', { content: text })
    messages.value.push({
      role: 'ai',
      content: res.data.answer,
      time: new Date().toLocaleTimeString(),
    })
    suggestedFollowUps.value = res.data.suggested_follow_up || []
  } catch (err) {
    ElMessage.error('发送失败，请重试')
    messages.value.push({
      role: 'ai',
      content: '抱歉，出现了错误。请重试或联系教师。',
      time: new Date().toLocaleTimeString(),
    })
  } finally {
    sending.value = false
    await nextTick()
    scrollToBottom()
  }
}

function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

function handleFileUpload(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    inputMessage.value = `请帮我分析以下代码是否有错误：\n\n\`\`\`\n${e.target.result}\n\`\`\``
  }
  reader.readAsText(file)
  return false
}

onMounted(scrollToBottom)
</script>

<style scoped>
.chat-card {
  height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;
}

.chat-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.message {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.message.user {
  flex-direction: row-reverse;
}

.message-bubble {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 12px;
  background: #f5f5f5;
}

.message.user .message-bubble {
  background: #1890ff;
  color: #fff;
}

.message-content {
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.message-content h1, .message-content h2, .message-content h3 {
  margin: 8px 0 4px;
}

.message-content code {
  background: rgba(0,0,0,0.06);
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 13px;
}

.message-time {
  font-size: 11px;
  opacity: 0.6;
  margin-top: 4px;
}

.chat-input-area {
  border-top: 1px solid #eee;
  padding: 16px;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}
</style>
