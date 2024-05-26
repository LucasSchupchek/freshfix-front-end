<template>
  <v-main>
    <v-container class="user-list-container" max-width="600px">
      <v-row justify="center">
        <v-col cols="12">
          <h2>Categorias</h2>
          <div class="text-right">
            <v-dialog v-model="dialog" max-width="600" persistent>
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn color="primary" v-bind="activatorProps">Cadastrar Categoria</v-btn>
              </template>
              <CadastroCategoria :dialog="dialog" @fechar-dialog="fecharDialog"/>
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
            :search="search.descricao"
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
            <template v-slot:[`item.ativo`]="{ item }">
              <v-icon
                :color="item.hoverIcon ? (item.ativo ? 'red' : 'green') : (item.ativo ? 'green' : 'red')"
                @click="confirmToggleUserStatus(item)"
                @mouseover="setHoverIcon(item)"
                @mouseleave="resetIcon(item)"
              >{{ item.hoverIcon || (item.ativo ? 'mdi-check' : 'mdi-close') }}</v-icon>
            </template>
            <template v-slot:[`item.color`]="{ item }">
              <v-chip v-bind:style="{ backgroundColor: item.color }"></v-chip>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon @click="openEditDialog(item)" color="primary">mdi-pencil</v-icon>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-dialog v-model="isEditDialogOpen" max-width="600" persistent>
        <CadastroCategoria :dialog="isEditDialogOpen" :categoria="selectedcategoria" :isEdit="true" @fechar-dialog="fecharEditDialog" />
      </v-dialog>
      <v-dialog v-model="isToggleDialogOpen" max-width="500px">
        <v-card>
          <v-card-title class="headline">Confirmação</v-card-title>
          <v-card-text>Você tem certeza que deseja {{ selectedcategoria?.ativo ? 'inativar' : 'ativar' }} o categoria {{ selectedcategoria?.descricao }}?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="isToggleDialogOpen = false">Cancelar</v-btn>
            <v-btn color="green darken-1" text @click="toggleUserStatus">Confirmar</v-btn>
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
import CadastroCategoria from '../components/categorias/CadastroCategoria';


export default {
  components: {
    CadastroCategoria
  },
  data() {
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
      { title: 'ID', key: 'id', align: 'start' },
      { title: 'Descrição', key: 'descricao', align: 'start' },
      { title: 'Ativo', key: 'ativo', align: 'start' },
      { title: 'Cor', key: 'color', align: 'start' },
      { title: 'Ações', key: 'actions', align: 'center', sortable: false }
    ];

    const isEditDialogOpen = ref(false);
    const isToggleDialogOpen = ref(false);
    const selectedcategoria = ref(null);

    const fecharEditDialog = () => {
      isEditDialogOpen.value = false;
      loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
    };

    const loadItems = async ({ page, itemsPerPage, sortBy }) => {
      loading.value = true;
      try {
        const response = await http.get(`/categorias?page=${page}&limit=${itemsPerPage}`, {
          params: { sortBy, search: search.value },
          headers: { Authorization: bearer }
        });
        const { data } = response;
        serverItems.value = Array.isArray(data.result.data) ? data.result.data : [];
        totalItems.value = data.result.totalItems || 0;
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        serverItems.value = [];
        totalItems.value = 0;
      } finally {
        loading.value = false;
      }
    };

    const openEditDialog = (categoria) => {
      selectedcategoria.value = { ...categoria };
      isEditDialogOpen.value = true;
    };

    const confirmToggleUserStatus = (categoria) => {
      selectedcategoria.value = categoria;
      isToggleDialogOpen.value = true;
    };

    const toggleUserStatus = async () => {
      try {
        await http.put(`/categoriaAtivo/${selectedcategoria.value.id}`, {}, {
          params: { ativo: selectedcategoria.value.ativo ? false : true },
          headers: { Authorization: bearer }
        });
        loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
      } catch (error) {
        console.error('Erro ao atualizar status do categoria:', error);
      } finally {
        isToggleDialogOpen.value = false;
      }
    };

    const setHoverIcon = (categoria) => {
      categoria.hoverIcon = categoria.ativo ? 'mdi-close' : 'mdi-check';
    };

    const resetIcon = (categoria) => {
      categoria.hoverIcon = null;
    };

    watch(search, () => {
      loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
    });

    loadItems({ page: 1, itemsPerPage: itemsPerPage.value });

    return {
      confirmToggleUserStatus,
      toggleUserStatus,
      setHoverIcon,
      resetIcon,
      headers,
      search,
      serverItems,
      loading,
      totalItems,
      itemsPerPage,
      isEditDialogOpen,
      isToggleDialogOpen,
      selectedcategoria,
      openEditDialog,
      fecharEditDialog,
      loadItems
    };
  },
  methods: {
    fecharDialog() {
      this.dialog = false; // Fechar o diálogo
      this.loadItems({ page: 1, itemsPerPage: this.itemsPerPage });
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
