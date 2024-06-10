<template>
  <v-card class="dialog-card">
    <v-card-title>
      <div class="action-container">
        <div id="titulo" class="titulo-container ma-2">
          <h1 class="headline">{{ chamado.titulo }}</h1>
        </div>
        <div v-if="chamado.status != 'Fechado'">
          <div v-if="!chamado.id_responsavel && grant()">
            <v-btn color="primary" class="ma-2" @click="atribuirChamado(chamado.id)">Atribuir</v-btn>
          </div>
          <div v-else-if="chamado.id_responsavel && isCurrentUser(chamado.id_responsavel)">
            <v-select
              :items="statusOptions"
              density="compact"
              label="Mudar Status"
              variant="solo-filled"
              v-model="novoStatus"
              @update:modelValue="mudarStatus(chamado.id)"
              class="status-select ma-2"
            ></v-select>
          </div>
        </div>
      </div>
    </v-card-title>
    <v-card-text>
      <v-row>
        <!-- Coluna da Esquerda (75%) -->
        <v-col cols="9">
          <v-card class="pa-4 mb-4" outlined>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  label="Descrição"
                  :model-value="chamado.descricao"
                  readonly
                  class="descricao-textarea"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4"><strong>Status:</strong> {{ chamado.status }}</v-col>
              <v-col cols="4"><strong>Categoria:</strong> {{ chamado.descricao_categoria }}</v-col>
              <v-col cols="4"><strong>Data de Cadastro:</strong> {{ chamado.data_cadastro }}</v-col>
            </v-row>
            <v-row>
              <v-col cols="4"><strong>Data de Atualização:</strong> {{ chamado.data_update }}</v-col>
              <v-col cols="4"><strong>Data de Fechamento:</strong> {{ chamado.data_fechamento }}</v-col>
            </v-row>
          </v-card>
          
          <v-card class="pa-4 mb-4" outlined style="margin-bottom: 16px;">
            <v-card-title class="headline">Anexos</v-card-title>
            <v-card-text class="anexos-container" style="overflow-x: auto;">
              <v-row class="anexos-row" no-gutters>
                <v-col v-for="(anexo, index) in chamado.anexos" :key="index" cols="auto" class="anexo-col">
                  <a :href="anexo" target="_blank" class="anexo-link">
                    <v-card outlined class="anexo-card">
                      <v-img :src="isImage(anexo) ? anexo : defaultImage" contain></v-img>
                    </v-card>
                  </a>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

            <v-card-title class="headline">Chat</v-card-title>
            <Chat class="pa-4 mb-4" style="margin-bottom: 16px;" :chamado_id="chamado.id" />
        </v-col>
        <!-- Coluna da Direita (25%) -->
        <v-col cols="3">
          <v-card class="pa-4 mb-4" outlined>
            <v-card-title class="headline">Usuário</v-card-title>
            <v-card-text>
              <div><strong>Nome:</strong> {{ chamado.usuario }}</div>
              <div><strong>Email:</strong> {{ chamado.email_usuario }}</div>
              <div><strong>Setor:</strong> {{ chamado.setor_usuario }}</div>
            </v-card-text>
          </v-card>
          <v-card class="pa-4 .mb-4" outlined>
            <v-card-title class="headline">Técnico</v-card-title>
            <v-card-text>
              <div><strong>Nome:</strong> {{ chamado.responsavel }}</div>
              <div><strong>Email:</strong> {{ chamado.email_responsavel }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { useAuth } from '@/stores/auth';
import http from '@/services/http.js';

const auth = useAuth();
const bearer = `Bearer ${auth.token}`;
import defaultImage from '@/assets/anexo.png';

export default {
  props: {
    chamado: Object,
  },
  data() {
    return {
      novoStatus: '',
      statusOptions: ['Em andamento', 'Pendente', 'Fechado'],
      defaultImage, // Importa a imagem padrão
    };
  },
  methods: {
    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleString();
    },
    openAttachment(path) {
      window.open(path, '_blank');
    },
    save() {
      // Lógica para salvar as alterações
      this.$emit('fechar-dialog');
    },
    closeDialog() {
      this.$emit('fechar-dialog');
    },
    async atribuirChamado(id) {
      try {
        await http.put(`/atribuirChamado/${id}`, {}, {
          headers: {
            Authorization: bearer
          }
        });
        this.chamado.id_responsavel = auth.user.id;; // Atualiza o responsável no frontend
        this.$emit('fechar-dialog');
      } catch (error) {
        console.error('Erro ao atribuir chamado:', error);
      }
    },
    async mudarStatus(id) {
      console.log(this.novoStatus)
      try {
        await http.put(`/atualizaStatus/${id}`, {
          status: this.novoStatus
        }, {
          headers: {
            Authorization: bearer
          }
        });
        // Atualizar o status no chamado
        this.chamado.status = this.novoStatus;
        this.$emit('atualizar-chamados');
      } catch (error) {
        console.error('Erro ao mudar status do chamado:', error);
      }
    },
    grant() {
      const arrayGrants = ['admin', 'supervisor', 'analista', 'tecnico'];
      return arrayGrants.includes(auth.permission);
    },
    isCurrentUser(responsavel) {
      return responsavel === auth.user.id;
    },
    isImage(file) {
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
      const extension = file.split('.').pop().toLowerCase();
      return imageExtensions.includes(extension);
    }
  }
};
</script>

<style scoped>
.dialog-card {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.pa-4 {
  padding: 16px !important;
}

.mb-4 {
  margin-bottom: 16px !important;
}

.headline {
  font-size: 1.50rem;
  font-weight: 500;
}

.action-container {
  margin-left: 1%;
  margin-right: 1%;
  margin-top: 1%;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-start; /* Alterado para flex-start */
}

.status-select {
  width: 200px;
}

.titulo-container {
  flex-grow: 1; /* Para expandir e ocupar o espaço disponível */
}

.descricao-textarea {
  width: 100%; /* Defina o tamanho desejado */
  min-height: 150px; /* Defina a altura mínima desejada */
  max-height: 400px; /* Defina a altura máxima desejada */
  overflow-y: auto; /* Adiciona uma barra de rolagem vertical quando necessário */
  cursor: default; /* Desativa o cursor para que o campo não seja clicável */
  pointer-events: none; /* Impede que o campo seja clicável */
  background-color: #f9f9f9; /* Cor de fundo para diferenciar o campo de descrição */
  border: 1px solid #ddd; /* Adiciona uma borda para separar o campo */
  padding: 10px; /* Adiciona um espaçamento interno */
}

.anexos-container {
  overflow-x: auto; /* Adiciona uma barra de rolagem horizontal se necessário */
  white-space: nowrap; /* Impede que os anexos quebrem para a próxima linha */
}

.anexo-card {
  width: 150px; /* Define um tamanho padrão para os cards de anexo */
  height: 150px; /* Define uma altura padrão para os cards de anexo */
  margin-right: 10px; /* Adiciona espaçamento entre os anexos */
  display: inline-block; /* Garante que os cards de anexo fiquem na mesma linha */
  vertical-align: top; /* Alinha os cards de anexo ao topo */
  text-align: center; /* Centraliza o conteúdo dentro do card */
  border: 1px solid #ddd; /* Adiciona uma borda ao redor do card */
  border-radius: 8px; /* Adiciona borda arredondada ao card */
  padding: 10px; /* Adiciona um espaçamento interno ao card */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Adiciona sombra ao card */
}

.anexo-icon {
  font-size: 48px; /* Define o tamanho do ícone */
}
</style>
