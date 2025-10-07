-- 华夏建龙企业级应用系统数据初始化脚本

-- 初始化系统菜单数据
INSERT IGNORE INTO sys_menu (id, name, path, component, icon, sort, type, parent_id) VALUES
(1, '系统管理', '/system', NULL, 'Setting', 1, 'DIRECTORY', NULL),
(2, '用户管理', '/system/user', 'UserManagement', 'User', 1, 'MENU', 1),
(3, '角色管理', '/system/role', 'RoleManagement', 'UserFilled', 2, 'MENU', 1),
(4, '菜单管理', '/system/menu', 'MenuManagement', 'Menu', 3, 'MENU', 1),

(5, '客户关系管理', '/crm', NULL, 'Service', 2, 'DIRECTORY', NULL),
(6, '客户管理', '/crm/customer', 'CustomerManagement', 'Notebook', 1, 'MENU', 5),
(7, '供应商管理', '/crm/supplier', 'SupplierManagement', 'Shop', 2, 'MENU', 5),
(8, '商机管理', '/crm/opportunity', 'OpportunityManagement', 'Opportunity', 3, 'MENU', 5),
(9, '合同管理', '/crm/contract', 'ContractManagement', 'Document', 4, 'MENU', 5),

(10, '项目管理', '/project', NULL, 'Briefcase', 3, 'DIRECTORY', NULL),
(11, '项目列表', '/project/list', 'ProjectList', 'List', 1, 'MENU', 10),
(12, '任务管理', '/project/task', 'TaskManagement', 'Tickets', 2, 'MENU', 10),

(13, '生产管理', '/production', NULL, 'Operation', 4, 'DIRECTORY', NULL),
(14, '选矿管理', '/production/mineral-processing', 'MineralProcessing', 'Finished', 1, 'MENU', 13),
(15, '采矿管理', '/production/mining', 'Mining', 'SetUp', 2, 'MENU', 13),
(16, '尾矿管理', '/production/tailings', 'Tailings', 'SetUp', 3, 'MENU', 13),
(17, '质检管理', '/production/quality-control', 'QualityControl', 'SetUp', 4, 'MENU', 13),

(18, '流程审批', '/workflow', NULL, 'Operation', 5, 'DIRECTORY', NULL),
(19, '审批中心', '/workflow/approval', 'ApprovalCenter', 'Finished', 1, 'MENU', 18),
(20, '流程设计', '/workflow/design', 'ProcessDesign', 'SetUp', 2, 'MENU', 18);

-- 初始化系统角色数据
INSERT IGNORE INTO sys_role (id, role_code, role_name, description) VALUES
(1, 'ADMIN', '系统管理员', '拥有系统所有权限'),
(2, 'USER', '普通用户', '拥有基本业务操作权限'),
(3, 'MANAGER', '部门经理', '拥有部门管理权限');

-- 初始化管理员用户 (密码: admin123)
INSERT IGNORE INTO sys_user (id, username, password, real_name, avatar, email, phone, status) VALUES
(1, 'admin', '$2a$10$8Yz5J9Z7h6K4L3M2N1O0P.QwErTyUiOpAsDfGhJkLzXcVbNmMjKlW', '系统管理员', NULL, 'admin@hxjl.com', '13800138000', 'ACTIVE');

-- 分配管理员角色
INSERT IGNORE INTO sys_user_role (user_id, role_id) VALUES (1, 1);

-- 为管理员角色分配所有菜单权限
INSERT IGNORE INTO sys_role_menu (role_id, menu_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4),
(1, 5), (1, 6), (1, 7), (1, 8), (1, 9),
(1, 10), (1, 11), (1, 12),
(1, 13), (1, 14), (1, 15), (1, 16), (1, 17),
(1, 18), (1, 19), (1, 20);

-- 为普通用户角色分配基本菜单权限
INSERT IGNORE INTO sys_role_menu (role_id, menu_id) VALUES
(2, 5), (2, 6), (2, 7), (2, 8), (2, 9),
(2, 10), (2, 11), (2, 12),
(2, 13), (2, 14), (2, 15), (2, 16), (2, 17),
(2, 18), (2, 19);

-- 初始化示例客户数据
INSERT IGNORE INTO crm_customer (id, name, code, type, industry, contact_person, phone, email, status, level) VALUES
(1, '华夏矿业集团', 'CUST001', '企业客户', '矿业', '张经理', '13900139000', 'zhang@huaxia.com', 'ACTIVE', 'VIP'),
(2, '北方钢铁有限公司', 'CUST002', '企业客户', '钢铁', '李总监', '13700137000', 'li@beifang.com', 'ACTIVE', '重要');

-- 初始化示例供应商数据
INSERT IGNORE INTO crm_supplier (id, name, code, type, industry, contact_person, phone, email, status, qualification) VALUES
(1, '华东设备制造', 'SUPP001', '设备供应商', '设备制造', '王经理', '13600136000', 'wang@huadong.com', 'ACTIVE', '一级'),
(2, '南方化工原料', 'SUPP002', '原料供应商', '化工', '赵主管', '13500135000', 'zhao@nanfang.com', 'ACTIVE', '二级');

-- 初始化示例项目数据
INSERT IGNORE INTO project (id, name, code, type, status, priority, description) VALUES
(1, '新矿区开发项目', 'PROJ001', '开发项目', '进行中', '高', '新矿区勘探和开发项目'),
(2, '设备升级改造', 'PROJ002', '改造项目', '规划中', '中', '生产设备升级改造项目');

-- 初始化示例生产数据
INSERT IGNORE INTO production_mineral_processing (id, process_name, ore_type, input_amount, output_amount, recovery_rate, status, operator) VALUES
(1, '铜矿选矿流程', '铜矿', 1000.00, 850.00, 85.00, '正常', '张三');

INSERT IGNORE INTO production_mining (id, mine_name, mine_type, daily_output, total_reserves, status, location) VALUES
(1, '西山矿区', '露天矿', 5000.00, 5000000.00, '生产中', '山西省');

-- 初始化示例审批流程数据
INSERT IGNORE INTO workflow_approval (id, approval_number, title, applicant, status, process_type, content) VALUES
(1, 'APP2024001', '设备采购审批', '李四', '待审批', '采购审批', '采购新型选矿设备');

INSERT IGNORE INTO workflow_process_definition (id, process_name, process_key, version, status, description) VALUES
(1, '采购审批流程', 'PURCHASE_APPROVAL', '1.0', '启用', '标准采购审批流程');