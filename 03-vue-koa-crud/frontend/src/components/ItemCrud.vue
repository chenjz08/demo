<script setup>
import { ref, onMounted } from 'vue'
import { getItems, createItem, updateItem, deleteItem } from '../api'

// 状态管理
const items = ref([])
const loading = ref(false)
const showModal = ref(false)
const isSubmitting = ref(false)
const currentItem = ref({ id: null, title: '', description: '', status: 'active' })
const isEditing = ref(false)

// 获取数据
const fetchItems = async () => {
  loading.value = true
  try {
    const res = await getItems()
    items.value = res.data.data || []
  } catch (error) {
    console.error('Failed to fetch items:', error)
  } finally {
    loading.value = false
  }
}

// 打开模态框（新增/编辑）
const openModal = (item = null) => {
  if (item) {
    isEditing.value = true
    currentItem.value = { ...item }
  } else {
    isEditing.value = false
    currentItem.value = { id: null, title: '', description: '', status: 'active' }
  }
  showModal.value = true
}

// 关闭模态框
const closeModal = () => {
  showModal.value = false
  currentItem.value = { id: null, title: '', description: '', status: 'active' }
}

// 提交表单
const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    if (isEditing.value) {
      await updateItem(currentItem.value.id, currentItem.value)
    } else {
      await createItem(currentItem.value)
    }
    await fetchItems()
    closeModal()
  } catch (error) {
    console.error('Failed to submit:', error)
  } finally {
    isSubmitting.value = false
  }
}

// 删除记录
const handleDelete = async (id) => {
  if (!confirm('Are you sure you want to delete this item?')) return
  
  try {
    await deleteItem(id)
    await fetchItems()
  } catch (error) {
    console.error('Failed to delete item:', error)
  }
}

onMounted(() => {
  fetchItems()
})
</script>

