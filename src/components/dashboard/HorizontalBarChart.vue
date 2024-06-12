<template>
    <Bar :data="sortedData" :options="options" />
  </template>
  
  <script>
  import { Bar } from 'vue-chartjs'
  import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
  import http from '@/services/http.js';
  
  import { useAuth } from '@/stores/auth.js';

  const auth = useAuth();
  const bearer = `Bearer ${auth.token}`;

  ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)
  
  export default {
    name: 'HorizontalBarChart',
    components: {
      Bar
    },
    data() {
      return {
        rawData: [],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          scales: {
            x: {
              beginAtZero: true
            }
          }
        }
      }
    },
    mounted() {
      this.fetchChartData();
    },
    methods: {
      async fetchChartData() {
        try {
          const response = await http.get('/dashboard/chamadosTecnicos', {
            headers: {
              Authorization: bearer
            }
          })
          this.rawData = response.data.result.map(item => {
            return {
              name: item.nome_usuario,
              chamados: item.quantidade_chamados
            };
          });
        } catch (error) {
          console.error('Erro ao buscar dados do gráfico:', error);
        }
      }
    },
    computed: {
      sortedData() {
        const sorted = [...this.rawData].sort((a, b) => b.chamados - a.chamados)
        return {
          labels: sorted.map(item => item.name),
          datasets: [
            {
              label: 'Chamados Atendidos',
              backgroundColor: '#41B883', // Cor padrão para todos os itens
              data: sorted.map(item => item.chamados)
            }
          ]
        }
      }
    }
  }
  </script>
  
  
  <style scoped>
  .chart-container {
    height: 400px; /* Ajuste conforme necessário */
  }
  </style>
  