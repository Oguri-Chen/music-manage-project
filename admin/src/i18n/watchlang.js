import { watch } from 'vue';
import { userStore } from '@/store';
const store = userStore();

export const watchLang = (...cbs) => {
  watch(
    () => store.getLang,
    () => {
      cbs.forEach((cb) => cb(store.getLang));
    },
    { deep: true }
  );
};
