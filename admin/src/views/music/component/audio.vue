<template>
  <div>
    <audio
      ref="audio"
      :src="props.audioUrl"
      preload
      @pause="onPause"
      @play="onPlay"
      @timeupdate="onTimeupdate"
      @loadedmetadata="onLoadedmetadata"
    ></audio>
    <div class="audio-com-box">
      <el-icon size="30" @click="audioState">
        <VideoPlay v-if="!audioData.playing" />
        <VideoPause v-else />
      </el-icon>
      <div class="progress-box">
        <el-slider
          class="slider"
          v-model="sliderTime"
          :show-tooltip="false"
          @change="changeCurrentTime"
        ></el-slider>
        <span class="current-time">{{
          currentTime(audioData.currentTime)
        }}</span>
        <span class="total-time">{{ currentTime(audioData.maxTime) }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps, reactive, ref, computed } from 'vue';
import moment from 'moment';

const props = defineProps({
  audioUrl: {
    type: String,
    default: '',
    required: true,
  },
});

const audio = ref(null);
const audioData = reactive({
  playing: false,
  currentTime: 0,
  maxTime: 0,
});
const sliderTime = ref(0);
const currentTime = (num) => {
  let min = Math.floor(num / 60);
  let sec = Math.floor(num - min * 60);
  return `${min}:${sec}`;
};

const audioState = () => {
  return audioData.playing ? pause() : play();
};
const play = () => {
  audio.value.play();
};
const pause = () => {
  audio.value.pause();
};
const onPlay = () => {
  audioData.playing = true;
};
const onPause = () => {
  audioData.playing = false;
};

const onLoadedmetadata = (e) => {
  audioData.maxTime = parseInt(e.target.duration);
};
const onTimeupdate = (e) => {
  audioData.currentTime = e.target.currentTime;
  sliderTime.value = parseInt(
    (audioData.currentTime / audioData.maxTime) * 100
  );
};
const changeCurrentTime = (val) => {
  const currentTime = (val / 100) * audioData.maxTime;
  audio.value.currentTime = currentTime;
};
</script>
<style lang="scss" scoped>
audio {
  display: none;
}

.audio-com-box {
  border-radius: 10px;
  //   padding: 15px 25px;
  display: flex;
  align-items: center;
  /*音频图标*/
  .progress-box {
    flex: 1;
    margin-left: 15px;
    position: relative;
    :deep(.el-slider) {
      height: 18px;
    }
    :deep(.el-slider__bar) {
      height: 5px;
      background-color: #5ca3f5;
    }
    :deep(.el-slider__button) {
      width: 12px;
      height: 12px;
    }
    :deep(.el-slider__runway) {
      height: 5px;
    }
    .current-time,
    .total-time {
      color: #aaaaaa;
    }
    .current-time {
      float: left;
    }
    .total-time {
      float: right;
    }
  }
}
</style>
