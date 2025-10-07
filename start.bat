@echo off
echo ========================================
echo 华夏建龙企业级应用系统 - 后台启动脚本
echo ========================================
echo.

echo 检查Java环境...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Java环境，请安装JDK 17+
    pause
    exit /b 1
)

echo 检查Maven环境...
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Maven环境
    pause
    exit /b 1
)

echo 开始编译项目...
mvn clean compile

if %errorlevel% neq 0 (
    echo 错误: 项目编译失败
    pause
    exit /b 1
)

echo 项目编译成功，启动应用...
echo 应用将在 http://localhost:8080 启动
echo 按 Ctrl+C 停止应用

mvn spring-boot:run

pause