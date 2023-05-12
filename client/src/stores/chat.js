import { defineStore } from "pinia";
import { reactive, ref, computed } from "vue";
import { socket, state } from "../socket";

export const useChatStore = defineStore("chat-store", () => {
  const peerConnection = reactive(new RTCPeerConnection());
  const localStream = ref(null);
  const remoteStream = ref(null);

  const init = async () => {
    localStream.value = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { min: 1024, ideal: 1280, max: 1920 },
        height: { min: 576, ideal: 720, max: 1080 },
      },
      audio: true,
    });

    remoteStream.value = new MediaStream();

    localStream.value.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream.value);
    });

    peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.value.addTrack(track);
      });
    };

    console.log(localStream.value);
  };

  const createOffer = async (roomId) => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        socket.emit("offer", {
          offer: peerConnection.localDescription,
          roomId,
        });
      }
    };
  };

  const createAnswer = async (roomId, offer) => {
    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        socket.emit("answer", {
          answer: peerConnection.localDescription,
          roomId,
        });
      }
    };
  };

  const addAnswer = async (answer) => {
    if (!peerConnection.currentRemoteDescription) {
      peerConnection.setRemoteDescription(answer);
      state.loading = false;
      state.searching = false;
      state.busy = true;
    }
  };

  const disconnect = async (userId) => {};

  return {
    init,
    localStream,
    remoteStream,
    peerConnection,
    createOffer,
    disconnect,
    createAnswer,
    addAnswer,
  };
});
