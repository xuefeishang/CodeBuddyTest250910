# 华夏建龙企业级应用系统

基于Spring Boot 3 + Vue的企业级管理系统后台程序。

## 系统概述

- **技术栈**: Spring Boot 3.2.0 + Java 17 + MySQL 8.4 + JWT认证
- **架构**: 分层架构（Controller-Service-Repository）
- **安全**: Spring Security + JWT令牌认证
- **数据库**: MySQL 8.4 + JPA/Hibernate ORM

## 快速开始

### 环境要求
- Java 17+
- MySQL 8.4+
- Maven 3.6+

### 数据库配置
1. 创建数据库：`hxjl`
2. 修改 `src/main/resources/application.yml` 中的数据库连接信息
3. 系统启动时会自动创建表结构和初始化数据

### 启动应用
```bash
mvn spring-boot:run
```

应用将在 http://localhost:8081 启动，API上下文路径为 `/api`

## API使用指南

### 1. 健康检查接口（无需认证）
- **GET** `/api/health` - 系统健康状态
- **GET** `/api/info` - 系统基本信息

### 2. 公开测试接口（无需认证）
- **GET** `/api/test/public` - 公开测试接口

### 3. 认证接口
- **POST** `/api/auth/login` - 用户登录

**请求示例:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**响应示例:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin",
  "realName": "系统管理员",
  "roles": ["ADMIN"]
}
```

### 4. 受保护接口（需要认证）
在请求头中添加：
```
Authorization: Bearer {token}
```

**测试接口:**
- **GET** `/api/test/user` - 需要USER角色
- **GET** `/api/test/admin` - 需要ADMIN角色

### 5. 业务功能接口

#### 系统管理模块
- **GET** `/api/system/users` - 获取用户列表
- **POST** `/api/system/users` - 创建用户
- **GET** `/api/system/roles` - 获取角色列表
- **GET** `/api/system/menus` - 获取菜单列表

#### CRM模块
- **GET** `/api/crm/customers` - 客户管理
- **GET** `/api/crm/suppliers` - 供应商管理
- **GET** `/api/crm/opportunities` - 商机管理
- **GET** `/api/crm/contracts` - 合同管理

#### 项目管理模块
- **GET** `/api/project/projects` - 项目管理
- **GET** `/api/project/tasks` - 任务管理

#### 生产管理模块
- **GET** `/api/production/mineral-processing` - 选矿管理
- **GET** `/api/production/mining` - 采矿管理
- **GET** `/api/production/tailings` - 尾矿管理
- **GET** `/api/production/quality-control` - 质检管理

#### 流程审批模块
- **GET** `/api/workflow/approvals` - 审批中心
- **GET** `/api/workflow/process-definitions` - 流程设计

## 默认账户

- **管理员账号**: `admin`
- **管理员密码**: `admin123`
- **角色**: ADMIN（拥有所有权限）

## 数据库初始化

系统启动时会自动：
1. 检查数据库连接
2. 创建所有必要的表结构
3. 初始化管理员账户和基础数据
4. 初始化系统菜单和权限配置

## 项目结构

```
src/main/java/com/hxjl/
├── config/           # 配置类
├── controller/       # 控制器层
├── entity/          # 实体类
├── repository/      # 数据访问层
├── service/         # 业务逻辑层
├── security/        # 安全配置
├── dto/            # 数据传输对象
└── utils/           # 工具类
```

## 开发说明

### 添加新的API接口
1. 在对应模块的Controller中添加方法
2. 配置安全权限（如果需要认证）
3. 实现Service层业务逻辑
4. 添加Repository数据访问

### 安全配置
- 所有API默认需要认证
- 使用JWT令牌进行身份验证
- 支持基于角色的访问控制

### 数据库操作
- 使用JPA进行数据持久化
- 实体类使用Lombok简化代码
- 支持自动建表和更新

## 故障排除

### 常见问题
1. **数据库连接失败**: 检查MySQL服务是否启动，连接配置是否正确
2. **端口占用**: 修改 `application.yml` 中的 `server.port`
3. **认证失败**: 检查用户名密码是否正确，JWT令牌是否有效

### 日志查看
应用启动和运行日志会输出到控制台，包含详细的错误信息。

## 技术支持

如有问题请联系技术团队或查看项目文档。

---
*华夏建龙技术团队 版权所有*