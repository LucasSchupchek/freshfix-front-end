<template>
  <v-main>
    <v-container>
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
              :items="statusOptions"
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

        <v-row v-if="permission == 'default'">
          <v-col cols="12">
            <v-dialog v-model="dialogNovoChamado" max-width="750" persistent>
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn class="novo-chamado-button" color="primary" v-bind="activatorProps">Novo Chamado</v-btn>
              </template>
              <NovoChamado :dialog="dialogNovoChamado" @fechar-dialog="fecharDialog" />
            </v-dialog>
          </v-col>
        </v-row>

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
    </v-container>
  </v-main>
</template>

<script>
import { ref, onMounted } from 'vue';
import NovoChamado from '../components/chamados/NovoChamado.vue';
import Chamado from '../components/chamados/Chamado.vue';
import http from '@/services/http.js';
import { useAuth } from '@/stores/auth.js';

export default {
  components: {
    NovoChamado,
    Chamado,
  },
  setup() {
    const auth = useAuth();
    const bearer = `Bearer ${auth.token}`;
    const permission = auth.permission;
    const userId = auth.user.id;

    const orders = ref([]);
    const dashOrders = ref([]);
    const resposaveis = ref([]);
    const categoriaOptions = ref([]);
    const dataInicial = ref('');
    const dataFinal = ref('');
    const search = ref('');
    const showAdvancedFilters = ref(false);
    const selectedCategoria = ref(null);
    const selectedStatus = ref(null);
    const selectedResposavel = ref(null);
    const selectedChamado = ref(null);
    const dialogNovoChamado = ref(false);
    const dialogEditChamado = ref(false);
    const headers = ref([
      { title: 'ID', key: 'id' },
      { title: 'Título', key: 'titulo' },
      { title: 'Descrição', key: 'descricao' },
      { title: 'Status', key: 'status' },
      { title: 'Data de Cadastro', key: 'data_cadastro' },
      { title: 'Data de Atualização', key: 'data_update' },
      { title: 'Data de Fechamento', key: 'data_fechamento' },
      { title: 'Responsável', key: 'responsavel' },
      { title: 'Ação', key: 'action' }
    ]);
    const statusOptions = ref(['Aberto', 'Pendente', 'Em andamento', 'Fechado', 'Rejeitado']);
    const loading = ref(false);

    const loadChamados = async () => {
      if (loading.value) return;
      loading.value = true;
      let prefix = permission === 'default' ? 'meusChamados' : 'chamados';
      console.log('prefix' + prefix)
      try {
        const response = await http.get(`/${prefix}`, {
          headers: {
            Authorization: bearer
          }
        });
        orders.value = response.data.result;
      } catch (error) {
        console.error('Erro ao carregar chamados:', error);
      } finally {
        loading.value = false;
      }
    };

    const loadCategorias = async () => {
      try {
        const response = await http.get('/categorias', {
          headers: {
            Authorization: bearer
          }
        });
        categoriaOptions.value = response.data.result.data.map(categoria => ({
          id: categoria.id,
          descricao: categoria.descricao
        }));
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };

    const loadReponsaveis = async () => {
      try {
        const response = await http.get('/users/responsaveis', {
          headers: {
            Authorization: bearer
          }
        });
        resposaveis.value = response.data.result.data.map(resposavel => ({
          id: resposavel.id,
          descricao: `${resposavel.nome} ${resposavel.sobrenome}`
        }));
      } catch (error) {
        console.error('Erro ao carregar técnicos:', error);
      }
    };

    const loadDadosDashboard = async () => {
      try {
        const endpoint = permission === 'default' ? '/dashboard/abertosFechadosUsuario' : '/dashboard/abertosFechados';
        const params = permission === 'default' ? { id_usuario: userId } : {};
        const response = await http.get(endpoint, {
          params,
          headers: {
            Authorization: bearer
          }
        });
        dashOrders.value = response.data.result;
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      }
    };

    const filtrar = async () => {
      try {
        let prefix = permission === 'default' ? 'meusChamados' : 'chamados';

        const response = await http.get(prefix, {
          params: {
            dataInicial: dataInicial.value,
            dataFinal: dataFinal.value,
            categoria: selectedCategoria.value,
            status: selectedStatus.value,
            responsavel: selectedResposavel.value
          },
          headers: {
            Authorization: bearer
          }
        });
        orders.value = response.data.result;
      } catch (error) {
        console.error('Erro ao buscar os chamados:', error);
      }
    };

    const limparFiltro = async () => {
      dataInicial.value = '';
      dataFinal.value = '';
      selectedCategoria.value = null;
      selectedStatus.value = null;
      selectedResposavel.value = null;
      await loadChamados();
    };

    const openEditDialog = async (item) => {
      try {
        const response = await http.get(`/chamado/${item.id}`, {
          headers: {
            Authorization: bearer
          }
        });
        selectedChamado.value = response.data.result;
        dialogEditChamado.value = true;
      } catch (error) {
        console.error('Erro ao obter os dados do chamado:', error);
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'Aguardando Feedback': return 'blue';
        case 'Pendente': return 'orange';
        case 'Rejeitado': return 'red';
        case 'Aberto': return 'blue';
        case 'Em andamento': return 'orange';
        case 'Fechado': return 'green';
        default: return 'gray';
      }
    };

    const fecharDialog = async () => {
      dialogNovoChamado.value = false;
      await loadChamados();
      await loadCategorias();
      await loadReponsaveis();
      await loadDadosDashboard();
    };

    const recarregarChamados = async () => {
      await loadChamados();
      await loadCategorias();
      await loadReponsaveis();
      await loadDadosDashboard();
    };

    onMounted(async () => {
      await loadChamados();
      await loadCategorias();
      await loadReponsaveis();
      await loadDadosDashboard();
    });

    return {
      dataInicial,
      dataFinal,
      search,
      showAdvancedFilters,
      selectedCategoria,
      selectedStatus,
      selectedResposavel,
      selectedChamado,
      dialogNovoChamado,
      dialogEditChamado,
      orders,
      dashOrders,
      categoriaOptions,
      resposaveis,
      headers,
      statusOptions,
      permission,
      filtrar,
      limparFiltro,
      openEditDialog,
      getStatusColor,
      fecharDialog,
      recarregarChamados,
    };
  }
};
</script>

<style scoped>
/* Adicione aqui seus estilos customizados */
</style>
