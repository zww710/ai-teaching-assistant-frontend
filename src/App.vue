<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', Arial, sans-serif;
  background-color: #f5f7fa;
}

#app {
  min-height: 100vh;
}

/* Login page styles (global, always loaded) */
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

.login-card {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  margin: 12px 0 6px;
  font-size: 22px;
  color: #333;
}

.login-header p {
  color: #999;
  font-size: 14px;
}

.login-form {
  margin-top: 20px;
}

.demo-hints {
  margin-top: 20px;
  padding: 12px;
  background: #f0f5ff;
  border-radius: 8px;
  font-size: 13px;
  color: #666;
}

.demo-hints p {
  margin: 4px 0;
}
</style>
