<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="5">
        <el-input :placeholder="$t('table.placeholder')" v-model="queryForm.keyword" clearable></el-input>
      </el-col>
      <el-col :span="4">
        <el-input :placeholder="$t('table.singer')" v-model="queryForm.singers" clearable></el-input>
      </el-col>
      <el-col :span="4">
        <el-input :placeholder="$t('table.album')" v-model="queryForm.albums" clearable></el-input>
      </el-col>
      <el-col :span="4">
        <el-input :placeholder="$t('table.category')" v-model="queryForm.categories" clearable></el-input>
      </el-col>
      <el-col :span="7">
        <el-button type="primary" @click="initMusicList()">
          <el-icon>
            <Search />
          </el-icon>
          {{ $t('table.search') }}
        </el-button>
        <el-button type="primary" @click="handleDialogValue()">{{
          $t('table.add')
        }}</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" stripe class="table" style="width: 100%">
      <el-table-column v-for="(item, index) in options" :prop="item.prop" :width="item.width"
        :label="$t(`table.${item.label}`)" :key="index">
        <template v-slot="{ row }" v-if="item.prop === 'musicCover'">
          <el-image class="img" :src="row.musicCover"></el-image>
        </template>
        <template v-slot="{ row }" v-if="item.prop === 'singers'">
          <p v-for="s in row.singers" :key="s._id">{{ s.singerName }}</p>
        </template>
        <template v-slot="{ row }" v-if="item.prop === 'albums'">
          <p v-for="s in row.albums" :key="s._id">{{ s.albumName }}</p>
        </template>
        <template v-slot="{ row }" v-if="item.prop === 'categories'">
          <p v-for="s in row.categories" :key="s._id">{{ s.categoryName }}</p>
        </template>
        <template v-slot="{ row }" v-if="item.prop === 'isVipOnly'">
          <el-switch v-model="row.isVipOnly" @change="changeInfo(row)"></el-switch>
        </template>
        <template v-slot="{ row }" v-if="item.prop === 'createdAt'">{{ moment(row.createdAt).format('YYYY-MM-DD') }}
        </template>
        <template #default="{ row }" v-if="item.prop === 'action'">
          <div class="actionBox">
            <el-button type="primary" size="small" @click="handleDialogValue(row)">
              <el-icon>
                <Edit />
              </el-icon>
            </el-button>
            <el-button type="danger" size="small" @click="delMusic(row)">
              <el-icon>
                <Delete />
              </el-icon>
            </el-button>
            <el-button type="success" size="small" v-if="row.musicUrl" @click="audioUrl = row.musicUrl">
              <el-icon>
                <VideoPlay />
              </el-icon>
            </el-button>
            <el-button type="success" size="small" v-if="row.mvs" @click="handleVideoDialog(row)">
              <el-icon>
                <VideoCamera />
              </el-icon>
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer">
      <AudioPlayer class="audioBox" v-show="audioUrl" :audioUrl="audioUrl"></AudioPlayer>
      <el-pagination v-model:currentPage="queryForm.pageIndex" :page-sizes="[2, 5, 10, 15]"
        :page-size="queryForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </el-card>
  <Dialog v-model="dialogVisible" :dialogTitle="dialogTitle" v-if="dialogVisible" :dialogTableVal="dialogTableVal"
    @initMusicList="initMusicList" />
  <videoDialog v-model="videoDialogVisible" :dialogUrl="dialogUrl" v-if="videoDialogVisible" />
</template>

<script setup>
import { ref } from 'vue';
import { getMusicList, changeMusic, deleteMusic } from '@/api/music';
import { options } from './options';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import Dialog from './component/dialog.vue';
import videoDialog from './component/video.vue';
import AudioPlayer from './component/audio.vue';
import moment from 'moment';
const i18n = useI18n();
const queryForm = ref({
  keyword: '',
  pageIndex: 1,
  pageSize: 5,
  categories: null,
  singers: null,
  albums: null,
});
const total = ref(0);
const tableData = ref([]);
const dialogVisible = ref(false);
const dialogTitle = ref('');
const dialogTableVal = ref({});
const videoDialogVisible = ref(false);
const dialogUrl = ref('');
const audioUrl = ref('');

const initMusicList = async () => {
  const res = await getMusicList(queryForm.value);
  total.value = res.data.totalSize;
  tableData.value = res.data.musicList;
};
initMusicList();

const delMusic = (row) => {
  ElMessageBox.confirm(i18n.t('dialog.deleteTitle'), 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(async () => {
      await deleteMusic({ _id: row._id });
      ElMessage({
        type: 'success',
        message: 'Delete completed',
      });
      initMusicList();
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
    dialogTitle.value = '编辑音乐';
    dialogTableVal.value = JSON.parse(JSON.stringify(row));
  } else {
    dialogTitle.value = '添加音乐';
    dialogTableVal.value = {};
  }
  dialogVisible.value = true;
};
const handleVideoDialog = (row) => {
  dialogUrl.value = row.mvs[0].mvUrl;
  videoDialogVisible.value = true;
};

const changeInfo = async (info) => {
  const opt = {
    _id: info._id,
    isVipOnly: info.isVipOnly,
  };
  console.log(opt);
  const res = await changeMusic(opt);
  ElMessage({
    message: i18n.t('message.updeteSuccess'),
    type: 'success',
  });
};

const handleSizeChange = (pageSize) => {
  queryForm.value.pageIndex = 1;
  queryForm.value.pageSize = pageSize;
  initMusicList();
};

const handleCurrentChange = (pageIndex) => {
  queryForm.value.pageIndex = pageIndex;
  initMusicList();
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

.actionBox {
  display: flex;
  flex-wrap: wrap;

  :deep(.el-button) {
    margin: 2px;
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .audioBox {
    flex: 1;
    margin-right: 5rem;
    max-width: 1000px;
    min-width: 150px;
  }
}
</style>
