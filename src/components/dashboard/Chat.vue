<template>
  <v-card class="chat">
    <div ref="scrollContainer" class="chat-container">
      <div v-for="(message, index) in messages" :key="index" :class="{ 'message-sent': message.author === userName, 'message-received': message.author !== userName }">
        <v-chip class="custom-chip" variant="elevated" color="primary">
          <p class="message-text">{{ message.text }}</p>
        </v-chip>
        <p class="message-author">{{ message.author }}:</p>
        <p class="message-data">{{ formatMessageDate(message.data) }}:</p>
      </div>
    </div>
    <div class="input-container">
      <v-text-field
        v-model="newMessage"
        :append-icon="newMessage ? 'mdi-send' : 'mdi mdi-send'"
        clear-icon="mdi-close-circle"
        label="Message"
        type="text"
        variant="filled"
        clearable
        @click:append="sendMessage"
        @keyup.enter="sendMessage"
        :disabled="!canSendMessage"
      ></v-text-field>
    </div>
  </v-card>
</template>

<script>
import io from 'socket.io-client';
import { useAuth } from '@/stores/auth';
import http from '@/services/http.js';

const auth = useAuth();
const bearer = `Bearer ${auth.token}`;

export default {
  props: {
    chamado_id: Number,
    canSendMessage: Boolean
  },
  data() {
    return {
      messages: [],
      newMessage: '',
      userName: '',
      chatId: null,
      userAppId: null
    };
  },
  methods: {
    formatMessageDate(dateString) {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    },
    sendMessage() {
      if (!this.canSendMessage) return;
      if (this.newMessage.trim() !== '') {
        this.socket.emit('message', {
          text: this.newMessage,
          chatId: this.chatId,
          userAppId: this.userAppId
        });
        this.newMessage = '';
      }
    },
    connectSocket() {
      setTimeout(() => {
        this.socket = io.connect(import.meta.env.VITE_SOCKET_URL);
        this.socket.emit('set_username', this.userName);

        this.socket.on('receive_message', message => {
          console.log('Message received:', message);
          if (message.chatId === this.chatId) {
            this.messages.push(message);
            this.scrollToBottom(); // Scroll to bottom when new message received
            console.log(this.messages);
          }
        });

        // Fetch chat history when connected
        // this.socket.emit('get_chat_history', this.chatId);
      }, 500);
    },
    disconnectSocket() {
      if (this.socket) {
        this.socket.disconnect();
      }
    },
    // Function to fetch chat history
    async fetchChatHistory() {
      try {
        const response = await http.get(`/chat`, {
          headers: {
            Authorization: bearer // Assuming you have the token stored in this.token
          },
          params: {
            page: this.page,
            limit: this.limit,
            chatId: this.chatId
          }
        });

        const messages = response.data.messages
        console.log(messages)
        this.messages = messages.map(message => ({
          text: message.descricao,
          author: message.id_usuario === this.userAppId ? this.userName : message.nome,
          data: message.data_inclusao
        }));

        this.$nextTick(() => {
          this.scrollToBottom();
        });
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    },
    scrollToBottom() {
      const container = this.$refs.scrollContainer;
      console.log(container)
      container.scrollTop = container.scrollHeight;
    },
  },
  mounted() {
    this.userName = useAuth().fullName;
    this.chatId = this.chamado_id;
    this.userAppId = useAuth().user.id;
    this.connectSocket();
    this.fetchChatHistory();
  },
  beforeUnmount() {
    this.disconnectSocket();
  }
};
</script>

<style scoped>
.chat {
  height: 300px;
  overflow-y: auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  padding: 10px;
}

.chat-container {
  height: 70%;
  overflow-y: auto;
  position: relative;
}

.message {
  margin-bottom: 10px;
}

.message-sent {
  text-align: right;
  margin-bottom: 10px;
}

.message-received {
  text-align: left;
  margin-bottom: 10px;
}

.message-author {
  font-size: 12px; /* Define o tamanho da fonte para 12px */
}

.message-data {
  font-size: 10px; /* Define o tamanho da fonte para 12px */
}

.message-text {
  font-size: 14px; /* Define o tamanho da fonte para 14px */
}

.custom-chip {
  border-radius: 10px; /* Define a borda do chip como mais quadrada */
}

.input-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 10px;
}

.input-container input {
  flex: 1;
  margin-right: 10px;
}

.input-container button {
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.input-container button:hover {
  background-color: #0056b3;
}
</style>
