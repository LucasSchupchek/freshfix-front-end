<template>
  <v-main>
    <v-container class="centered">
      <h2>Meus chamados</h2>
      <ListChamados :loadChamados="loadChamados" />
    </v-container>
  </v-main>
</template>

<script setup>
import ListChamados from '../components/chamados/ListChamados.vue';
import { ref } from 'vue';
import http from '@/services/http.js';
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
    const response = await http.get(`/meusChamados?page=${page.value}&limit=${limit}`, {
      headers: {
        Authorization: bearer
      }
    });
    // Substituir a lista de chamados pela lista retornada pela API
    return response.data.result;
    // Atualizar outras variáveis, como o total de páginas, se necessário
  } catch (error) {
    console.error('Erro ao carregar chamados:', error);
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
