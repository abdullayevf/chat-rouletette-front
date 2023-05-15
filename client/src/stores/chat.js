import { defineStore } from "pinia";
import { reactive, ref, computed } from "vue";
import { socket, state } from "../socket";

export const useChatStore = defineStore("chat-store", () => {
  const peerConnection = reactive(
    new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
          ],
        },
      ],
    })
  );
  const localStream = ref(null);
  const remoteStream = ref(new MediaStream());

  const init = async () => {
    localStream.value = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { min: 1024, ideal: 1280, max: 1920 },
        height: { min: 576, ideal: 720, max: 1080 },
      },
      audio: true,
    });

    await localStream.value.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream.value);
    });

    peerConnection.ontrack = (e) => {
      e.streams[0].getTracks().forEach((track) => {
        remoteStream.value.addTrack(track);
      });
    };
  };

  const createOffer = async (roomId) => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.emit("offer", { offer, roomId });
    console.log("offer sent: ", { offer, roomId });
  };

  const createAnswer = async (offer, roomId) => {
    await peerConnection.setRemoteDescription(offer);

    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.emit("answer", { answer, roomId });
    console.log("Answer sent: ", { answer, roomId });
  };

  const addAnswer = async (answer) => {
    if (!peerConnection.currentLocalDescription) {
      peerConnection.setRemoteDescription(answer);
    }
  };

  const disconnect = async (userId) => {};

  return {
    init,
    localStream,
    remoteStream,
    peerConnection,
    disconnect,
    createOffer,
    createAnswer,
    addAnswer,
  };
});
