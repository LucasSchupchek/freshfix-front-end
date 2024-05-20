<template>
  <Pie :data="data" :options="options" />
</template>
  
<script>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'
  
ChartJS.register(ArcElement, Tooltip, Legend)

  export default {
    name: 'PieChart',
    components: { Pie },
    data(){
      return {
        data: {
          labels: ['Aberto', 'Fechado', 'Em andamento', 'Aguardando Feedback', 'Pendente', 'Rejeitado'],
          datasets: [
            {
              backgroundColor: ['#132994', '#0f9120', '#96960e', '#87CEFA', '#8f4914', '#961520'],
              data: [40, 20, 35, 15, 5, 45]
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      }
    }
  }
  </script>
  