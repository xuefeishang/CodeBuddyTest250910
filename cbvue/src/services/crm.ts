import type { Customer, Supplier, QueryParams, PageResponse, CustomerForm, SupplierForm } from '@/types/crm'

// 模拟数据存储
let customers: Customer[] = []
let suppliers: Supplier[] = []

// 生成唯一ID
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9)

// 生成50条供应商模拟数据
const generateSupplierData = (): Supplier[] => {
  const supplierTypes = ['material', 'equipment', 'service', 'other'] as const
  const qualificationLevels = ['excellent', 'good', 'qualified', 'unqualified'] as const
  const scales = ['small', 'medium', 'large', 'enterprise'] as const
  const statuses = ['active', 'inactive', 'potential'] as const
  const industries = ['制造业', '建筑业', '信息技术', '金融业', '零售业', '物流业', '能源业', '化工业', '医疗业', '教育业']
  
  const companies = [
    '华夏建材', '龙腾机械', '金石科技', '蓝海物流', '绿源环保',
    '星辰设备', '天成材料', '海润化工', '山河建设', '云峰科技',
    '鑫达机电', '恒通运输', '瑞丰材料', '宏图机械', '盛世科技',
    '东方建材', '西部机械', '南方化工', '北斗科技', '中原物流',
    '华美材料', '金鹏设备', '银河科技', '紫光机械', '红日化工',
    '青山建材', '白云机电', '黄河物流', '长江科技', '珠江材料',
    '泰山机械', '昆仑化工', '天山建材', '秦岭科技', '巴山物流',
    '峨眉机电', '武夷材料', '雁荡设备', '庐山科技', '黄山化工',
    '华山建材', '嵩山机械', '恒山物流', '衡山科技', '终南材料',
    '太行机电', '燕山设备', '吕梁化工', '大别山建材', '六盘山科技'
  ]

  return companies.map((company, index) => ({
    id: generateId(),
    name: company + '有限公司',
    code: `SUP${(index + 1).toString().padStart(4, '0')}`,
    phone: `010-${Math.floor(Math.random() * 90000000 + 10000000)}`,
    email: `info@${company.toLowerCase().replace(/[^\w]/g, '')}.com`,
    address: `北京市朝阳区${company}大厦${Math.floor(Math.random() * 50 + 1)}号`,
    contactPerson: `${['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴'][Math.floor(Math.random() * 10)]}${['伟', '强', '明', '华', '建', '军', '峰', '磊', '勇', '超'][Math.floor(Math.random() * 10)]}`,
    contactPhone: `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
    contactEmail: `contact${index + 1}@${company.toLowerCase().replace(/[^\w]/g, '')}.com`,
    industry: industries[Math.floor(Math.random() * industries.length)],
    scale: scales[Math.floor(Math.random() * scales.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    remark: `${company}是一家专业的${supplierTypes[index % 4] === 'material' ? '材料' : supplierTypes[index % 4] === 'equipment' ? '设备' : supplierTypes[index % 4] === 'service' ? '服务' : '综合'}供应商`,
    createTime: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    updateTime: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    supplierType: supplierTypes[index % 4],
    qualificationLevel: qualificationLevels[Math.floor(Math.random() * qualificationLevels.length)],
    cooperationYears: Math.floor(Math.random() * 10 + 1),
    mainProducts: [
      `产品${Math.floor(Math.random() * 100 + 1)}`,
      `设备${Math.floor(Math.random() * 100 + 1)}`,
      `服务${Math.floor(Math.random() * 100 + 1)}`
    ].slice(0, Math.floor(Math.random() * 3 + 1)),
    paymentTerms: ['现金', '月结30天', '月结60天', '月结90天'][Math.floor(Math.random() * 4)],
    deliveryCapacity: `${Math.floor(Math.random() * 1000 + 100)}件/月`
  }))
}

// 初始化供应商数据
suppliers = generateSupplierData()

// 生成50条客户模拟数据
const generateCustomerData = (): Customer[] => {
  const levels = ['A', 'B', 'C', 'D'] as const
  const scales = ['small', 'medium', 'large', 'enterprise'] as const
  const statuses = ['active', 'inactive', 'potential'] as const
  const industries = ['制造业', '建筑业', '信息技术', '金融业', '零售业', '物流业', '能源业', '化工业', '医疗业', '教育业']
  
  const companies = [
    '华夏集团', '龙腾企业', '金石公司', '蓝海集团', '绿源企业',
    '星辰公司', '天成集团', '海润企业', '山河公司', '云峰集团',
    '鑫达集团', '恒通企业', '瑞丰公司', '宏图集团', '盛世企业',
    '东方公司', '西部集团', '南方企业', '北斗公司', '中原集团',
    '华美企业', '金鹏公司', '银河集团', '紫光企业', '红日公司',
    '青山集团', '白云企业', '黄河公司', '长江集团', '珠江企业',
    '泰山公司', '昆仑集团', '天山企业', '秦岭公司', '巴山集团',
    '峨眉企业', '武夷公司', '雁荡集团', '庐山企业', '黄山公司',
    '华山集团', '嵩山企业', '恒山公司', '衡山集团', '终南企业',
    '太行公司', '燕山集团', '吕梁企业', '大别山公司', '六盘山集团'
  ]

  return companies.map((company, index) => ({
    id: generateId(),
    name: company + '有限公司',
    code: `CUS${(index + 1).toString().padStart(4, '0')}`,
    phone: `021-${Math.floor(Math.random() * 90000000 + 10000000)}`,
    email: `business@${company.toLowerCase().replace(/[^\w]/g, '')}.com`,
    address: `上海市浦东新区${company}大厦${Math.floor(Math.random() * 50 + 1)}号`,
    contactPerson: `${['张', '李', '王', '刘', '陈'][Math.floor(Math.random() * 5)]}总`,
    contactPhone: `139${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
    contactEmail: `manager${index + 1}@${company.toLowerCase().replace(/[^\w]/g, '')}.com`,
    industry: industries[Math.floor(Math.random() * industries.length)],
    scale: scales[Math.floor(Math.random() * scales.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    remark: `${company}是我们的重要客户`,
    createTime: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    updateTime: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    customerLevel: levels[Math.floor(Math.random() * levels.length)],
    creditRating: Math.floor(Math.random() * 100 + 1),
    lastOrderDate: Math.random() > 0.3 ? new Date(Date.now() - Math.floor(Math.random() * 180 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] : undefined,
    totalOrderAmount: Math.floor(Math.random() * 10000000 + 100000),
    orderCount: Math.floor(Math.random() * 50 + 1)
  }))
}

// 初始化客户数据
customers = generateCustomerData()

// 客户服务接口
export const customerService = {
  // 获取客户列表
  async getCustomers(params: QueryParams): Promise<PageResponse<Customer>> {
    await new Promise(resolve => setTimeout(resolve, 100)) // 模拟网络延迟
    
    let filteredCustomers = [...customers]
    
    // 关键词搜索
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase()
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.name.toLowerCase().includes(keyword) ||
        customer.code.toLowerCase().includes(keyword) ||
        customer.contactPerson.toLowerCase().includes(keyword)
      )
    }
    
    // 状态筛选
    if (params.status) {
      filteredCustomers = filteredCustomers.filter(customer => customer.status === params.status)
    }
    
    // 行业筛选
    if (params.industry) {
      filteredCustomers = filteredCustomers.filter(customer => customer.industry === params.industry)
    }
    
    // 规模筛选
    if (params.scale) {
      filteredCustomers = filteredCustomers.filter(customer => customer.scale === params.scale)
    }
    
    // 排序
    if (params.sortField && params.sortOrder) {
      filteredCustomers.sort((a, b) => {
        const aValue = a[params.sortField as keyof Customer]
        const bValue = b[params.sortField as keyof Customer]
        
        if (aValue === bValue) return 0
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return params.sortOrder === 'asc' ? aValue - bValue : bValue - aValue
        }
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return params.sortOrder === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue)
        }
        
        return 0
      })
    }
    
    // 分页
    const start = (params.page - 1) * params.pageSize
    const end = start + params.pageSize
    const list = filteredCustomers.slice(start, end)
    
    return {
      list,
      total: filteredCustomers.length,
      page: params.page,
      pageSize: params.pageSize
    }
  },
  
  // 获取客户详情
  async getCustomer(id: string): Promise<Customer | null> {
    await new Promise(resolve => setTimeout(resolve, 50))
    return customers.find(customer => customer.id === id) || null
  },
  
  // 创建客户
  async createCustomer(data: CustomerForm): Promise<Customer> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const now = new Date().toISOString().split('T')[0]
    const customer: Customer = {
      ...data,
      id: generateId(),
      createTime: now,
      updateTime: now
    }
    customers.unshift(customer)
    return customer
  },
  
  // 更新客户
  async updateCustomer(id: string, data: Partial<CustomerForm>): Promise<Customer | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = customers.findIndex(customer => customer.id === id)
    if (index === -1) return null
    
    customers[index] = {
      ...customers[index],
      ...data,
      updateTime: new Date().toISOString().split('T')[0]
    }
    return customers[index]
  },
  
  // 删除客户
  async deleteCustomer(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100))
    const index = customers.findIndex(customer => customer.id === id)
    if (index === -1) return false
    
    customers.splice(index, 1)
    return true
  }
}

