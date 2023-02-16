<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input
          :placeholder="$t('table.placeholder')"
          v-model="queryForm.keyword"
          clearable
        ></el-input>
      </el-col>
      <el-button type="primary" @click="initMVList()">
        <el-icon><Search /></el-icon>
        {{ $t('table.search') }}
      </el-button>
      <el-button type="primary" @click="handleDialogValue()">{{
        $t('table.add')
      }}</el-button>
    </el-row>
    <el-table :data="tableData" stripe class="table">
      <el-table-column
        v-for="(item, index) in options"
        :prop="item.prop"
        :label="$t(`table.${item.label}`)"
        :key="index"
      >
        <template v-slot="{ row }" v-if="item.prop === 'mvUrl'">
          <div @click="handleVideoDialog(row)">
            <el-icon size="30"><VideoPlay /></el-icon>
          </div>
        </template>
        <template v-slot="{ row }" v-if="item.prop === 'isVipOnly'">
          <el-switch
            v-model="row.isVipOnly"
            @click="changeInfo(row)"
          ></el-switch>
        </template>
        <template v-slot="{ row }" v-if="item.prop === 'mvCover'">
          <el-image class="img" :src="row.mvCover"></el-image>
        </template>
        <template v-slot="{ row }" v-if="item.prop === 'singer'">
          <span>{{ row.singer.singerName }}</span>
        </template>
        <template #default="{ row }" v-else-if="item.prop === 'action'">
          <el-button
            type="primary"
            size="small"
            @click="handleDialogValue(row)"
          >
            <el-icon><Edit /></el-icon>
          </el-button>
          <el-button type="danger" size="small" @click="delmv(row)">
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:currentPage="queryForm.pageIndex"
      :page-sizes="[2, 5, 10, 15]"
      :page-size="queryForm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
  <Dialog
    v-model="dialogVisible"
    :dialogTitle="dialogTitle"
    v-if="dialogVisible"
    :dialogTableVal="dialogTableVal"
    @initMVList="initMVList"
  />
  <videoDialog
    v-model="videoDialogVisible"
    :dialogUrl="dialogUrl"
    v-if="videoDialogVisible"
  />
</template>

<script setup>
import { ref } from 'vue';
import { getMVList, changeMV, deleteMV } from '@/api/mv';
import { options } from './options';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import Dialog from './component/dialog.vue';
import videoDialog from './component/video.vue';
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
const videoDialogVisible = ref(false);
const dialogUrl = ref('');

const initMVList = async () => {
  const res = await getMVList(queryForm.value);
  console.log(res);
  total.value = res.data.totalSize;
  tableData.value = res.data.mvList;
};
initMVList();

const delmv = (row) => {
  ElMessageBox.confirm(i18n.t('dialog.deleteTitle'), 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(async () => {
      await deleteMV({ _id: row._id });
      ElMessage({
        type: 'success',
        message: 'Delete completed',
      });
      initmvList();
    })
    .catch((err) => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      });
    });
};

const changeInfo = async (info) => {
  const opt = {
    _id: info._id,
    isVipOnly: info.isVipOnly,
  };
  const res = await changeMV(opt);
  ElMessage({
    message: i18n.t('message.updeteSuccess'),
    type: 'success',
  });
};

// 更新是否显示对话框
const handleDialogValue = (row) => {
  if (row) {
    dialogTitle.value = '编辑MV';
    dialogTableVal.value = JSON.parse(JSON.stringify(row));
  } else {
    dialogTitle.value = '添加MV';
    dialogTableVal.value = {};
  }
  dialogVisible.value = true;
};
const handleVideoDialog = (row) => {
  dialogUrl.value = row.mvUrl;
  videoDialogVisible.value = true;
};

const handleSizeChange = (pageSize) => {
  queryForm.value.pageIndex = 1;
  queryForm.value.pageSize = pageSize;
  initMVList();
};

const handleCurrentChange = (pageIndex) => {
  queryForm.value.pageIndex = pageIndex;
  initMVList();
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
