<template>
  <v-main>
    <v-container>
      <ChamadoComponente :loadChamados="loadChamados" :loadDadosDashboard="loadDadosDashboard" />
    </v-container>
  </v-main>
</template>

<script setup>
import ChamadoComponente from '../components/ChamadoComponente.vue';
import { ref, onMounted } from 'vue';
import http from '@/services/http.js';
import { useAuth } from '@/stores/auth.js';

const auth = useAuth();
const page = ref(1);
const limit = 20;
const loading = ref(false);
const bearer = `Bearer ${auth.token}`;

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

// Função para carregar os dados dos chamados abertos, em andamento e fechados
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
