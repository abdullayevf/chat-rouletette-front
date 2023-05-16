import { defineStore } from "pinia";
import { reactive, ref, computed } from "vue";
import { socket, state } from "../socket";

export const useChatStore = defineStore("chat-store", () => {
  const peerConnection = ref(null);
  const localStream = ref(null);
  const remoteStream = ref(new MediaStream());
  const messages = reactive([]);
  const roomDetails = reactive({
    id: "",
    connected: false,
    partner: "",
  });

  const init = async () => {
    localStream.value = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { min: 1024, ideal: 1280, max: 1920 },
        height: { min: 576, ideal: 720, max: 1080 },
      },
      audio: true,
    });

    peerConnection.value = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
          ],
        },
      ],
    });

    await localStream.value.getTracks().forEach((track) => {
      peerConnection.value.addTrack(track, localStream.value);
    });

    peerConnection.value.ontrack = (e) => {
      e.streams[0].getTracks().forEach((track) => {
        remoteStream.value.addTrack(track);
      });
    };

    peerConnection.value.onnegotiationneeded = async () => {
      const offer = await peerConnection.value.createOffer();
      await peerConnection.value.setLocalDescription(offer);

      socket.emit("offer", { offer, roomId });
      console.log("offer sent: ", { offer, roomId });
    };

    peerConnection.value.onicecandidate = (iceEvent) => {
      if (iceEvent && iceEvent.candidate) {
        socket.emit('iceCandidate', {candidate: iceEvent.candidate, roomId })
      }
    };
  };

  const createAnswer = async (offer, roomId) => {
    await peerConnection.value.setRemoteDescription(offer);

    let answer = await peerConnection.value.createAnswer();
    await peerConnection.value.setLocalDescription(answer);

    socket.emit("answer", { answer, roomId });
    console.log("Answer sent: ", { answer, roomId });
  };

  const addAnswer = async (answer) => {
    if (!peerConnection.value.currentLocalDescription) {
      peerConnection.value.setRemoteDescription(answer);
    }
  };

  const pushMessage = async (msg) => {
    messages.push(msg);
  };

  const updateRoom = async (key, value) => {
    roomDetails[key] = value;

    return roomDetails;
  };

  const disconnect = async (userId) => {};

  return {
    init,
    localStream,
    remoteStream,
    peerConnection,
    disconnect,
    createAnswer,
    addAnswer,
    messages,
    pushMessage,
    roomDetails,
    updateRoom,
  };
});