<template>
  <div class="min-h-screen bg-[var(--color-dark-bg)] text-[var(--color-dark-text)] font-sans py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto">
      
      <!-- 页面头部 -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 class="text-4xl font-extrabold tracking-tight text-white mb-2">
            Project Dashboard
          </h1>
          <p class="text-[var(--color-dark-text-secondary)] text-lg">
            Manage your items beautifully with Vue & TailwindCSS.
          </p>
        </div>
        <button 
          @click="openModal()" 
          class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/30"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add New Item
        </button>
      </div>

      <!-- 数据内容区 -->
      <div class="bg-[var(--color-dark-card)] rounded-2xl border border-[var(--color-dark-border)] shadow-xl overflow-hidden">
        
        <!-- 加载中 -->
        <div v-if="loading" class="p-12 flex justify-center items-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
        </div>

        <!-- 数据网格 (Table卡片风格) -->
        <div v-else-if="items.length > 0" class="overflow-x-auto">
          <table class="w-full whitespace-nowrap">
            <thead>
              <tr class="text-left border-b border-[var(--color-dark-border)] bg-[rgba(255,255,255,0.02)]">
                <th class="px-6 py-5 text-sm font-semibold text-[var(--color-dark-text-secondary)] uppercase tracking-wider">Title</th>
                <th class="px-6 py-5 text-sm font-semibold text-[var(--color-dark-text-secondary)] uppercase tracking-wider">Description</th>
                <th class="px-6 py-5 text-sm font-semibold text-[var(--color-dark-text-secondary)] uppercase tracking-wider">Status</th>
                <th class="px-6 py-5 text-sm font-semibold text-[var(--color-dark-text-secondary)] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--color-dark-border)]">
              <tr v-for="item in items" :key="item.id" class="hover:bg-[rgba(255,255,255,0.02)] transition-colors group">
                <td class="px-6 py-5">
                  <div class="font-medium text-white text-base">{{ item.title }}</div>
                  <div class="text-xs text-[var(--color-dark-text-secondary)] mt-1">ID: {{ item.id }}</div>
                </td>
                <td class="px-6 py-5">
                  <div class="text-sm max-w-[200px] md:max-w-xs truncate" :title="item.description">
                    {{ item.description || 'No description provided' }}
                  </div>
                </td>
                <td class="px-6 py-5">
                  <span 
                    class="inline-flex px-3 py-1 text-xs font-medium rounded-full"
                    :class="item.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'"
                  >
                    {{ item.status === 'active' ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-5 text-right font-medium">
                  <button 
                    @click="openModal(item)" 
                    class="text-indigo-400 hover:text-indigo-300 mx-3 p-2 rounded-lg hover:bg-indigo-400/10 transition-colors"
                    title="Edit"
                  >
                    Edit
                  </button>
                  <button 
                    @click="handleDelete(item.id)" 
                    class="text-rose-400 hover:text-rose-300 p-2 rounded-lg hover:bg-rose-400/10 transition-colors"
                    title="Delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 无数据提示 -->
        <div v-else class="p-16 text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800/50 mb-6">
            <svg class="w-10 h-10 text-[var(--color-dark-text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
          </div>
          <h3 class="text-xl font-medium text-white mb-2">No items found</h3>
          <p class="text-[var(--color-dark-text-secondary)] max-w-sm mx-auto">
            Get started by creating a new item for your project.
          </p>
          <button 
            @click="openModal()" 
            class="mt-8 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors font-medium text-white"
          >
            Create First Item
          </button>
        </div>
      </div>
    </div>

    <!-- 模态框 (Modal) -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        <!-- 背景遮罩 -->
        <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" @click="closeModal" aria-hidden="true"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <!-- 模态框内容 -->
        <div class="relative z-10 inline-block align-bottom bg-[var(--color-dark-bg)] rounded-2xl text-left overflow-hidden shadow-2xl border border-[var(--color-dark-border)] transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <div class="px-6 pt-6 pb-4 sm:p-8">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-2xl leading-6 font-bold text-white mb-8" id="modal-title">
                  {{ isEditing ? 'Edit Item' : 'Create New Item' }}
                </h3>
                
                <form @submit.prevent="handleSubmit" class="space-y-6">
                  <!-- 标题输入 -->
                  <div>
                    <label for="title" class="block text-sm font-medium text-[var(--color-dark-text-secondary)] mb-2">Title <span class="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      id="title" 
                      v-model="currentItem.title" 
                      required
                      placeholder="Enter a descriptive title"
                      class="block w-full px-4 py-3 bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-xl text-white placeholder-[var(--color-dark-text-secondary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all sm:text-sm"
                    >
                  </div>

                  <!-- 描述输入 -->
                  <div>
                    <label for="description" class="block text-sm font-medium text-[var(--color-dark-text-secondary)] mb-2">Description</label>
                    <textarea 
                      id="description" 
                      v-model="currentItem.description" 
                      rows="4" 
                      placeholder="Provide some details..."
                      class="block w-full px-4 py-3 bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-xl text-white placeholder-[var(--color-dark-text-secondary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all sm:text-sm resize-none"
                    ></textarea>
                  </div>

                  <!-- 状态选择 -->
                  <div>
                    <label for="status" class="block text-sm font-medium text-[var(--color-dark-text-secondary)] mb-2">Status</label>
                    <select 
                      id="status" 
                      v-model="currentItem.status" 
                      class="block w-full px-4 py-3 bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-xl text-white focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all sm:text-sm appearance-none"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <!-- 按钮组 -->
                  <div class="mt-8 pt-6 border-t border-[var(--color-dark-border)] flex flex-col sm:flex-row-reverse gap-3">
                    <button 
                      type="submit" 
                      :disabled="isSubmitting"
                      class="w-full inline-flex justify-center rounded-xl border border-transparent px-6 py-3 bg-[var(--color-primary)] text-base font-medium text-white hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] focus:ring-offset-[var(--color-dark-bg)] sm:w-auto sm:text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span v-if="isSubmitting" class="mr-2">...</span>
                      {{ isEditing ? 'Save Changes' : 'Create Item' }}
                    </button>
                    <button 
                      type="button" 
                      @click="closeModal" 
                      class="w-full inline-flex justify-center rounded-xl border border-[var(--color-dark-border)] px-6 py-3 bg-transparent text-base font-medium text-[var(--color-dark-text-secondary)] hover:bg-white/5 hover:text-white focus:outline-none sm:w-auto sm:text-sm transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
