import { defineStore } from "pinia";
import { reactive, ref, computed } from "vue";

export const useChatStore = defineStore("chat-store", () => {
  const peerConnection = ref(null);
  const localStrem = ref(null);
  const remoteStrem = ref(null);

  const init = async () => {
    localStrem.value = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { min: 1024, ideal: 1280, max: 1920 },
        height: { min: 576, ideal: 720, max: 1080 },
      },
      audio: true,
    });
  };

  return {
    init,
    localStrem,
    remoteStrem,
  };
});
