<template>
  <div class="learning-path">
    <el-card shadow="hover">
      <template #header><span>自适应学习路径</span></template>

      <el-row :gutter="20">
        <el-col :span="10">
          <div ref="radarChartRef" style="width:100%;height:350px;"></div>
        </el-col>
        <el-col :span="14">
          <el-timeline>
            <el-timeline-item
              v-for="(stage, i) in stages"
              :key="i"
              :timestamp="`第${stage.week}周`"
              :type="i <= currentStage ? 'primary' : 'info'"
              :icon="i < currentStage ? 'Check' : i === currentStage ? 'CaretRight' : ''"
            >
              <el-card shadow="never">
                <h4>{{ stage.name }}</h4>
                <p style="color:#999;font-size:13px;">{{ stage.focus }}</p>
                <el-tag v-for="skill in stage.skills" :key="skill" size="small" style="margin:4px 2px 0 0;">{{ skill }}</el-tag>
                <div style="margin-top:8px;">
                  <el-progress :percentage="stage.progress" :status="stage.progress >= 100 ? 'success' : ''" />
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const radarChartRef = ref(null)
const currentStage = ref(1)

const stages = ref([
  { week: 1, name: '基础语法巩固', focus: '变量、数据类型、运算符、控制流', skills: ['C语言基础', 'Python基础'], progress: 100 },
  { week: 2, name: '函数与模块化', focus: '函数定义、参数传递、模块化编程', skills: ['函数封装', '模块化设计'], progress: 65 },
  { week: 3, name: '数据结构入门', focus: '数组、链表、栈、队列', skills: ['线性结构', '抽象数据类型'], progress: 30 },
  { week: 4, name: '算法基础', focus: '排序、查找、递归', skills: ['时间复杂度', '递归思维'], progress: 0 },
  { week: 5, name: '嵌入式进阶', focus: '指针、内存管理、寄存器操作', skills: ['指针运算', '内存模型'], progress: 0 },
  { week: 6, name: '电路设计实践', focus: '原理图设计、仿真验证', skills: ['电路分析', 'EDA工具'], progress: 0 },
])

onMounted(() => {
  if (!radarChartRef.value) return
  const chart = echarts.init(radarChartRef.value)
  chart.setOption({
    title: { text: '能力雷达图', left: 'center', textStyle: { fontSize: 16 } },
    radar: {
      indicator: [
        { name: '编程基础', max: 100 },
        { name: '调试能力', max: 100 },
        { name: '电路设计', max: 100 },
        { name: '算法思维', max: 100 },
        { name: '工程实践', max: 100 },
        { name: '文档能力', max: 100 },
      ],
      radius: '60%',
    },
    series: [{
      type: 'radar',
      data: [
        { value: [75, 58, 45, 40, 50, 65], name: '当前能力', areaStyle: { color: 'rgba(24,144,255,0.2)' }, lineStyle: { color: '#1890ff' } },
        { value: [90, 85, 80, 85, 90, 80], name: '目标能力', areaStyle: { color: 'rgba(82,196,26,0.1)' }, lineStyle: { color: '#52c41a', type: 'dashed' } },
      ],
    }],
    legend: { bottom: 0, data: ['当前能力', '目标能力'] },
  })
})
</script>
