<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input :placeholder="$t('table.placeholder')" v-model="queryForm.keyword" clearable></el-input>
      </el-col>
      <el-button type="primary" @click="initAlbumList()">
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
        <template v-slot="{ row }" v-if="item.prop === 'albumCover'">
          <el-image class="img" :src="row.albumCover"></el-image>
        </template>
        <template v-slot="{ row }" v-if="item.prop === 'singer'">
          <span>{{ row.singer.singerName }}</span>
        </template>
        <template v-slot="{ row }" v-else-if="item.prop === 'createdAt'">{{ moment(row.createdAt).format('YYYY-MM-DD')
          }}
        </template>
        <template #default="{ row }" v-else-if="item.prop === 'action'">
          <el-button type="primary" size="small" @click="handleDialogValue(row)">
            <el-icon>
              <Edit />
            </el-icon>
          </el-button>
          <el-button type="danger" size="small" @click="delAlbum(row)">
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
    @initAlbumList="initAlbumList" />
</template>

<script setup>
import { ref } from 'vue';
import { getAlbumList, deleteAlbum } from '@/api/album';
import { options } from './options';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import Dialog from './component/dialog.vue';
import moment from 'moment';
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

const initAlbumList = async () => {
  const res = await getAlbumList(queryForm.value);
  total.value = res.data.totalSize;
  tableData.value = Object.freeze(res.data.albumList);
};
initAlbumList();

const delAlbum = (row) => {
  ElMessageBox.confirm(i18n.t('dialog.deleteTitle'), 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(async () => {
      await deleteAlbum({ _id: row._id });
      ElMessage({
        type: 'success',
        message: 'Delete completed',
      });
      initAlbumList();
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
    dialogTitle.value = '编辑专辑';
    dialogTableVal.value = JSON.parse(JSON.stringify(row));
  } else {
    dialogTitle.value = '添加专辑';
    dialogTableVal.value = {};
  }
  dialogVisible.value = true;
};

const handleSizeChange = (pageSize) => {
  queryForm.value.pageIndex = 1;
  queryForm.value.pageSize = pageSize;
  initAlbumList();
};

const handleCurrentChange = (pageIndex) => {
  queryForm.value.pageIndex = pageIndex;
  initAlbumList();
};
</script>

<style lang="scss" scoped>
.table {
  padding: 16px 0;
  box-sizing: border-box;
}

.img {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70px;
  width: 70px;
  border-radius: 5px;
  overflow: hidden;
}

.el-pagination {
  margin-bottom: 16px;
  float: right;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #ff9800 !important; //修改默认的背景色
}
</style>
