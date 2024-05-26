<template>
  <v-main>
    <v-container>
      <ChamadoComponente v-if="permission == 'admin'" :loadChamados="loadChamados" :loadDadosDashboard="loadDadosDashboard" />
      <ChamadoComponente v-else :loadChamados="loadMeusChamados" :loadDadosDashboard="loadDadosDashboardUsuario" />
    </v-container>
  </v-main>
</template>

<script setup>
import ChamadoComponente from '../components/chamados/ChamadoComponente.vue';
import { ref, onMounted } from 'vue';
import http from '@/services/http.js';
import { useAuth } from '@/stores/auth.js';

const auth = useAuth();
const page = ref(1);
const limit = 20;
const loading = ref(false);
const bearer = `Bearer ${auth.token}`;
const permission = auth.permission
const userId = auth.user.id;

const loadChamados = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    const response = await http.get(`/chamados/list?page=${page.value}&limit=${limit}`, {
      headers: {
        Authorization: bearer
      }
    });
    const chamados = response.data.result;
    loading.value = false;
    return chamados;
  } catch (error) {
    console.error('Erro ao carregar chamados:', error);
    loading.value = false;
  }
};

const loadMeusChamados = async () => {
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

const loadDadosDashboardUsuario = async () => {
  console.log(userId)
  try {
    const response = await http.get('/dashboard/abertosFechadosUsuario', {
      params: {
        id_usuario: userId
      },
      headers: {
        Authorization: bearer
      }
    });
    const dadosDashboard = response.data.result;
    return dadosDashboard;
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error);
    return [];
  }
};

const loadDadosDashboard = async () => {
  try {
    const response = await http.get('/dashboard/abertosFechados', {
      headers: {
        Authorization: bearer
      }
    });
    const dadosDashboard = response.data.result;
    return dadosDashboard;
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error);
    return [];
  }
};

</script>

<style scoped>
</style>
