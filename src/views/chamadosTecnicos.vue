<template>
  <v-main>
    <v-container class="centered">
      <h2>Chamados</h2>
      <ListChamados :loadChamados="loadChamados" />
    </v-container>
  </v-main>
</template>

<script setup>
import ListChamados from '../components/ListChamados.vue';
import { ref } from 'vue';
import http from '@/services/http.js'; // Importe o módulo http
import { useAuth } from '@/stores/auth.js';

const auth = useAuth();
const page = ref(1);
const limit = 20;
const loading = ref(false); // Declare a variável loading
const bearer = `Bearer ${auth.token}`;
console.log(bearer)
const chamados = ref([]);

const loadChamados = async () => {
  if (loading.value) return; // Acesse o valor de loading
  loading.value = true; // Atualize o valor de loading
  try {
    const response = await http.get(`/chamados?page=${page.value}&limit=${limit}`, {
      headers: {
        Authorization: bearer
      }
    });
    // Substituir a lista de chamados pela lista retornada pela API
    const chamados = response.data.result;
    loading.value = false; // Resetar o estado de loading
    return chamados;
    // Atualizar outras variáveis, como o total de páginas, se necessário
  } catch (error) {
    console.error('Erro ao carregar chamados:', error);
    loading.value = false; // Resetar o estado de loading em caso de erro
  }
};

</script>

<style scoped>
.centered {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin-top: 5%;
}
</style>
  