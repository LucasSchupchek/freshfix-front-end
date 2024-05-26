<template>
    <Bar :data="sortedData" :options="options" />
  </template>
  
  <script>
  import { Bar } from 'vue-chartjs'
  import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
  
  ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)
  
  export default {
    name: 'HorizontalBarChart',
    components: {
      Bar
    },
    data() {
      return {
        rawData: [
          { name: 'Técnico A', chamados: 5 },
          { name: 'Técnico B', chamados: 10 },
          { name: 'Técnico C', chamados: 3 },
          { name: 'Técnico D', chamados: 8 }
        ],
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
  