// 供应商服务接口
export const supplierService = {
  // 获取供应商列表
  async getSuppliers(params: QueryParams): Promise<PageResponse<Supplier>> {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    let filteredSuppliers = [...suppliers]
    
    // 关键词搜索
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase()
      filteredSuppliers = filteredSuppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(keyword) ||
        supplier.code.toLowerCase().includes(keyword) ||
        supplier.contactPerson.toLowerCase().includes(keyword)
      )
    }
    
    // 状态筛选
    if (params.status) {
      filteredSuppliers = filteredSuppliers.filter(supplier => supplier.status === params.status)
    }
    
    // 供应商类型筛选
    if (params.supplierType) {
      filteredSuppliers = filteredSuppliers.filter(supplier => supplier.supplierType === params.supplierType)
    }
    
    // 资质等级筛选
    if (params.qualificationLevel) {
      filteredSuppliers = filteredSuppliers.filter(supplier => supplier.qualificationLevel === params.qualificationLevel)
    }
    
    // 分页
    const start = (params.page - 1) * params.pageSize
    const end = start + params.pageSize
    const list = filteredSuppliers.slice(start, end)
    
    return {
      list,
      total: filteredSuppliers.length,
      page: params.page,
      pageSize: params.pageSize
    }
  },
  
  // 获取供应商详情
  async getSupplier(id: string): Promise<Supplier | null> {
    await new Promise(resolve => setTimeout(resolve, 50))
    return suppliers.find(supplier => supplier.id === id) || null
  },
  
  // 创建供应商
  async createSupplier(data: SupplierForm): Promise<Supplier> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const now = new Date().toISOString().split('T')[0]
    const supplier: Supplier = {
      ...data,
      id: generateId(),
      createTime: now,
      updateTime: now
    }
    suppliers.unshift(supplier)
    return supplier
  },
  
  // 更新供应商
  async updateSupplier(id: string, data: Partial<SupplierForm>): Promise<Supplier | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = suppliers.findIndex(supplier => supplier.id === id)
    if (index === -1) return null
    
    suppliers[index] = {
      ...suppliers[index],
      ...data,
      updateTime: new Date().toISOString().split('T')[0]
    }
    return suppliers[index]
  },
  
  // 删除供应商
  async deleteSupplier(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100))
    const index = suppliers.findIndex(supplier => supplier.id === id)
    if (index === -1) return false
    
    suppliers.splice(index, 1)
    return true
  }
}