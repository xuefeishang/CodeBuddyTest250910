<template>
  <div class="supplier-management">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>供应商管理</h2>
      <p>管理企业供应商信息，维护供应商关系</p>
    </div>

    <!-- 搜索和操作区域 -->
    <div class="search-section">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索供应商名称、编码、联系人"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-select v-model="searchForm.status" placeholder="状态" clearable>
            <el-option label="活跃" value="active" />
            <el-option label="非活跃" value="inactive" />
            <el-option label="潜在供应商" value="potential" />
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="searchForm.supplierType" placeholder="供应商类型" clearable>
            <el-option label="材料供应商" value="material" />
            <el-option label="设备供应商" value="equipment" />
            <el-option label="服务供应商" value="service" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="searchForm.qualificationLevel" placeholder="资质等级" clearable>
            <el-option label="优秀" value="excellent" />
            <el-option label="良好" value="good" />
            <el-option label="合格" value="qualified" />
            <el-option label="不合格" value="unqualified" />
          </el-select>
        </el-col>
        <el-col :span="10">
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
            新增供应商
          </el-button>
          <el-button type="info" @click="handleExport">
            <el-icon><Download /></el-icon>
            导出数据
          </el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-number">{{ crmStore.suppliersTotal }}</div>
              <div class="stats-label">总供应商数</div>
            </div>
            <el-icon class="stats-icon"><Shop /></el-icon>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-number">{{ activeSuppliers }}</div>
              <div class="stats-label">活跃供应商</div>
            </div>
            <el-icon class="stats-icon active"><UserFilled /></el-icon>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-number">{{ excellentSuppliers }}</div>
              <div class="stats-label">优秀供应商</div>
            </div>
            <el-icon class="stats-icon excellent"><Star /></el-icon>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-number">{{ materialSuppliers }}</div>
              <div class="stats-label">材料供应商</div>
            </div>
            <el-icon class="stats-icon material"><Box /></el-icon>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 数据表格 -->
    <div class="table-section">
      <el-table
        v-loading="crmStore.suppliersLoading"
        :data="crmStore.suppliers"
        stripe
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="code" label="供应商编码" width="120" fixed="left" />
        <el-table-column prop="name" label="供应商名称" min-width="200" fixed="left" />
        <el-table-column prop="contactPerson" label="联系人" width="100" />
        <el-table-column prop="contactPhone" label="联系电话" width="130" />
        <el-table-column prop="supplierType" label="供应商类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getSupplierTypeTagType(row.supplierType)">
              {{ getSupplierTypeText(row.supplierType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="qualificationLevel" label="资质等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getQualificationTagType(row.qualificationLevel)">
              {{ getQualificationText(row.qualificationLevel) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cooperationYears" label="合作年限" width="100">
          <template #default="{ row }">
            {{ row.cooperationYears }}年
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="paymentTerms" label="付款条件" width="100" />
        <el-table-column prop="deliveryCapacity" label="交付能力" width="120" />
        <el-table-column prop="createTime" label="创建时间" width="120" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)">
              <el-icon><View /></el-icon>
              查看
            </el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-section">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="crmStore.suppliersTotal"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 供应商详情对话框 -->
    <SupplierDetail
      v-model="dialogVisible.detail"
      :supplier="currentSupplier"
    />

    <!-- 新增/编辑供应商对话框 -->
    <SupplierForm
      v-model="dialogVisible.form"
      :mode="formMode"
      :supplier="currentSupplier"
      @success="handleFormSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCrmStore } from '@/store/modules/crm'
import type { Supplier, QueryParams } from '@/types/crm'
import SupplierDetail from './components/SupplierDetail.vue'
import SupplierForm from './components/SupplierForm.vue'

const crmStore = useCrmStore()

// 搜索表单
const searchForm = reactive({
  keyword: '',
  status: '',
  supplierType: '',
  qualificationLevel: ''
})

// 分页参数
const pagination = reactive({
  page: 1,
  pageSize: 20
})

// 对话框显示状态
const dialogVisible = reactive({
  detail: false,
  form: false
})

// 表单模式
const formMode = ref<'create' | 'edit'>('create')
const currentSupplier = ref<Supplier | null>(null)
const selectedSuppliers = ref<Supplier[]>([])

// 统计数据
const activeSuppliers = computed(() => 
  crmStore.suppliers.filter(s => s.status === 'active').length
)

const excellentSuppliers = computed(() => 
  crmStore.suppliers.filter(s => s.qualificationLevel === 'excellent').length
)

const materialSuppliers = computed(() => 
  crmStore.suppliers.filter(s => s.supplierType === 'material').length
)

// 获取数据
const fetchData = async () => {
  const params: QueryParams = {
    page: pagination.page,
    pageSize: pagination.pageSize,
    ...searchForm
  }
  await crmStore.fetchSuppliers(params)
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
    supplierType: '',
    qualificationLevel: ''
  })
  pagination.page = 1
  fetchData()
}

// 新增
const handleCreate = () => {
  formMode.value = 'create'
  currentSupplier.value = null
  dialogVisible.form = true
}

// 查看详情
const handleView = (row: Supplier) => {
  currentSupplier.value = row
  dialogVisible.detail = true
}

// 编辑
const handleEdit = (row: Supplier) => {
  formMode.value = 'edit'
  currentSupplier.value = row
  dialogVisible.form = true
}

// 删除
const handleDelete = async (row: Supplier) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除供应商"${row.name}"吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await crmStore.deleteSupplier(row.id)
    ElMessage.success('删除成功')
    
    // 如果当前页没有数据了，回到上一页
    if (crmStore.suppliers.length === 0 && pagination.page > 1) {
      pagination.page--
    }
    fetchData()
  } catch (error) {
    // 用户取消删除
  }
}

