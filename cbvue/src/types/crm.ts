// CRM相关的类型定义

export interface BaseContact {
  id: string
  name: string
  code: string
  phone: string
  email: string
  address: string
  contactPerson: string
  contactPhone: string
  contactEmail: string
  industry: string
  scale: 'small' | 'medium' | 'large' | 'enterprise'
  status: 'active' | 'inactive' | 'potential'
  remark: string
  createTime: string
  updateTime: string
}

// 客户信息
export interface Customer extends BaseContact {
  customerLevel: 'A' | 'B' | 'C' | 'D'
  creditRating: number
  lastOrderDate?: string
  totalOrderAmount: number
  orderCount: number
}

// 供应商信息
export interface Supplier extends BaseContact {
  supplierType: 'material' | 'equipment' | 'service' | 'other'
  qualificationLevel: 'excellent' | 'good' | 'qualified' | 'unqualified'
  cooperationYears: number
  mainProducts: string[]
  paymentTerms: string
  deliveryCapacity: string
}

// 查询参数
export interface QueryParams {
  page: number
  pageSize: number
  keyword?: string
  status?: string
  industry?: string
  scale?: string
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  [key: string]: any
}

// 分页响应
export interface PageResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 表单数据
export interface CustomerForm extends Omit<Customer, 'id' | 'createTime' | 'updateTime'> {}
export interface SupplierForm extends Omit<Supplier, 'id' | 'createTime' | 'updateTime'> {}