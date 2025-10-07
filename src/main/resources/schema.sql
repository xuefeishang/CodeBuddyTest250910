-- 华夏建龙企业级应用系统数据库初始化脚本

-- 创建系统菜单表
CREATE TABLE IF NOT EXISTS sys_menu (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    path VARCHAR(200),
    component VARCHAR(200),
    icon VARCHAR(50),
    sort INT DEFAULT 0,
    type VARCHAR(20) NOT NULL,
    parent_id BIGINT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES sys_menu(id)
);

-- 创建系统角色表
CREATE TABLE IF NOT EXISTS sys_role (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_code VARCHAR(50) UNIQUE NOT NULL,
    role_name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建系统用户表
CREATE TABLE IF NOT EXISTS sys_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    real_name VARCHAR(100),
    avatar VARCHAR(500),
    email VARCHAR(100),
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建用户角色关联表
CREATE TABLE IF NOT EXISTS sys_user_role (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES sys_user(id),
    FOREIGN KEY (role_id) REFERENCES sys_role(id)
);

-- 创建角色菜单关联表
CREATE TABLE IF NOT EXISTS sys_role_menu (
    role_id BIGINT NOT NULL,
    menu_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, menu_id),
    FOREIGN KEY (role_id) REFERENCES sys_role(id),
    FOREIGN KEY (menu_id) REFERENCES sys_menu(id)
);

-- 创建CRM客户表
CREATE TABLE IF NOT EXISTS crm_customer (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50),
    type VARCHAR(50),
    industry VARCHAR(100),
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address VARCHAR(500),
    status VARCHAR(20),
    level VARCHAR(20),
    source VARCHAR(50),
    description TEXT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建CRM供应商表
CREATE TABLE IF NOT EXISTS crm_supplier (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50),
    type VARCHAR(50),
    industry VARCHAR(100),
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address VARCHAR(500),
    status VARCHAR(20),
    qualification VARCHAR(100),
    description TEXT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建CRM商机表
CREATE TABLE IF NOT EXISTS crm_opportunity (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    customer_id BIGINT,
    expected_amount DECIMAL(15,2),
    stage VARCHAR(50),
    probability VARCHAR(20),
    source VARCHAR(50),
    priority VARCHAR(20),
    description TEXT,
    expected_close_date DATETIME,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES crm_customer(id)
);

-- 创建CRM合同表
CREATE TABLE IF NOT EXISTS crm_contract (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    contract_number VARCHAR(100) NOT NULL,
    name VARCHAR(200) NOT NULL,
    customer_id BIGINT,
    amount DECIMAL(15,2),
    type VARCHAR(50),
    status VARCHAR(20),
    start_date DATETIME,
    end_date DATETIME,
    terms TEXT,
    description TEXT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES crm_customer(id)
);

-- 创建项目表
CREATE TABLE IF NOT EXISTS project (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50),
    type VARCHAR(50),
    status VARCHAR(20),
    priority VARCHAR(20),
    description TEXT,
    start_date DATETIME,
    end_date DATETIME,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建项目任务表
CREATE TABLE IF NOT EXISTS project_task (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    project_id BIGINT,
    status VARCHAR(20),
    priority VARCHAR(20),
    assignee VARCHAR(100),
    description TEXT,
    start_date DATETIME,
    end_date DATETIME,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES project(id)
);

-- 创建生产管理相关表
CREATE TABLE IF NOT EXISTS production_mineral_processing (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    process_name VARCHAR(200) NOT NULL,
    ore_type VARCHAR(100),
    input_amount DECIMAL(15,2),
    output_amount DECIMAL(15,2),
    recovery_rate DECIMAL(5,2),
    status VARCHAR(20),
    operator VARCHAR(100),
    description TEXT,
    process_date DATETIME,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS production_mining (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mine_name VARCHAR(200) NOT NULL,
    mine_type VARCHAR(100),
    daily_output DECIMAL(15,2),
    total_reserves DECIMAL(15,2),
    status VARCHAR(20),
    location VARCHAR(500),
    description TEXT,
    mining_date DATETIME,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS production_tailings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tailings_name VARCHAR(200) NOT NULL,
    storage_amount DECIMAL(15,2),
    storage_method VARCHAR(100),
    environmental_status VARCHAR(50),
    location VARCHAR(500),
    description TEXT,
    inspection_date DATETIME,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS production_quality_control (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(200) NOT NULL,
    batch_number VARCHAR(100),
    purity DECIMAL(5,2),
    quality_grade VARCHAR(50),
    inspector VARCHAR(100),
    status VARCHAR(20),
    description TEXT,
    inspection_date DATETIME,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建工作流相关表
CREATE TABLE IF NOT EXISTS workflow_approval (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    approval_number VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    applicant VARCHAR(100),
    approver VARCHAR(100),
    status VARCHAR(20),
    process_type VARCHAR(50),
    content TEXT,
    apply_time DATETIME,
    approve_time DATETIME,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workflow_process_definition (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    process_name VARCHAR(200) NOT NULL,
    process_key VARCHAR(100) UNIQUE,
    version VARCHAR(20),
    status VARCHAR(20),
    process_definition TEXT,
    description TEXT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);