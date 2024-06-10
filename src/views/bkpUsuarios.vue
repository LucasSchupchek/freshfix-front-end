<template>
    <v-main>
      <v-container>
        <v-container class="custom-container">
        <v-row justify="center">
          <v-col cols="12">
            <h2>Usuários</h2>
            <div class="text-right">
              <v-dialog v-model="dialog" max-width="750" persistent>
                <template v-slot:activator="{ props: activatorProps }">
                  <v-btn color="primary" v-bind="activatorProps">Cadastrar Usuário</v-btn>
                </template>
                <NovoUsuario :dialog="dialog" @fechar-dialog="fecharDialog"/>
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
              item-value="nome"
              @update:options="loadItems"
            >
              <template v-slot:top>
                <v-text-field
                  v-model="search.nome"
                  density="compact"
                  placeholder="Search name..."
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
              <template v-slot:[`item.actions`]="{ item }">
                <v-icon @click="openEditDialog(item)" color="primary">mdi-pencil</v-icon>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <v-dialog v-model="isEditDialogOpen" max-width="750" persistent>
          <EditUserDialog :user="selectedUser" :isOpen="isEditDialogOpen" :accessLevels="accessLevels" @fechar-dialog="fecharEditDialog"></EditUserDialog>
        </v-dialog>
        <v-dialog v-model="isToggleDialogOpen" max-width="500px">
          <v-card>
            <v-card-title class="headline">Confirmação</v-card-title>
            <v-card-text>Você tem certeza que deseja {{ selectedUser?.ativo ? 'inativar' : 'ativar' }} o usuário {{ selectedUser?.nome }}?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="isToggleDialogOpen = false">Cancelar</v-btn>
              <v-btn color="green darken-1" text @click="toggleUserStatus">Confirmar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
      </v-container>
    </v-main>
  </template>
  
  <script>
  import { ref, watch } from 'vue';
  import http from '@/services/http.js';
  import { useAuth } from '@/stores/auth.js';
  import EditUserDialog from '@/components/usuarios/EditUserDialog.vue';
  import NovoUsuario from '../components/usuarios/NovoUsuario.vue'
  
  export default {
    components: {
      EditUserDialog,
      NovoUsuario
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
      const search = ref({ nome: '' });
      const itemsPerPage = ref(10);
      const headers = [
        { title: 'Nome', align: 'start', key: 'nome' },
        { title: 'Sobrenome', key: 'sobrenome', align: 'start' },
        { title: 'Email', key: 'email', align: 'start' },
        { title: 'Username', key: 'username', align: 'start' },
        { title: 'Nível de Acesso', key: 'nivel_acesso', align: 'start' },
        { title: 'Setor', key: 'setor', align: 'start' },
        { title: 'Cargo', key: 'cargo', align: 'start' },
        { title: 'Ativo', key: 'ativo', align: 'start' },
        { title: 'Ações', key: 'actions', align: 'end' },
      ];
  
      const accessLevels = ref(['admin', 'supervisor', 'tecnico', 'default']);
      
      const isEditDialogOpen = ref(false);
      const isDeleteDialogOpen = ref(false);
      const isToggleDialogOpen = ref(false);
      const selectedUser = ref(null);
  
      const fecharEditDialog = () => {
        isEditDialogOpen.value = false;
        loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
      };
  
      const loadItems = async ({ page, itemsPerPage, sortBy }) => {
        loading.value = true;
        try {
          const response = await http.get(`/users?page=${page}&limit=${itemsPerPage}`, {
            params: { sortBy, search: search.value },
            headers: { Authorization: bearer           }
          });
          const { data } = response;
          serverItems.value = data.result.data.map(user => ({
            ...user,
            ativo: user.ativo ? 1 : 0
          }));
          totalItems.value = data.result.totalItems;
        } catch (error) {
          console.error('Erro ao carregar usuários:', error);
        } finally {
          loading.value = false;
        }
      };
  
      const openEditDialog = (user) => {
        selectedUser.value = { ...user };
        isEditDialogOpen.value = true;
      };
  
      const confirmDeleteUser = (user) => {
        selectedUser.value = user;
        isDeleteDialogOpen.value = true;
      };
  
      const handleSave = async (user) => {
        try {
          await http.put(`/users/${user.id}`, user, {
            headers: { Authorization: bearer }
          });
          loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
        } catch (error) {
          console.error('Erro ao salvar usuário:', error);
        }
      };
  
      const confirmToggleUserStatus = (user) => {
        selectedUser.value = user;
        isToggleDialogOpen.value = true;
      };
  
      const toggleUserStatus = async () => {
        try {
          await http.put(`/userAtivo/${selectedUser.value.id}`, {}, {
            params: { ativo: selectedUser.value.ativo ? false : true },
            headers: { Authorization: bearer }
          });
          loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
        } catch (error) {
          console.error('Erro ao atualizar status do usuário:', error);
        } finally {
          isToggleDialogOpen.value = false;
        }
      };
  
      const setHoverIcon = (user) => {
        user.hoverIcon = user.ativo ? 'mdi-close' : 'mdi-check';
      };
  
      const resetIcon = (user) => {
        user.hoverIcon = null;
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
        accessLevels,
        isEditDialogOpen,
        isDeleteDialogOpen,
        isToggleDialogOpen,
        selectedUser,
        openEditDialog,
        confirmDeleteUser,
        handleSave,
        confirmToggleUserStatus,
        toggleUserStatus,
        setHoverIcon,
        resetIcon,
        fecharEditDialog
      };
    },
    methods: {
      fecharDialog() {
        this.dialog = false; // Fechar o diálogo
        loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
      },
    },
  };
  </script>
  
  <style scoped>
  .user-list-container {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Adicione o efeito de sombra */
    margin: 10px auto; /* Margem 10px nas laterais e centralize horizontalmente */
    max-width: 90%; /* Defina uma largura máxima */
    display: flex; /* Use flexbox para centralizar verticalmente */
    align-items: center; /* Centralize verticalmente */
    justify-content: center; /* Centralize horizontalmente */
  }
  </style>
  