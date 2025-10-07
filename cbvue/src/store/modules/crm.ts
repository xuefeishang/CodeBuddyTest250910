import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Customer, Supplier, QueryParams, PageResponse } from '@/types/crm'
import { customerService, supplierService } from '@/services/crm'

export const useCrmStore = defineStore('crm', () => {
  // 客户相关状态
  const customers = ref<Customer[]>([])
  const customersTotal = ref(0)
  const customersLoading = ref(false)
  
  // 供应商相关状态
  const suppliers = ref<Supplier[]>([])
  const suppliersTotal = ref(0)
  const suppliersLoading = ref(false)
  
  // 客户操作
  const fetchCustomers = async (params: QueryParams) => {
    customersLoading.value = true
    try {
      const response = await customerService.getCustomers(params)
      customers.value = response.list
      customersTotal.value = response.total
      return response
    } finally {
      customersLoading.value = false
    }
  }
  
  const createCustomer = async (data: any) => {
    const customer = await customerService.createCustomer(data)
    customers.value.unshift(customer)
    customersTotal.value += 1
    return customer
  }
  
  const updateCustomer = async (id: string, data: any) => {
    const customer = await customerService.updateCustomer(id, data)
    if (customer) {
      const index = customers.value.findIndex(c => c.id === id)
      if (index !== -1) {
        customers.value[index] = customer
      }
    }
    return customer
  }
  
  const deleteCustomer = async (id: string) => {
    const success = await customerService.deleteCustomer(id)
    if (success) {
      const index = customers.value.findIndex(c => c.id === id)
      if (index !== -1) {
        customers.value.splice(index, 1)
        customersTotal.value -= 1
      }
    }
    return success
  }
  
  // 供应商操作
  const fetchSuppliers = async (params: QueryParams) => {
    suppliersLoading.value = true
    try {
      const response = await supplierService.getSuppliers(params)
      suppliers.value = response.list
      suppliersTotal.value = response.total
      return response
    } finally {
      suppliersLoading.value = false
    }
  }
  
  const createSupplier = async (data: any) => {
    const supplier = await supplierService.createSupplier(data)
    suppliers.value.unshift(supplier)
    suppliersTotal.value += 1
    return supplier
  }
  
  const updateSupplier = async (id: string, data: any) => {
    const supplier = await supplierService.updateSupplier(id, data)
    if (supplier) {
      const index = suppliers.value.findIndex(s => s.id === id)
      if (index !== -1) {
        suppliers.value[index] = supplier
      }
    }
    return supplier
  }
  
  const deleteSupplier = async (id: string) => {
    const success = await supplierService.deleteSupplier(id)
    if (success) {
      const index = suppliers.value.findIndex(s => s.id === id)
      if (index !== -1) {
        suppliers.value.splice(index, 1)
        suppliersTotal.value -= 1
      }
    }
    return success
  }
  
  return {
    // 客户状态
    customers,
    customersTotal,
    customersLoading,
    
    // 供应商状态
    suppliers,
    suppliersTotal,
    suppliersLoading,
    
    // 客户方法
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    
    // 供应商方法
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier
  }
})