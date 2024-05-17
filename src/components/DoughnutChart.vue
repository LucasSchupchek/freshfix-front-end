<template>
  <Doughnut :data="data" :options="options" />
</template>
  
<script>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
  
ChartJS.register(ArcElement, Tooltip, Legend)

  export default {
    name: 'DoughnutChart',
    components: { Doughnut },
    data(){
      return {
        data: {
          labels: ['Aberto', 'Fechado'],
          datasets: [
            {
              backgroundColor: ['#41B883', '#DD1B16'],
              data: [40, 20]
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
  