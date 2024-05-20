<template>
  <v-main>
    <v-container>
      <h1>Dashboard</h1>
      <v-row no-gutters class="dashboard_shadow">
        <v-col cols="6">
          <v-card class="chart-container">
            <v-chip-group v-model="selectedFilter" class="mb-4">
              <v-chip v-for="filter in filters" :key="filter" :value="filter">{{ filter }}</v-chip>
            </v-chip-group>
            <BarChart :filter="selectedFilter" />
          </v-card>
        </v-col>

        <v-col cols="6">
          <v-card class="chart-container">
            <div class="card-content">
              <PieChart />
            </div>
          </v-card>
        </v-col>
      </v-row>

      <h1>Equipe</h1>
      <v-row no-gutters class="dashboard_shadow">
        <HorizontalBarChart />
      </v-row>
      <h1>Logs do sistema</h1>
      <v-row no-gutters class="dashboard_shadow">
        <LogList :logs="logs" />
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { useAuth } from '@/stores/auth.js'
import { computed } from 'vue'
import BarChart from '../components/BarChart'
import PieChart from '../components/PieChart'
import HorizontalBarChart from '../components/HorizontalBarChart'
import LogList from '../components/LogList'


export default {
  components: {
    BarChart,
    PieChart,
    HorizontalBarChart,
    LogList
  },
  data() {
    return {
      selectedFilter: 'Categorias',
      filters: ['Categorias', 'Setor'],
      logs: []
    }
  },
  methods: {
    addLog(user, action) {
      this.logs.push({
        user,
        action,
        timestamp: new Date().toLocaleString()
      });
    }
  },
  mounted() {
    this.addLog('Usuário X', 'Ação realizada');

  }
}
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
