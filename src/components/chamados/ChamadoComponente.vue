<template>
  <v-container class="custom-container">
    <h2>Chamados</h2>
    <v-row>
      <!-- Cards para os status dos chamados -->
      <v-col cols="4" v-for="(total, status) in dashOrders" :key="status">
        <v-card class="ma-2" :color="getStatusColor(status)" dark>
          <v-card-text>{{ total }} Chamados {{ status }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filtros de data e avançados -->
    <v-row>
      <v-col cols="4">
        <v-text-field
          v-model="dataInicial"
          label="Data Inicial"
          prepend-inner-icon="mdi-calendar"
          type="datetime-local"
          outlined
          dense
        ></v-text-field>
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model="dataFinal"
          label="Data Final"
          prepend-inner-icon="mdi-calendar"
          type="datetime-local"
          outlined
          dense
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-switch
          v-model="showAdvancedFilters"
          label="Filtros Avançados"
          hide-details
          inset
        ></v-switch>
      </v-col>
      <v-col cols="2" class="d-flex justify-end">
        <v-btn class="ma-2" color="primary" @click="filtrar">Filtrar</v-btn>
        <v-btn class="ma-2" color="error" @click="limparFiltro">Limpar Filtro</v-btn>
      </v-col>
    </v-row>

    <!-- Filtros avançados -->
    <v-row v-if="showAdvancedFilters">
      <v-col cols="4">
        <v-autocomplete
            v-model="selectedCategoria"
            label="Categoria"
            :items="categoriaOptions"
            item-title="descricao"
            item-value="id"
            required
        ></v-autocomplete>
      </v-col>
      <v-col cols="4">
        <v-autocomplete
          v-model="selectedStatus"
          label="Status"
          :items=statusOptions
        ></v-autocomplete>
      </v-col>
      <v-col cols="4">
        <v-autocomplete
            v-model="selectedResposavel"
            label="Responsável"
            :items="resposaveis"
            item-title="descricao"
            item-value="id"
            required
        ></v-autocomplete>
      </v-col>
    </v-row>

    <!-- Botão de criar novo chamado -->
    <v-row v-if="permission == 'default'">
      <v-col cols="12">
        <v-dialog v-model="dialogNovoChamado" max-width="750" persistent>
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn class="novo-chamado-button" color="primary" v-bind="activatorProps">Novo Chamado</v-btn>
          </template>
          <NovoChamado :dialog="dialogNovoChamado" @fechar-dialog="fecharDialogNovoChamado"/>
        </v-dialog>
      </v-col>
    </v-row>

    <!-- Tabela de chamados -->
    <v-row>
      <v-col cols="12">
        <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" outlined dense></v-text-field>
        <v-data-table
          :headers="headers"
          :items="orders"
          :search="search"
          class="elevation-0 no-borders"
        >
          <!-- Template para exibir o status como um chip -->
          <template v-slot:[`item.status`]="{ item }">
            <v-chip :color="getStatusColor(item.status)" dark>{{ item.status }}</v-chip>
          </template>
          <!-- Template para a coluna de ação -->
          <template v-slot:[`item.action`]="{ item }">
            <v-icon @click="openEditDialog(item)" color="primary">mdi-eye</v-icon>
          </template>
        </v-data-table>
        <!-- Modal de edição do chamado -->
        <v-dialog v-model="dialogEditChamado" max-width="1200">
          <Chamado :dialog="dialogEditChamado" :chamado="selectedChamado" @atualizar-chamados="recarregarChamados" />
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
import { ref, onMounted } from 'vue';

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
      showAdvancedFilters: false,
      dialogNovoChamado: false,
      dialogEditChamado: false,
      dataInicial: '',
      dataFinal: '',
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
      statusOptions: ['Aberto', 'Pendente', 'Em andamento', 'Fechado', 'Aguardando Feedback', 'Rejeitado'],
      orders: [],
      dashOrders: [],
      resposaveis: [],
      categoriaOptions: [],
      selectedCategoria: [],
      selectedResposavel: null,
      selectedChamado: null,
      selectedStatus: null,
      permission: null
    };
  },
  async created() {
    this.orders = await this.loadChamados();
    this.dashOrders = await this.loadDadosDashboard();
    this.categoriaOptions = await this.loadCategorias();
    this.resposaveis = await this.loadReponsaveis();
    this.permission = auth.permission;
  },
  methods: {
    async filtrar() {
      // Obter os valores dos campos de filtro
      const dataInicial = this.dataInicial;
      const dataFinal = this.dataFinal;
      const selectedCategoria = this.selectedCategoria;
      const selectedStatus = this.selectedStatus;
      const selectedResponsavel = this.selectedResposavel;

      // Enviar uma requisição para buscar os chamados com os filtros aplicados
      try {
        const response = await http.get('chamados', {
          params: {
            dataInicial,
            dataFinal,
            categoria: selectedCategoria,
            status: selectedStatus,
            responsavel: selectedResponsavel
          },
          headers: {
            Authorization: bearer
          }
        });

        if (response.data && response.data.result) {
          // Atualizar os dados da tabela com os chamados recebidos
          this.orders = response.data.result;
        } else {
          console.error('Erro ao buscar os chamados:', response.data.error);
        }
      } catch (error) {
        console.error('Erro ao buscar os chamados:', error);
      }
    },
    async limparFiltro() {
      // Limpar os valores dos campos de filtro
      this.dataInicial = '';
      this.dataFinal = '';
      this.selectedCategoria = [];
      this.selectedStatus = null;
      this.selectedResposavel = null;

      // Realizar uma nova busca para recarregar os dados padrão da tabela
      await this.recarregarChamados();
    },
    fecharDialogNovoChamado() {
      this.dialogNovoChamado = false;
      this.recarregarChamados();
    },
    async recarregarChamados() {
      this.orders = await this.loadChamados();
    },
    async openEditDialog(item) {
      try {
        const response = await http.get(`/chamado/${item.id}`, {
          headers: {
            Authorization: bearer
          }
        });

        if (response.data && response.data.result) {
          this.selectedChamado = response.data.result;
          this.dialogEditChamado = true;
        } else {
          console.error('Erro ao obter os dados do chamado:', response.data.error);
        }
      } catch (error) {
        console.error('Erro ao obter os dados do chamado:', error);
      }
    },
    async loadCategorias() {
      try {
        const response = await http.get('/categorias', {
          headers: {
            Authorization: bearer
          }
        });
        const categoriaOptions = response.data.result.data.map(categoria => ({
          id: categoria.id,
          descricao: categoria.descricao
        }));
        return categoriaOptions;
      } catch(error) {
        console.log(error);
      }
    },
    async loadReponsaveis() {
      try {
        const response = await http.get('/users/responsaveis', {
          headers: {
            Authorization: bearer
          }
        });
        const tecnicos = response.data.result.data.map(resposavel => ({
          id: resposavel.id,
          descricao: `${resposavel.nome} ${resposavel.sobrenome}`
        }));
        console.log(tecnicos)
        return tecnicos
      } catch (error) {
        console.error('Erro ao carregar técnicos:', error);
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


.ma-2 {
  margin: 8px !important;
}

</style>
