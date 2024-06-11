<template>
  <div v-if="dataLoaded" class="chart-wrapper">
    <Bar :data="chartData" :options="options" />
  </div>
  <div v-else class="loading">Carregando...</div>
</template>

<script>
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import http from '@/services/http.js';

import { useAuth } from '@/stores/auth.js';

const auth = useAuth();
const bearer = `Bearer ${auth.token}`;

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

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
      dataLoaded: false,
      categoryData: {
        labels: [],
        datasets: [
          {
            label: 'Dados por Categoria',
            backgroundColor: [],
            data: []
          }
        ]
      },
      sectorData: {
        labels: [],
        datasets: [
          {
            label: 'Dados por Setor',
            backgroundColor: [],
            data: []
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true
      }
    };
  },
  mounted() {
    this.fetchChartData();
  },
  methods: {
    fetchChartData() {
      const url = this.filter === 'Categorias' ? 'https://apichamados.onrender.com/api/dashboard/chamadosCategoria' : 'https://apichamados.onrender.com/api/dashboard/chamadosSetor';
      const params = {
        data_inicial: '2024-01-01',
        data_final: '2024-12-31'
      };
      const config = {
        headers: {
          Authorization: bearer
        }
      };

      http.get(url, {
        params, // Parâmetros da query string
        headers: { // Cabeçalhos da requisição
          Authorization: bearer
        }
      })
        .then(response => {
          console.log(response.data.result); // Verificar os dados recebidos da API
          const dados = response.data.result;
          console.log(this.filter);
          if (this.filter === 'Categorias') {
            this.categoryData.labels = dados.map(el => el.descricao_categoria);
            this.categoryData.datasets[0].backgroundColor = dados.map(el => el.cor_categoria);
            this.categoryData.datasets[0].data = dados.map(el => el.quantidade_chamados);
          } else if (this.filter === 'Setor') {
            this.sectorData.labels = dados.map(el => el.descricao_setor);
            this.sectorData.datasets[0].backgroundColor = dados.map(el => this.generateRandomColor());
            this.sectorData.datasets[0].data = dados.map(el => el.quantidade_chamados);
          }
          this.dataLoaded = true; // Define que os dados foram carregados com sucesso
        })
        .catch(error => {
          console.error('Erro ao carregar os dados do gráfico:', error);
        });
    },
    generateRandomColor() {
      // Função para gerar uma cor aleatória hexadecimal
      return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }
  },
  computed: {
    chartData() {
      return this.filter === 'Categorias' ? this.categoryData : this.sectorData;
    }
  },
  watch: {
    filter(newFilter, oldFilter) {
      // Ao alterar o filtro, chame a função fetchChartData para recarregar os dados do gráfico
      this.dataLoaded = false; // Define que os dados estão sendo carregados
      this.fetchChartData();
    }
  }
};
</script>

<style scoped>
.chart-wrapper {
  width: 100%; /* Ajuste conforme necessário */
  height: 400px; /* Ajuste conforme necessário */
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}
</style>
