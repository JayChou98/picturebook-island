# 前端开发服务器启动脚本

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "绘本岛 - 前端启动脚本" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "正在启动前端开发服务器..." -ForegroundColor Yellow
Write-Host "地址: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Yellow
Write-Host ""

# 启动 Vite 开发服务器
node node_modules/vite/bin/vite.js