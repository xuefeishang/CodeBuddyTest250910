<template>
  <div class="customer-management">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>客户管理</h2>
      <p>管理企业客户信息，维护客户关系</p>
    </div>

    <!-- 搜索和操作区域 -->
    <div class="search-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索客户名称、编码、联系人"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="searchForm.status" placeholder="状态" clearable>
            <el-option label="活跃" value="active" />
            <el-option label="非活跃" value="inactive" />
            <el-option label="潜在客户" value="potential" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="searchForm.scale" placeholder="规模" clearable>
            <el-option label="小型" value="small" />
            <el-option label="中型" value="medium" />
            <el-option label="大型" value="large" />
            <el-option label="企业级" value="enterprise" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input v-model="searchForm.industry" placeholder="行业" clearable />
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
          <el-button type="success" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            新增客户
          </el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 内容包装器 -->
    <div class="content-wrapper">
      <!-- 数据表格 -->
      <div class="table-section">
        <el-table
          v-loading="crmStore.customersLoading"
          :data="crmStore.customers"
          stripe
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="code" label="客户编码" min-width="120" show-overflow-tooltip sortable />
          <el-table-column prop="name" label="客户名称" min-width="200" show-overflow-tooltip sortable />
          <el-table-column prop="contactPerson" label="联系人" min-width="120" show-overflow-tooltip sortable />
          <el-table-column prop="contactPhone" label="联系电话" min-width="140" show-overflow-tooltip sortable />
          <el-table-column prop="industry" label="行业" min-width="120" show-overflow-tooltip sortable />
          <el-table-column prop="scale" label="规模" min-width="100" align="center" sortable>
            <template #default="{ row }">
              <el-tag :type="getScaleTagType(row.scale)" size="small">
                {{ getScaleText(row.scale) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="customerLevel" label="客户等级" min-width="110" align="center" sortable>
            <template #default="{ row }">
              <el-tag :type="getLevelTagType(row.customerLevel)" size="small">
                {{ row.customerLevel }}级
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="100" align="center" sortable>
            <template #default="{ row }">
              <el-tag :type="getStatusTagType(row.status)" size="small">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="totalOrderAmount" label="订单总额" min-width="140" align="right" sortable>
            <template #default="{ row }">
              ¥{{ row.totalOrderAmount.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="140" show-overflow-tooltip sortable />
          <el-table-column label="操作" min-width="260" fixed="right" align="center" class-name="operation-column">
            <template #default="{ row }">
              <div class="operation-buttons">
                <el-button type="primary" size="small" @click="handleView(row)" link>
                  <el-icon><View /></el-icon>
                  查看
                </el-button>
                <el-button type="warning" size="small" @click="handleEdit(row)" link>
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
                <el-button type="danger" size="small" @click="handleDelete(row)" link>
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-section">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="crmStore.customersTotal"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 客户详情对话框 -->
    <el-dialog
      v-model="dialogVisible.detail"
      title="客户详情"
      width="800px"
    >
      <el-descriptions v-if="currentCustomer" :column="2" border>
        <el-descriptions-item label="客户编码">{{ currentCustomer.code }}</el-descriptions-item>
        <el-descriptions-item label="客户名称">{{ currentCustomer.name }}</el-descriptions-item>
        <el-descriptions-item label="联系人">{{ currentCustomer.contactPerson }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ currentCustomer.contactPhone }}</el-descriptions-item>
        <el-descriptions-item label="联系邮箱">{{ currentCustomer.contactEmail }}</el-descriptions-item>
        <el-descriptions-item label="公司电话">{{ currentCustomer.phone }}</el-descriptions-item>
        <el-descriptions-item label="公司邮箱">{{ currentCustomer.email }}</el-descriptions-item>
        <el-descriptions-item label="公司地址" :span="2">{{ currentCustomer.address }}</el-descriptions-item>
        <el-descriptions-item label="行业">{{ currentCustomer.industry }}</el-descriptions-item>
        <el-descriptions-item label="规模">{{ getScaleText(currentCustomer.scale) }}</el-descriptions-item>
        <el-descriptions-item label="客户等级">{{ currentCustomer.customerLevel }}级</el-descriptions-item>
        <el-descriptions-item label="信用评级">{{ currentCustomer.creditRating }}分</el-descriptions-item>
        <el-descriptions-item label="订单总额">¥{{ currentCustomer.totalOrderAmount.toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="订单数量">{{ currentCustomer.orderCount }}个</el-descriptions-item>
        <el-descriptions-item label="最后下单">{{ currentCustomer.lastOrderDate || '暂无' }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusTagType(currentCustomer.status)">
            {{ getStatusText(currentCustomer.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentCustomer.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ currentCustomer.updateTime }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ currentCustomer.remark || '无' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 新增/编辑客户对话框 -->
    <el-dialog
      v-model="dialogVisible.form"
      :title="formMode === 'create' ? '新增客户' : '编辑客户'"
      width="800px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户编码" prop="code">
              <el-input v-model="formData.code" placeholder="请输入客户编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入客户名称" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="公司电话" prop="phone">
              <el-input v-model="formData.phone" placeholder="请输入公司电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司邮箱" prop="email">
              <el-input v-model="formData.email" placeholder="请输入公司邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="公司地址" prop="address">
          <el-input v-model="formData.address" placeholder="请输入公司地址" />
        </el-form-item>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系人" prop="contactPerson">
              <el-input v-model="formData.contactPerson" placeholder="请输入联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="formData.contactPhone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="联系邮箱" prop="contactEmail">
          <el-input v-model="formData.contactEmail" placeholder="请输入联系邮箱" />
        </el-form-item>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="行业" prop="industry">
              <el-input v-model="formData.industry" placeholder="请输入行业" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="规模" prop="scale">
              <el-select v-model="formData.scale" placeholder="请选择规模">
                <el-option label="小型" value="small" />
                <el-option label="中型" value="medium" />
                <el-option label="大型" value="large" />
                <el-option label="企业级" value="enterprise" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <el-select v-model="formData.status" placeholder="请选择状态">
                <el-option label="活跃" value="active" />
                <el-option label="非活跃" value="inactive" />
                <el-option label="潜在客户" value="potential" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="客户等级" prop="customerLevel">
              <el-select v-model="formData.customerLevel" placeholder="请选择客户等级">
                <el-option label="A级" value="A" />
                <el-option label="B级" value="B" />
                <el-option label="C级" value="C" />
                <el-option label="D级" value="D" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="信用评级" prop="creditRating">
              <el-input-number v-model="formData.creditRating" :min="0" :max="100" placeholder="信用评级" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单总额" prop="totalOrderAmount">
              <el-input-number v-model="formData.totalOrderAmount" :min="0" placeholder="订单总额" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="订单数量" prop="orderCount">
              <el-input-number v-model="formData.orderCount" :min="0" placeholder="订单数量" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最后下单日期">
              <el-date-picker
                v-model="formData.lastOrderDate"
                type="date"
                placeholder="选择日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="备注">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useCrmStore } from '@/store/modules/crm'
import type { Customer, QueryParams } from '@/types/crm'

const crmStore = useCrmStore()

// 搜索表单
const searchForm = reactive({
  keyword: '',
  status: '',
  scale: '',
  industry: ''
})

// 分页参数
const pagination = reactive({
  page: 1,
  pageSize: 20
})

// 排序参数
const sortParams = reactive({
  prop: '',
  order: ''
})

// 对话框显示状态
const dialogVisible = reactive({
  detail: false,
  form: false
})

// 表单模式
const formMode = ref<'create' | 'edit'>('create')
const currentCustomer = ref<Customer | null>(null)
const selectedCustomers = ref<Customer[]>([])

// 表单引用和数据
const formRef = ref<FormInstance>()
const formData = reactive({
  code: '',
  name: '',
  phone: '',
  email: '',
  address: '',
  contactPerson: '',
  contactPhone: '',
  contactEmail: '',
  industry: '',
  scale: 'medium' as const,
  status: 'active' as const,
  customerLevel: 'C' as const,
  creditRating: 80,
  totalOrderAmount: 0,
  orderCount: 0,
  lastOrderDate: '',
  remark: ''
})

// 表单验证规则
const formRules = {
  code: [{ required: true, message: '请输入客户编码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入公司电话', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入公司邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  contactPerson: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  contactPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  contactEmail: [
    { required: true, message: '请输入联系邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  industry: [{ required: true, message: '请输入行业', trigger: 'blur' }],
  scale: [{ required: true, message: '请选择规模', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  customerLevel: [{ required: true, message: '请选择客户等级', trigger: 'change' }]
}

// 排序改变
const handleSortChange = ({ prop, order }: { prop: string; order: string }) => {
  console.log('排序参数改变:', { prop, order })
  sortParams.prop = prop
  sortParams.order = order
  pagination.page = 1
  fetchData()
}

// 获取数据
const fetchData = async () => {
  const params: QueryParams = {
    page: pagination.page,
    pageSize: pagination.pageSize,
    ...searchForm
  }
  
  // 添加排序参数
  if (sortParams.prop && sortParams.order) {
    params.sortField = sortParams.prop
    params.sortOrder = sortParams.order === 'ascending' ? 'asc' : 'desc'
  }
  
  console.log('请求参数:', params)
  try {
    await crmStore.fetchCustomers(params)
    console.log('获取数据成功:', {
      customers: crmStore.customers.length,
      total: crmStore.customersTotal
    })
  } catch (error) {
    console.error('获取数据失败:', error)
  }
  debugPagination()
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    keyword: '',
    status: '',
    scale: '',
    industry: ''
  })
  pagination.page = 1
  fetchData()
}

// 新增
const handleCreate = () => {
  formMode.value = 'create'
  resetForm()
  dialogVisible.form = true
}

// 查看详情
const handleView = (row: Customer) => {
  currentCustomer.value = row
  dialogVisible.detail = true
}

// 编辑
const handleEdit = (row: Customer) => {
  formMode.value = 'edit'
  currentCustomer.value = row
  Object.assign(formData, row)
  dialogVisible.form = true
}

// 删除
const handleDelete = async (row: Customer) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除客户"${row.name}"吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await crmStore.deleteCustomer(row.id)
    ElMessage.success('删除成功')
    
    // 如果当前页没有数据了，回到上一页
    if (crmStore.customers.length === 0 && pagination.page > 1) {
      pagination.page--
    }
    fetchData()
  } catch (error) {
    // 用户取消删除
  }
}

// 选择改变
const handleSelectionChange = (selection: Customer[]) => {
  selectedCustomers.value = selection
}

// 分页大小改变
const handleSizeChange = (val: number) => {
  console.log('分页大小改变:', val)
  pagination.pageSize = val
  pagination.page = 1
  fetchData()
}

// 当前页改变
const handleCurrentChange = (val: number) => {
  console.log('当前页改变:', val)
  pagination.page = val
  fetchData()
}

// 调试分页信息
const debugPagination = () => {
  console.log('分页信息:', {
    currentPage: pagination.page,
    pageSize: pagination.pageSize,
    total: crmStore.customersTotal,
    customersCount: crmStore.customers.length
  })
}

// 取消
const handleCancel = () => {
  dialogVisible.form = false
  resetForm()
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    if (formMode.value === 'create') {
      await crmStore.createCustomer(formData)
      ElMessage.success('新增成功')
    } else {
      await crmStore.updateCustomer(currentCustomer.value!.id, formData)
      ElMessage.success('更新成功')
    }
    
    dialogVisible.form = false
    resetForm()
    fetchData()
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    code: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    industry: '',
    scale: 'medium',
    status: 'active',
    customerLevel: 'C',
    creditRating: 80,
    totalOrderAmount: 0,
    orderCount: 0,
    lastOrderDate: '',
    remark: ''
  })
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

// 辅助函数
const getStatusTagType = (status: string) => {
  const types: Record<string, string> = {
    active: 'success',
    inactive: 'info',
    potential: 'warning'
  }
  return types[status] || 'info'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    active: '活跃',
    inactive: '非活跃',
    potential: '潜在客户'
  }
  return texts[status] || status
}

const getScaleTagType = (scale: string) => {
  const types: Record<string, string> = {
    small: 'info',
    medium: 'success',
    large: 'warning',
    enterprise: 'danger'
  }
  return types[scale] || 'info'
}

const getScaleText = (scale: string) => {
  const texts: Record<string, string> = {
    small: '小型',
    medium: '中型',
    large: '大型',
    enterprise: '企业级'
  }
  return texts[scale] || scale
}

const getLevelTagType = (level: string) => {
  const types: Record<string, string> = {
    A: 'danger',
    B: 'warning',
    C: 'success',
    D: 'info'
  }
  return types[level] || 'info'
}

// 页面加载时获取数据
onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.customer-management {
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  background: #f5f7fa;
  
  .page-header {
    padding: 20px 20px 0;
    margin-bottom: 20px;
    flex-shrink: 0;
    background: white;
    
    h2 {
      margin: 0 0 8px 0;
      color: #303133;
      font-size: 24px;
      font-weight: 500;
    }
    
    p {
      margin: 0;
      color: #606266;
      font-size: 14px;
    }
  }
  
  .search-section {
    background: #fff;
    padding: 20px;
    margin: 0 20px 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
  }
  
  .content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 0 20px;
    margin-bottom: 20px;
    min-height: 0;
    
    .table-section {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
      
      .el-table {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        min-height: 0;
      }
      
      .el-table__body-wrapper {
        flex: 1;
        overflow-y: auto;
        min-height: 0;
      }
    }
  }
  
  .pagination-section {
    padding: 15px 20px;
    background: white;
    border-top: 1px solid #ebeef5;
    display: flex;
    justify-content: center;
    flex-shrink: 0;
    position: sticky;
    bottom: 0;
    z-index: 10;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.15);
  }
  
  :deep(.operation-column) {
    .cell {
      padding: 8px 0;
    }
  }
  
  .operation-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
    
    .el-button {
      margin: 0;
      padding: 4px 8px;
      font-size: 12px;
      
      .el-icon {
        margin-right: 4px;
      }
      
      &.is-link {
        padding: 4px 8px;
        
        &:hover {
          background-color: var(--el-color-primary-light-9);
          border-radius: 4px;
        }
        
        &.el-button--warning:hover {
          background-color: var(--el-color-warning-light-9);
        }
        
        &.el-button--danger:hover {
          background-color: var(--el-color-danger-light-9);
        }
      }
    }
  }
}

// 响应式适配
@media (max-width: 1200px) {
  .customer-management .operation-buttons {
    flex-direction: column;
    gap: 4px;
    
    .el-button {
      width: 100%;
      justify-content: center;
    }
  }
}

@media (max-width: 768px) {
  .customer-management {
    padding: 10px;
    height: calc(100vh - 20px);
    
    .page-header {
      padding: 15px 0 0;
      margin-bottom: 15px;
      
      h2 {
        font-size: 20px;
      }
      
      p {
        font-size: 13px;
      }
    }
    
    .search-section {
      padding: 15px;
      margin: 0 0 15px;
      
      .el-row {
        margin: 0;
      }
      
      .el-col {
        margin-bottom: 10px;
      }
      
      .el-input,
      .el-select {
        width: 100%;
      }
      
      .el-button {
        width: 100%;
        margin-bottom: 5px;
      }
    }
    
    .content-wrapper {
      padding: 0 5px;
      margin-bottom: 15px;
      
      .table-section {
        overflow-x: auto;
        
        .el-table {
          min-width: 800px;
        }
      }
    }
    
    .pagination-section {
      padding: 10px 5px;
      
      .el-pagination {
        justify-content: center;
        flex-wrap: wrap;
      }
      
      .el-pagination__total,
      .el-pagination__sizes,
      .el-pagination__jump {
        margin-bottom: 5px;
      }
    }
  }
}

@media (max-width: 480px) {
  .customer-management {
    padding: 5px;
    height: calc(100vh - 10px);
    
    .page-header {
      padding: 10px 0 0;
      
      h2 {
        font-size: 18px;
      }
      
      p {
        font-size: 12px;
      }
    }
    
    .search-section {
      padding: 10px;
      
      .el-col {
        margin-bottom: 8px;
      }
      
      .el-button {
        font-size: 12px;
        padding: 8px 15px;
      }
    }
    
    .content-wrapper {
      padding: 0 2px;
      
      .table-section {
        font-size: 12px;
        
        .el-table .el-table__cell {
          padding: 4px 6px;
        }
      }
    }
    
    .operation-buttons {
      .el-button {
        font-size: 11px;
        padding: 3px 6px;
        
        .el-icon {
          margin-right: 2px;
        }
      }
    }
    
    .pagination-section {
      padding: 5px;
      
      .el-pagination__total {
        display: none;
      }
      
      .el-pagination__jump {
        display: none;
      }
    }
  }
}
</style>