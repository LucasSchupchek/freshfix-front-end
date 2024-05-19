<template>
  <v-main>
    <v-container class="user-list-container" max-width="600px">
      <v-row justify="center">
        <v-col cols="12">
          <h2>Setores</h2>
          <div class="text-right">
            <v-dialog v-model="dialog" max-width="600" persistent>
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn color="primary" v-bind="activatorProps">Cadastrar Setor</v-btn>
              </template>
              <CadastroSetor :dialog="dialog" @fechar-dialog="fecharDialog" @setor-salvo="loadItems" />
            </v-dialog>
          </div>
        </v-col>
        <v-col cols="12">
          <v-data-table
            v-model:items-per-page="itemsPerPage"
            :headers="headers"
            :items="serverItems"
            :items-length="totalItems"
            :loading="loading"
            :search="search"
            class="data-table-container"
            item-value="descricao"
            @update:options="loadItems"
          >
            <template v-slot:top>
              <v-text-field
                v-model="search.descricao"
                density="compact"
                placeholder="Pesquisar..."
                hide-details
              ></v-text-field>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon @click="openEditDialog(item)" color="primary">mdi-pencil</v-icon>
              <v-icon @click="confirmDeleteSetor(item)" color="red">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-dialog v-model="isEditDialogOpen" max-width="600" persistent>
        <NovoSetor :dialog="isEditDialogOpen" :setor="selectedSetor" isEdit @fechar-dialog="fecharEditDialog" @setor-salvo="loadItems" />
      </v-dialog>
      <v-dialog v-model="isDeleteDialogOpen" max-width="500px">
        <v-card>
          <v-card-title class="headline">Confirmação</v-card-title>
          <v-card-text>Você tem certeza que deseja excluir o setor {{ selectedSetor?.descricao }}?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="isDeleteDialogOpen = false">Cancelar</v-btn>
            <v-btn color="green darken-1" text @click="deleteSetor">Confirmar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-main>
</template>

<script>
import { ref, watch } from 'vue';
import http from '@/services/http.js';
import { useAuth } from '@/stores/auth.js';
import CadastroSetor from '../components/CadastroSetor.vue';

export default {
  components: {
    CadastroSetor
  },
  data(){
    return {
      dialog: false,
    };
  },
  setup() {
    const auth = useAuth();
    const bearer = `Bearer ${auth.token}`;
    const serverItems = ref([]);
    const loading = ref(false);
    const totalItems = ref(0);
    const search = ref({ descricao: '' });
    const itemsPerPage = ref(10);
    const headers = [
    { title: 'id', key: 'id', align: 'start' },
      { title: 'descricao', key: 'descricao', align: 'end' },
      { title: 'Ações', key: 'actions', align: 'end' },
    ];

    const isEditDialogOpen = ref(false);
    const isDeleteDialogOpen = ref(false);
    const selectedSetor = ref(null);

    const fecharEditDialog = () => {
      isEditDialogOpen.value = false;
      loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
    };

    const loadItems = async ({ page, itemsPerPage, sortBy }) => {
      loading.value = true;
      try {
        const response = await http.get(`/setores?page=${page}&limit=${itemsPerPage}`, {
          params: { sortBy, search: search.value },
          headers: { Authorization: bearer }
        });
        const { data } = response;
        serverItems.value = data.result.data;
        totalItems.value = data.result.totalItems;
      } catch (error) {
        console.error('Erro ao carregar setores:', error);
      } finally {
        loading.value = false;
      }
    };

    const openEditDialog = (setor) => {
      selectedSetor.value = { ...setor };
      isEditDialogOpen.value = true;
    };

    const confirmDeleteSetor = (setor) => {
      selectedSetor.value = setor;
      isDeleteDialogOpen.value = true;
    };

    const deleteSetor = async () => {
      try {
        await http.delete(`/setores/${selectedSetor.value.id}`, {
          headers: { Authorization: bearer }
        });
        loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
      } catch (error) {
        console.error('Erro ao excluir setor:', error);
      } finally {
        isDeleteDialogOpen.value = false;
      }
    };

    watch(search, () => {
      loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
    });

    loadItems({ page: 1, itemsPerPage: itemsPerPage.value });

    return {
      headers,
      search,
      serverItems,
      loading,
      totalItems,
      itemsPerPage,
      isEditDialogOpen,
      isDeleteDialogOpen,
      selectedSetor,
      openEditDialog,
      confirmDeleteSetor,
      deleteSetor,
      fecharEditDialog
    };
  },
  methods: {
    fecharDialog() {
      this.dialog = false; // Fechar o diálogo
      this.loadItems({ page: 1, itemsPerPage: this.itemsPerPage.value });
    },
  },
};
</script>

<style scoped>
.user-list-container {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 10px auto;
  max-width: 600px;
}
.data-table-container {
  max-width: 600px;
}
</style>
