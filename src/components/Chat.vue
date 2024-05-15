<template>
  <div class="chat">
    <div class="chat-container">
      <div v-for="(message, index) in messages" :key="index" :class="{ 'message-sent': message.author === userName, 'message-received': message.author !== userName }">
        <p>{{ message.author }}:</p>
        <v-chip variant="elevated" color="primary"> <p>{{ message.text }}</p> </v-chip>
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
      ></v-text-field>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import { useAuth } from '@/stores/auth';

export default {
  props: {
    chamado_id: Number // Defina corretamente a propriedade do ID do chamado
  },
  data() {
    return {
      messages: [],
      newMessage: '',
      userName: '',
      chatId: null // Defina inicialmente como null
    };
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim() !== '') {
        this.socket.emit('message', {
          text: this.newMessage,
          chatId: this.chatId
        });
        this.newMessage = '';
      }
    },
    connectSocket() {
      setTimeout(() => {
        this.socket = io.connect('http://localhost:3000');
        this.socket.emit('set_username', this.userName);

        this.socket.on('receive_message', message => {
          if (message.chatId === this.chatId) {
            this.messages.push(message);
          }
        });
      }, 500);
    },
    disconnectSocket() {
      if (this.socket) {
        this.socket.disconnect();
      }
    }
  },
  mounted() {
    this.userName = useAuth().fullName;
    this.chatId = this.chamado_id; // Use o ID do chamado passado como prop
    this.connectSocket();
  },
  beforeUnmount() {
    this.disconnectSocket();
  }
};
</script>
  
  
  <style scoped>
  .chat {
    height: 300px; /* Altura do contêiner do chat, ajuste conforme necessário */
    overflow-y: auto; /* Adiciona scroll quando necessário */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Adiciona sombra */
    position: relative; /* Define o posicionamento relativo para que o posicionamento absoluto funcione dentro dele */
    padding: 10px;
  }
  
  .chat-container {
    height: 70%; /* Altura do contêiner do chat, ajuste conforme necessário */
    overflow-y: auto; /* Adiciona scroll quando necessário */
    position: relative; /* Define o posicionamento relativo para que o posicionamento absoluto funcione dentro dele */
  }
  
  .message{
    margin-bottom: 10px;
  }
  
  .message-sent {
  text-align: right;
}

.message-received {
  text-align: left;
}
  
  .input-container {
    position: absolute; /* Define o posicionamento absoluto */
    bottom: 0; /* Fixa o container na parte inferior */
    left: 0; /* Alinha o container à esquerda */
    width: 100%; /* Garante que o container ocupe toda a largura do contêiner do chat */
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
  