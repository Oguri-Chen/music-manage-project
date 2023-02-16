<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input :placeholder="$t('table.placeholder')" v-model="queryForm.keyword" clearable></el-input>
      </el-col>
      <el-button type="primary" @click="initUserList()">
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
        <template v-slot="{ row }" v-if="item.prop === 'avatar'">
          <el-image class="img" :src="row.avatar"></el-image>
        </template>
        <template v-slot="{ row }" v-if="item.prop === 'level'">
          <el-switch :active-value="1" :inactive-value="0" v-model="row.level" @change="changeInfo(row)"></el-switch>
        </template>
        <template v-slot="{ row }" v-if="item.prop === 'createdAt'">{{ moment(row.createdAt).format('YYYY-MM-DD') }}
        </template>
        <template #default="{ row }" v-if="item.prop === 'action'">
          <el-button type="primary" size="small" @click="handleDialogValue(row)">
            <el-icon>
              <Edit />
            </el-icon>
          </el-button>
          <el-button type="danger" size="small" @click="delUser(row)">
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
    @initUserList="initUserList" />
</template>

<script setup>
import { ref } from 'vue';
import { getUserList, changeUserInfoAdmin, deleteUser } from '@/api/user';
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

const initUserList = async () => {
  const res = await getUserList(queryForm.value);
  total.value = res.data.totalSize;
  tableData.value = res.data.userList
};
initUserList();

const delUser = (row) => {
  ElMessageBox.confirm(i18n.t('dialog.deleteTitle'), 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(async () => {
      await deleteUser({ _id: row._id });
      ElMessage({
        type: 'success',
        message: 'Delete completed',
      });
      initUserList();
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
    dialogTitle.value = '编辑用户';
    dialogTableVal.value = JSON.parse(JSON.stringify(row));
  } else {
    dialogTitle.value = '添加用户';
    dialogTableVal.value = {};
  }
  dialogVisible.value = true;
};

const changeInfo = async (info) => {
  const opt = {
    _id: info._id,
    level: info.level,
  };
  const res = await changeUserInfoAdmin(opt);
  ElMessage({
    message: i18n.t('message.updeteSuccess'),
    type: 'success',
  });
};

const handleSizeChange = (pageSize) => {
  queryForm.value.pageIndex = 1;
  queryForm.value.pageSize = pageSize;
  initUserList();
};

const handleCurrentChange = (pageIndex) => {
  queryForm.value.pageIndex = pageIndex;
  initUserList();
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
</style>
