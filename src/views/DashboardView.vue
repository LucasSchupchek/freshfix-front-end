<template>
  <v-main>
    <v-container>
      <v-container class="custom-container" max-width="800px">
        <h1>Dashboard</h1>
        <v-row justify="center" align="stretch">
          <v-col cols="12" md="9">
            <v-card class="chart-container mb-4">
              <v-chip-group v-model="selectedFilter" class="mb-4">
                <v-chip v-for="filter in filters" :key="filter" :value="filter">{{ filter }}</v-chip>
              </v-chip-group>
              <BarChart :filter="selectedFilter" />
            </v-card>
          </v-col>

          <v-col cols="12" md="3">
            <v-card class="chart-container">
              <div class="card-content">
                <DoughnutChart />
              </div>
            </v-card>
          </v-col>
        </v-row>

        <h1>Equipe</h1>
        <v-row class="dashboard_shadow">
          <HorizontalBarChart />
        </v-row>

        <h1>Logs do sistema</h1>
        <v-row class="dashboard_shadow">
          <LogList :logs="logs" />
        </v-row>
      </v-container>
    </v-container>
  </v-main>
</template>

<script>
import { ref } from 'vue';
import BarChart from '../components/dashboard/BarChart';
import DoughnutChart from '../components/dashboard/DoughnutChart';
import HorizontalBarChart from '../components/dashboard/HorizontalBarChart';
import LogList from '../components/dashboard/LogList';
import { useAuth } from '@/stores/auth.js';

const auth = useAuth();
const bearer = `Bearer ${auth.token}`;

export default {
  components: {
    BarChart,
    DoughnutChart,
    HorizontalBarChart,
    LogList
  },
  setup() {
    const selectedFilter = ref('Categorias');
    const filters = ref(['Categorias', 'Setor']);
    const logs = ref([]);

    const addLog = (user, action) => {
      logs.value.push({
        user,
        action,
        timestamp: new Date().toLocaleString()
      });
    };

    return {
      selectedFilter,
      filters,
      logs,
      addLog
    };
  }
};
</script>

<style scoped>
.square-card {
  height: 200px; /* Altura dos cards */
  width: 200px; /* Largura dos cards */
}

.card-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* Para centralizar verticalmente */
}

.chart-container {
  height: 100%; /* Preencher a altura total */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.dashboard_shadow {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Adiciona uma sombra */
  padding: 20px; /* Adiciona um preenchimento ao redor */
  border-radius: 8px; /* Adiciona bordas arredondadas */
  background-color: white; /* Garante que o fundo seja branco */
  margin-bottom: 20px; /* Espaçamento inferior entre seções */
}
</style>
