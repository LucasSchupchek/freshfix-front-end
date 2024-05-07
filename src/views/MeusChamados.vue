<template>
  <v-main>
    <v-container class="centered">
      <h2>Meus chamados</h2>
      <h6>Status</h6>
      <div class="text-center">
        <v-chip size="small" :ripple="false" link>
          Aberto
        </v-chip>
        <v-chip size="small" :ripple="false" link>
          Fechado
        </v-chip>
      </div>
      <v-text-field 
        density="compact"
        class="search"
        append-inner-icon="mdi-magnify"
        variant="solo"
        hide-details
        single-line
        v-model="search"
        label="Pesquisar chamados"
        outlined>
      </v-text-field>
      <div class="categorias_e_chamados">
        <div id="categorias">
          <h6>Categoria</h6>
          <div class="text-left"> <!-- Ajuste feito aqui -->
            <v-chip size="small" :ripple="false" link>
              Rede
            </v-chip>
            <v-chip size="small" :ripple="false" link>
              Sistema
            </v-chip>
          </div>
        </div>
        <v-expansion-panels>
          <v-expansion-panel
            v-for="(chamado, index) in filteredChamados"
            :key="index"
            :title="chamado.title"
            :text="chamado.description"
          >
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </v-container>
  </v-main>
</template>

<script>
import { useAuth } from '@/stores/auth.js'
import { computed, ref } from 'vue'

export default {
  setup() {
    const auth = useAuth();
    const permissao = computed(() => auth.permission);
    const chamados = ref([
      { title: 'Chamado 1', description: 'Descrição do chamado 1' },
      { title: 'Chamado 2', description: 'Descrição do chamado 2' },
      { title: 'Chamado 3', description: 'Descrição do chamado 3' }
    ]);
    const search = ref('');

    const filteredChamados = computed(() => {
      return chamados.value.filter(chamado =>
        chamado.title.toLowerCase().includes(search.value.toLowerCase())
      );
    });

    return {
      permissao,
      search,
      filteredChamados
    };
  }
}
</script>

<style scoped>
.centered {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin-top: 5%;
}

.search{
  margin-top: 3%;
  margin-bottom: 1%;
  width: 100%;
}

.categorias_e_chamados {
  display: flex;
  flex-direction: row;
  width: 100%;
}

#categorias {
  margin-right: 20px; /* Espaço entre as categorias e a lista de chamados */
}

#categorias v-chip {
  margin-bottom: 20px; /* Espaço entre as categorias e a lista de chamados */
}
</style>
