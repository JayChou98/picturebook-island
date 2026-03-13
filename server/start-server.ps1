# MongoDB 和后端服务器启动脚本

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "绘本岛 - 服务器启动脚本" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# 检查并启动 MongoDB
Write-Host "[1/2] 检查 MongoDB..." -ForegroundColor Yellow
$mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
if ($mongoProcess) {
    Write-Host "MongoDB 已运行 (PID: $($mongoProcess.Id))" -ForegroundColor Green
} else {
    Write-Host "正在启动 MongoDB..." -ForegroundColor Yellow
    
    # 检查 MongoDB 是否安装
    if (Test-Path "D:\软件\MongoDB\bin\mongod.exe") {
        $mongoExe = "D:\软件\MongoDB\bin\mongod.exe"
        $dbPath = "D:\软件\MongoDB\data"
        $logPath = "D:\软件\MongoDB\log\mongod.log"
        
        # 启动 MongoDB
        Start-Process -FilePath $mongoExe -ArgumentList "--dbpath", $dbPath, "--logpath", $logPath -WindowStyle Minimized
        
        Start-Sleep -Seconds 3
        Write-Host "MongoDB 已启动" -ForegroundColor Green
    } else {
        Write-Host "错误: 未找到 MongoDB 安装" -ForegroundColor Red
        Write-Host "请参考 SETUP_MONGODB.md 配置 MongoDB" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""

# 启动后端服务器
Write-Host "[2/2] 启动后端服务器..." -ForegroundColor Yellow
Write-Host "后端服务器地址: http://localhost:3000" -ForegroundColor Cyan
Write-Host "前端应用地址: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Yellow
Write-Host ""

# 启动 Node.js 服务器
node src/server.js