// 导出数据
const handleExport = () => {
  ElMessage.info('数据导出功能开发中...')
}

// 选择改变
const handleSelectionChange = (selection: Supplier[]) => {
  selectedSuppliers.value = selection
}

// 分页大小改变
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  pagination.page = 1
  fetchData()
}

// 当前页改变
const handleCurrentChange = (val: number) => {
  pagination.page = val
  fetchData()
}

// 表单成功回调
const handleFormSuccess = () => {
  fetchData()
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
    potential: '潜在供应商'
  }
  return texts[status] || status
}

const getSupplierTypeTagType = (type: string) => {
  const types: Record<string, string> = {
    material: 'success',
    equipment: 'warning',
    service: 'info',
    other: 'primary'
  }
  return types[type] || 'info'
}

const getSupplierTypeText = (type: string) => {
  const texts: Record<string, string> = {
    material: '材料供应商',
    equipment: '设备供应商',
    service: '服务供应商',
    other: '其他'
  }
  return texts[type] || type
}

const getQualificationTagType = (level: string) => {
  const types: Record<string, string> = {
    excellent: 'danger',
    good: 'warning',
    qualified: 'success',
    unqualified: 'info'
  }
  return types[level] || 'info'
}

const getQualificationText = (level: string) => {
  const texts: Record<string, string> = {
    excellent: '优秀',
    good: '良好',
    qualified: '合格',
    unqualified: '不合格'
  }
  return texts[level] || level
}

// 页面加载时获取数据
onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.supplier-management {
  padding: 20px;
  
  .page-header {
    margin-bottom: 20px;
    
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
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }
  
  .stats-section {
    margin-bottom: 20px;
    
    .stats-card {
      position: relative;
      overflow: hidden;
      
      .stats-content {
        .stats-number {
          font-size: 28px;
          font-weight: bold;
          color: #303133;
          margin-bottom: 8px;
        }
        
        .stats-label {
          font-size: 14px;
          color: #606266;
        }
      }
      
      .stats-icon {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 40px;
        opacity: 0.3;
        
        &.active {
          color: #67c23a;
        }
        
        &.excellent {
          color: #f56c6c;
        }
        
        &.material {
          color: #409eff;
        }
      }
    }
  }
  
  .table-section {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .pagination-section {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>