<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input :placeholder="$t('table.placeholder')" v-model="queryForm.keyword" clearable></el-input>
      </el-col>
      <el-button type="primary" @click="initCategoryList()">
        <el-icon>
          <Search />
        </el-icon>
        {{ $t('table.search') }}
      </el-button>
      <el-button type="primary" @click="handleDialogValue()">{{
        $t('table.add')
      }}</el-button>
    </el-row>
    <el-table :data="tableData" stripe class="table">
      <el-table-column v-for="(item, index) in options" :prop="item.prop" :label="$t(`table.${item.label}`)"
        :key="index">
        <template #default="{ row }" v-if="item.prop === 'categoryType'">
          {{ row.categoryType == 0 ? '语种' : '风格' }}
        </template>
        <template #default="{ row }" v-if="item.prop === 'action'">
          <el-button type="primary" size="small" @click="handleDialogValue(row)">
            <el-icon>
              <Edit />
            </el-icon>
          </el-button>
          <el-button type="danger" size="small" @click="delCategory(row)">
            <el-icon>
              <Delete />
            </el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:currentPage="queryForm.pageIndex" :page-sizes="[2, 5, 10, 15]"
      :page-size="queryForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </el-card>
  <Dialog v-model="dialogVisible" :dialogTitle="dialogTitle" v-if="dialogVisible" :dialogTableVal="dialogTableVal"
    @initCategoryList="initCategoryList" />
</template>

<script setup>
import { ref } from 'vue';
import { getCategoryList, deleteCategory } from '@/api/category';
import { options } from './options';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import Dialog from './component/dialog.vue';
const i18n = useI18n();

const queryForm = ref({
  keyword: '',
  pageIndex: 1,
  pageSize: 5,
});
const total = ref(0);
const tableData = ref([]);
const dialogVisible = ref(false);
const dialogTitle = ref('');
const dialogTableVal = ref({});

const initCategoryList = async () => {
  const res = await getCategoryList(queryForm.value);
  total.value = res.data.totalSize;
  tableData.value = Object.freeze(res.data.categoryList);
};
initCategoryList();

const delCategory = (row) => {
  ElMessageBox.confirm(i18n.t('dialog.deleteTitle'), 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(async () => {
      await deleteCategory({ _id: row._id });
      ElMessage({
        type: 'success',
        message: 'Delete completed',
      });
      initCategoryList();
    })
    .catch((err) => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      });
    });
};

// 更新是否显示对话框
const handleDialogValue = (row) => {
  if (row) {
    dialogTitle.value = '编辑分类';
    dialogTableVal.value = JSON.parse(JSON.stringify(row));
  } else {
    dialogTitle.value = '添加分类';
    dialogTableVal.value = {};
  }
  dialogVisible.value = true;
};

const handleSizeChange = (pageSize) => {
  queryForm.value.pageIndex = 1;
  queryForm.value.pageSize = pageSize;
  initCategoryList();
};

const handleCurrentChange = (pageIndex) => {
  queryForm.value.pageIndex = pageIndex;
  initCategoryList();
};
</script>

<style lang="scss" scoped>
.table {
  padding: 16px 0;
  box-sizing: border-box;
}

.el-pagination {
  margin-bottom: 16px;
  float: right;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #ff9800 !important; //修改默认的背景色
}
</style>
