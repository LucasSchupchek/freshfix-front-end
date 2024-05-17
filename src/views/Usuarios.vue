<template>
  <v-main>
    <v-container>
      <h2>Usuários</h2>
      <v-data-table-server
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
        <template v-slot:item.actions="{ item }">
          <v-icon @click="editarUsuario(item)" color="primary">mdi-pencil</v-icon>
          <v-icon @click="excluirUsuario(item)" color="error">mdi-delete</v-icon>
        </template>
      </v-data-table-server>
    </v-container>
  </v-main>
</template>

<script>
import { ref, watch } from 'vue'; // Importe 'ref' e 'watch' do Vue 3
import http from '@/services/http.js';
import { useAuth } from '@/stores/auth.js';

export default {
  setup() {
    const auth = useAuth();
    const bearer = `Bearer ${auth.token}`;
    const serverItems = ref([]);
    const loading = ref(false);
    const totalItems = ref(0);
    const search = ref({ nome: '' }); // Crie uma referência para a pesquisa
    const itemsPerPage = ref(10);
    const headers = [
      { title: 'nome', align: 'start', sortable: false, key: 'nome' },
      { title: 'sobrenome', key: 'sobrenome', sortable: false, align: 'end' },
      { title: 'email', key: 'email', sortable: false, align: 'end' },
      { title: 'username', key: 'username', sortable: false, align: 'end' },
      { title: 'nivel_acesso', key: 'nivel_acesso', sortable: false, align: 'end' },
      { title: 'setor', key: 'setor', sortable: false, align: 'end' },
      { title: 'cargo', key: 'cargo', sortable: false, align: 'end' },
      { title: 'Ações', key: 'actions', sortable: false, align: 'end' },
    ];

    // Função para carregar os itens
    const loadItems = async ({ page, itemsPerPage, sortBy }) => {
      loading.value = true;
      try {
        const response = await http.get(`/users?page=${page}&limit=${itemsPerPage}`, {
          params: { sortBy, search: search.value }, // Use search.value
          headers: { Authorization: bearer } 
        });
        const { data } = response;
        serverItems.value = data.result.data.map(user => ({
          ...user,
          actions: {
            editar: () => editarUsuario(user),
            excluir: () => excluirUsuario(user)
          }
        }));
        totalItems.value = data.result.totalPages;
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      } finally {
        loading.value = false;
      }
    };

    // Função para editar um usuário
    const editarUsuario = (usuario) => {
      // Implemente a lógica para editar o usuário aqui
    };

    // Função para excluir um usuário
    const excluirUsuario = (usuario) => {
      // Implemente a lógica para excluir o usuário aqui
    };

    // Observa a mudança em search.nome e chama loadItems
    watch(search, () => {
      loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
    });

    // Carrega os itens ao montar o componente
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value });

    // Retorna os dados para o componente
    return {
      headers,
      search,
      serverItems,
      loading,
      totalItems,
      itemsPerPage,
    };
  },
};
</script>
