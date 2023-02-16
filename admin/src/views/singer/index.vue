<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input :placeholder="$t('table.placeholder')" v-model="queryForm.keyword" clearable></el-input>
      </el-col>
      <el-button type="primary" @click="initSingerList()">
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
        <template v-slot="{ row }" v-if="item.prop === 'singerSex'">
          <svg-icon @click="changeInfo(row)" :icon="row.singerSex ? 'man' : 'woman'"></svg-icon>
        </template>
        <template v-slot="{ row }" v-if="item.prop === 'singerCover'">
          <el-image class="img" :src="row.singerCover"></el-image>
        </template>
        <template #default="{ row }" v-else-if="item.prop === 'action'">
          <el-button type="primary" size="small" @click="handleDialogValue(row)">
            <el-icon>
              <Edit />
            </el-icon>
          </el-button>
          <el-button type="danger" size="small" @click="delSinger(row)">
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
    @initSingerList="initSingerList" />
</template>

<script setup>
import { ref } from 'vue';
import { getSingerList, changeSinger, deleteSinger } from '@/api/singer';
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
const sex = ref(false);
const dialogVisible = ref(false);
const dialogTitle = ref('');
const dialogTableVal = ref({});

const initSingerList = async () => {
  const res = await getSingerList(queryForm.value);
  console.log(res);
  total.value = res.data.totalSize;
  tableData.value = res.data.singerList;
};
initSingerList();
const delSinger = (row) => {
  ElMessageBox.confirm(i18n.t('dialog.deleteTitle'), 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(async () => {
      await deleteSinger({ _id: row._id });
      ElMessage({
        type: 'success',
        message: 'Delete completed',
      });
      initSingerList();
    })
    .catch((err) => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      });
    });
};

const changeInfo = async (info) => {
  info.singerSex = !info.singerSex;
  const opt = {
    _id: info._id,
    singerSex: info.singerSex,
  };
  const res = await changeSinger(opt);
  ElMessage({
    message: i18n.t('message.updeteSuccess'),
    type: 'success',
  });
};

// 更新是否显示对话框
const handleDialogValue = (row) => {
  if (row) {
    dialogTitle.value = '编辑歌手';
    dialogTableVal.value = JSON.parse(JSON.stringify(row));
  } else {
    dialogTitle.value = '添加歌手';
    dialogTableVal.value = {};
  }
  dialogVisible.value = true;
};

const handleSizeChange = (pageSize) => {
  queryForm.value.pageIndex = 1;
  queryForm.value.pageSize = pageSize;
  initSingerList();
};

const handleCurrentChange = (pageIndex) => {
  queryForm.value.pageIndex = pageIndex;
  initSingerList();
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
