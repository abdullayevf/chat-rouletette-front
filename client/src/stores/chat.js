import { defineStore } from "pinia";
import { reactive, ref, computed } from "vue";

export const useChatStore = defineStore("chat-store", () => {
  const peerConnection = ref(null);
  const localStrem = ref(null);
  const remoteStrem = ref(null);

  const init = async () => {
    localStrem.value = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 4096 }, height: { ideal: 2160 } },
      audio: true,
    });
  };

  return {
    init,
    localStrem,
    remoteStrem,
  };
});
