<template>
  <v-container class="custom-container">
    <h2>Chamados</h2>
    <v-row v-if="dashOrders.length">
      <v-col cols="4">
        <v-card class="ma-2" :color="getStatusColor(dashOrders[0].status)" dark>
          <v-card-text>{{ dashOrders[0].total }} Chamados em Aberto</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="ma-2" :color="getStatusColor(dashOrders[1].status)" dark>
          <v-card-text>{{ dashOrders[1].total }} Chamados em Andamento</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="ma-2" :color="getStatusColor(dashOrders[2].status)" dark>
          <v-card-text>{{ dashOrders[2].total }} Chamados Fechados</v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-dialog v-model="dialog" max-width="750" persistent>
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn class="novo-chamado-button" color="primary" v-bind="activatorProps">Novo Chamado</v-btn>
          </template>
          <NovoChamado :dialog="dialog" @fechar-dialog="fecharDialog"/>
        </v-dialog>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" outlined dense></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="orders"
          :search="search"
          class="elevation-0 no-borders"
        >
          <template v-slot:[`item.status`]="{ item }">
            <v-chip :color="getStatusColor(item.status)" dark>{{ item.status }}</v-chip>
          </template>
          <template v-slot:[`item.action`]="{ item }">
              <v-icon @click="openEditDialog(item)" color="primary">mdi-pencil</v-icon>
            </template>
        </v-data-table>
        <v-dialog v-model="isEditDialogOpen" max-width="600" persistent>
          <Chamado :dialog="isEditDialogOpen" :Chamado="selectedchamado"/>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import NovoChamado from './NovoChamado.vue';
import Chamado from './Chamado.vue';
import http from '@/services/http.js';
import { useAuth } from '@/stores/auth.js';
const auth = useAuth();
const bearer = `Bearer ${auth.token}`;

export default {
  props: {
    loadChamados: {
      type: Function,
      required: true,
    },
    loadDadosDashboard: {
      type: Function,
      required: true,
    },
  },
  components: {
    NovoChamado,
    Chamado
  },
  data() {
    return {
      dialog: false,
      search: '',
      headers: [
        { title: 'ID', key: 'id' },
        { title: 'Título', key: 'titulo' },
        { title: 'Descrição', key: 'descricao' },
        { title: 'Status', key: 'status' },
        { title: 'Data de Cadastro', key: 'data_cadastro' },
        { title: 'Data de Atualização', key: 'data_update' },
        { title: 'Data de Fechamento', key: 'data_fechamento' },
        { title: 'Ação', key: 'action' }
      ],
      orders: [],
      dashOrders: []
    };
  },
  async created() {
    this.orders = await this.loadChamados();
    this.dashOrders = await this.loadDadosDashboard();
  },
  methods: {
    fecharDialog() {
      this.dialog = false;
      this.recarregarChamados();
    },
    async recarregarChamados() {
      this.orders = await this.loadChamados();
    },
    async openEditDialog(item) {
    try {
      // Realize a requisição para obter os dados completos do chamado
      const response = await http.get(`/chamado/${item.id}`, {
        headers: {
          Authorization: bearer
        }
      });

      // Verifique se a requisição foi bem-sucedida
      if (response.data && response.data.result) {
        // Se a requisição for bem-sucedida, abra o diálogo e passe os dados do chamado como parâmetro
        if (this.$refs.chamadoCompleto) {
          this.$refs.chamadoCompleto.carregarChamado(response.data.result);
        } else {
          console.error('Erro: Componente Chamado não montado.');
        }
        this.dialog = true;
      } else {
        // Se a requisição falhar ou não retornar os dados esperados, exiba uma mensagem de erro
        console.error('Erro ao obter os dados do chamado:', response.data.error);
      }
    } catch (error) {
      // Se ocorrer um erro durante a requisição, exiba uma mensagem de erro
      console.error('Erro ao obter os dados do chamado:', error);
    }
  },
    getStatusColor(status) {
      switch (status) {
        case 'Aguardando Feedback': return 'blue';
        case 'Pendente': return 'orange';
        case 'Rejeitado': return 'red';
        case 'Aberto': return 'blue';
        case 'Em andamento': return 'orange';
        case 'Fechado': return 'green';
        default: return 'gray';
      }
    },
  }
};
</script>

<style scoped>
.custom-container {
  border-radius: 13px;
  padding: 16px;
  background-color: #ffffff;
}

.ma-2 {
  margin: 8px !important;
}

.v-data-table {
  margin-top: 16px;
}

.no-borders .v-data-table-header th,
.no-borders .v-data-table tbody tr {
  border: none !important;
}

.no-borders .v-data-table-header {
  border-bottom: none !important;
}

.no-borders .v-data-table-header th {
  border-bottom: none !important;
}
</style>