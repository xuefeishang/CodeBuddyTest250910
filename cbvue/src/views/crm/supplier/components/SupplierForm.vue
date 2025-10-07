<template>
  <el-dialog
    :model-value="modelValue"
    :title="mode === 'create' ? '新增供应商' : '编辑供应商'"
    width="900px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="供应商编码" prop="code">
            <el-input v-model="formData.code" placeholder="请输入供应商编码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入供应商名称" />
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
              <el-option label="潜在供应商" value="potential" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="供应商类型" prop="supplierType">
            <el-select v-model="formData.supplierType" placeholder="请选择供应商类型">
              <el-option label="材料供应商" value="material" />
              <el-option label="设备供应商" value="equipment" />
              <el-option label="服务供应商" value="service" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="资质等级" prop="qualificationLevel">
            <el-select v-model="formData.qualificationLevel" placeholder="请选择资质等级">
              <el-option label="优秀" value="excellent" />
              <el-option label="良好" value="good" />
              <el-option label="合格" value="qualified" />
              <el-option label="不合格" value="unqualified" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="合作年限" prop="cooperationYears">
            <el-input-number v-model="formData.cooperationYears" :min="0" :max="50" placeholder="合作年限" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="付款条件" prop="paymentTerms">
            <el-select v-model="formData.paymentTerms" placeholder="请选择付款条件">
              <el-option label="现金" value="现金" />
              <el-option label="月结30天" value="月结30天" />
              <el-option label="月结60天" value="月结60天" />
              <el-option label="月结90天" value="月结90天" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="交付能力" prop="deliveryCapacity">
            <el-input v-model="formData.deliveryCapacity" placeholder="请输入交付能力" />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-form-item label="主要产品" prop="mainProducts">
        <el-tag
          v-for="(product, index) in formData.mainProducts"
          :key="index"
          closable
          @close="removeProduct(index)"
          style="margin-right: 8px; margin-bottom: 8px;"
        >
          {{ product }}
        </el-tag>
        <el-input
          v-if="inputVisible"
          ref="inputRef"
          v-model="inputValue"
          size="small"
          style="width: 90px;"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <el-button v-else size="small" @click="showInput">+ 添加产品</el-button>
      </el-form-item>
      
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
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useCrmStore } from '@/store/modules/crm'
import type { Supplier } from '@/types/crm'

const props = defineProps<{
  modelValue: boolean
  mode: 'create' | 'edit'
  supplier: Supplier | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  success: []
}>()

const crmStore = useCrmStore()

// 表单引用和数据
const formRef = ref<FormInstance>()
const inputRef = ref()
const inputVisible = ref(false)
const inputValue = ref('')

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
  supplierType: 'material' as const,
  qualificationLevel: 'qualified' as const,
  cooperationYears: 1,
  paymentTerms: '月结30天',
  deliveryCapacity: '',
  mainProducts: [] as string[],
  remark: ''
})

// 表单验证规则
const formRules = {
  code: [{ required: true, message: '请输入供应商编码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
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
  supplierType: [{ required: true, message: '请选择供应商类型', trigger: 'change' }],
  qualificationLevel: [{ required: true, message: '请选择资质等级', trigger: 'change' }],
  paymentTerms: [{ required: true, message: '请选择付款条件', trigger: 'change' }],
  deliveryCapacity: [{ required: true, message: '请输入交付能力', trigger: 'blur' }]
}

// 监听对话框打开，重置表单
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    if (props.mode === 'edit' && props.supplier) {
      Object.assign(formData, {
        ...props.supplier,
        mainProducts: [...props.supplier.mainProducts]
      })
    } else {
      resetForm()
    }
  }
})

// 取消
const handleCancel = () => {
  emit('update:modelValue', false)
  resetForm()
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    if (props.mode === 'create') {
      await crmStore.createSupplier(formData)
      ElMessage.success('新增成功')
    } else {
      await crmStore.updateSupplier(props.supplier!.id, formData)
      ElMessage.success('更新成功')
    }
    
    emit('update:modelValue', false)
    emit('success')
    resetForm()
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
    supplierType: 'material',
    qualificationLevel: 'qualified',
    cooperationYears: 1,
    paymentTerms: '月结30天',
    deliveryCapacity: '',
    mainProducts: [],
    remark: ''
  })
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

// 产品标签相关
const removeProduct = (index: number) => {
  formData.mainProducts.splice(index, 1)
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value && !formData.mainProducts.includes(inputValue.value)) {
    formData.mainProducts.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}
</script>