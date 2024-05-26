<template>
  <div>
    <div v-if="dataLoaded">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
    <div v-else>
      <p>Carregando...</p>
    </div>
  </div>
</template>

<script>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs';
import http from '@/services/http.js';

import { useAuth } from '@/stores/auth.js';

const auth = useAuth();
const bearer = `Bearer ${auth.token}`;

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
  name: 'DoughnutChart',
  components: { Doughnut },
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [
          {
            backgroundColor: ['#007bff', '#fd7e14', '#28a745'], // Azul, Laranja e Verde
            data: []
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      },
      dataLoaded: false // Variável de estado para controlar se os dados foram carregados
    }
  },
  mounted() {
    this.fetchChartData()
  },
  methods: {
    async fetchChartData() {
      try {
        const resp = await http.get('/dashboard/abertosFechados', {
          headers: {
            Authorization: bearer
          }
        });

        if (resp.data.error) {
          console.log('Erro ao buscar dados', + resp.data.error);
          return;
        }

        const dados = resp.data.result;

        // Processando o objeto retornado pela API
        this.chartData.labels = Object.keys(dados);
        this.chartData.datasets[0].data = Object.values(dados);
        
        this.dataLoaded = true; // Definir como true após os dados serem carregados
      } catch (error) {
        console.error('Erro ao atualizar status:', error);
      }
    }
  },
}
</script>
