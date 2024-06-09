import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

class WebSocketService {
  constructor() {
    this.stompClient = null;
  }

  connectWebSocket = () => {
    const socket = new SockJS(
      "https://88be-194-44-113-138.ngrok-free.app/maze-websocket",
    );
    this.stompClient = Stomp.over(socket);
    return new Promise((resolve, reject) => {
      this.stompClient.connect(
        {},
        () => {
          resolve();
        },
        (error) => {
          reject(error);
        },
      );
    });
  };

  disconnectWebSocket = () => {
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  };

  subscribeToTopic = (topic, callback) => {
    if (this.stompClient) {
      return this.stompClient.subscribe(topic, callback);
    }
    return null;
  };

  sendMessage(destination, headers, body) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send(destination, headers, body);
    }
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
