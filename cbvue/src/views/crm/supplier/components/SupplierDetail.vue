<template>
  <el-dialog
    :model-value="modelValue"
    title="供应商详情"
    width="900px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <el-descriptions v-if="supplier" :column="2" border>
      <el-descriptions-item label="供应商编码">{{ supplier.code }}</el-descriptions-item>
      <el-descriptions-item label="供应商名称">{{ supplier.name }}</el-descriptions-item>
      <el-descriptions-item label="联系人">{{ supplier.contactPerson }}</el-descriptions-item>
      <el-descriptions-item label="联系电话">{{ supplier.contactPhone }}</el-descriptions-item>
      <el-descriptions-item label="联系邮箱">{{ supplier.contactEmail }}</el-descriptions-item>
      <el-descriptions-item label="公司电话">{{ supplier.phone }}</el-descriptions-item>
      <el-descriptions-item label="公司邮箱">{{ supplier.email }}</el-descriptions-item>
      <el-descriptions-item label="公司地址" :span="2">{{ supplier.address }}</el-descriptions-item>
      <el-descriptions-item label="行业">{{ supplier.industry }}</el-descriptions-item>
      <el-descriptions-item label="规模">{{ getScaleText(supplier.scale) }}</el-descriptions-item>
      <el-descriptions-item label="供应商类型">{{ getSupplierTypeText(supplier.supplierType) }}</el-descriptions-item>
      <el-descriptions-item label="资质等级">{{ getQualificationText(supplier.qualificationLevel) }}</el-descriptions-item>
      <el-descriptions-item label="合作年限">{{ supplier.cooperationYears }}年</el-descriptions-item>
      <el-descriptions-item label="付款条件">{{ supplier.paymentTerms }}</el-descriptions-item>
      <el-descriptions-item label="交付能力">{{ supplier.deliveryCapacity }}</el-descriptions-item>
      <el-descriptions-item label="状态">
        <el-tag :type="getStatusTagType(supplier.status)">
          {{ getStatusText(supplier.status) }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="主要产品" :span="2">
        <el-tag v-for="product in supplier.mainProducts" :key="product" style="margin-right: 8px;">
          {{ product }}
        </el-tag>
        <span v-if="supplier.mainProducts.length === 0">暂无</span>
      </el-descriptions-item>
      <el-descriptions-item label="创建时间">{{ supplier.createTime }}</el-descriptions-item>
      <el-descriptions-item label="更新时间">{{ supplier.updateTime }}</el-descriptions-item>
      <el-descriptions-item label="备注" :span="2">{{ supplier.remark || '无' }}</el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script setup lang="ts">
import type { Supplier } from '@/types/crm'

defineProps<{
  modelValue: boolean
  supplier: Supplier | null
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()

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

const getScaleText = (scale: string) => {
  const texts: Record<string, string> = {
    small: '小型',
    medium: '中型',
    large: '大型',
    enterprise: '企业级'
  }
  return texts[scale] || scale
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

const getQualificationText = (level: string) => {
  const texts: Record<string, string> = {
    excellent: '优秀',
    good: '良好',
    qualified: '合格',
    unqualified: '不合格'
  }
  return texts[level] || level
}
</script>