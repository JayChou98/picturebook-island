# MongoDB 连接检查脚本

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "MongoDB 诊断工具" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 1: 检查 MongoDB 是否安装
Write-Host "[1/5] 检查 MongoDB 是否安装..." -ForegroundColor Yellow
$mongoInstalled = Get-Command mongod -ErrorAction SilentlyContinue
if ($mongoInstalled) {
    Write-Host "MongoDB 已安装" -ForegroundColor Green
    mongod --version
} else {
    Write-Host "MongoDB 未安装" -ForegroundColor Red
}
Write-Host ""

# 检查 2: 检查 MongoDB 服务状态
Write-Host "[2/5] 检查 MongoDB 服务状态..." -ForegroundColor Yellow
$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
if ($mongoService) {
    Write-Host "MongoDB 服务已安装" -ForegroundColor Green
    Write-Host "  状态: $($mongoService.Status)" -ForegroundColor Cyan
    if ($mongoService.Status -ne 'Running') {
        Write-Host "  正在启动 MongoDB 服务..." -ForegroundColor Yellow
        Start-Service -Name MongoDB
        Start-Sleep -Seconds 2
        $mongoService = Get-Service -Name MongoDB
        Write-Host "  新状态: $($mongoService.Status)" -ForegroundColor Cyan
    }
} else {
    Write-Host "MongoDB 服务未安装" -ForegroundColor Red
}
Write-Host ""

# 检查 3: 检查 MongoDB 连接
Write-Host "[3/5] 测试 MongoDB 连接..." -ForegroundColor Yellow
try {
    $testConnection = Test-NetConnection -ComputerName localhost -Port 27017 -InformationLevel Quiet -ErrorAction SilentlyContinue
    if ($testConnection) {
        Write-Host "MongoDB 端口 27017 可访问" -ForegroundColor Green
    } else {
        Write-Host "MongoDB 端口 27017 无法访问" -ForegroundColor Red
    }
} catch {
    Write-Host "无法测试 MongoDB 连接: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 检查 4: 检查 .env 配置
Write-Host "[4/5] 检查 .env 配置..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host ".env 文件存在" -ForegroundColor Green
    $envContent = Get-Content ".env"
    $mongoUri = $envContent | Where-Object { $_ -match "MONGODB_URI" }
    if ($mongoUri) {
        Write-Host "  MONGODB_URI: $mongoUri" -ForegroundColor Cyan
    } else {
        Write-Host "未找到 MONGODB_URI 配置" -ForegroundColor Red
    }
} else {
    Write-Host ".env 文件不存在" -ForegroundColor Red
}
Write-Host ""

# 检查 5: 检查后端服务器
Write-Host "[5/5] 检查后端服务器..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method GET -ErrorAction Stop
    Write-Host "后端服务器运行中" -ForegroundColor Green
    Write-Host "  MongoDB 状态: $($response.mongodb)" -ForegroundColor Cyan
    Write-Host "  环境: $($response.environment)" -ForegroundColor Cyan
} catch {
    Write-Host "后端服务器未运行或无法访问" -ForegroundColor Red
    Write-Host "  错误: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "诊断完成" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# 提供解决方案
Write-Host "如果 MongoDB 连接失败，请参考 SETUP_MONGODB.md 获取详细的安装和配置指南。" -ForegroundColor Yellow
Write-Host ""
Write-Host "推荐的快速解决方案：使用 MongoDB Atlas（免费云服务）" -ForegroundColor Green
Write-Host "1. 访问 https://www.mongodb.com/cloud/atlas" -ForegroundColor Cyan
Write-Host "2. 注册免费账户并创建集群" -ForegroundColor Cyan
Write-Host "3. 更新 server/.env 文件中的 MONGODB_URI" -ForegroundColor Cyan
Write-Host "4. 重启后端服务器: node src/server.js" -ForegroundColor Cyan
Write-Host ""