<template>
  <div class="chart-wrapper">
    <Bar :data="chartData" :options="options" />
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default {
  name: 'BarChart',
  components: {
    Bar
  },
  props: {
    filter: {
      type: String,
      default: 'Categorias'
    }
  },
  data() {
    return {
      categoryData: {
        labels: ['Categoria A', 'Categoria B', 'Categoria C', 'Categoria D'],
        datasets: [
          {
            label: 'Dados por Categoria',
            backgroundColor: '#41B883',
            data: [40, 20, 80, 10]
          }
        ]
      },
      sectorData: {
        labels: ['Setor A', 'Setor B', 'Setor C', 'Setor D'],
        datasets: [
          {
            label: 'Dados por Setor',
            backgroundColor: '#41B883',
            data: [50, 30, 70, 20]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true
      }
    }
  },
  computed: {
    chartData() {
      return this.filter === 'Categorias' ? this.categoryData : this.sectorData
    }
  }
}
</script>

<style scoped>
.chart-wrapper {
  width: 100%; /* Ajuste conforme necessário */
  height: 400px; /* Ajuste conforme necessário */
}
</style>
