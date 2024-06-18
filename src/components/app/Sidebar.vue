<template>
  <v-navigation-drawer v-model="isDrawerOpen">
    <v-list>
      <v-list-item link to="dashboard" prepend-icon="mdi mdi-monitor-dashboard" title="Dashboard" v-show="permissao == 'admin' || permissao == 'supervisor'"></v-list-item>
      <v-list-item link to="meusChamados" prepend-icon="mdi mdi-file-account" title="Meus Chamados" v-show="permissao == 'default'"></v-list-item>
      <v-list-item link to="chamadosTecnicos" prepend-icon="mdi mdi-order-bool-descending-variant" v-show="permissao !== 'default'" title="Chamados"></v-list-item>

      <v-list-group value="Configuracoes">
        <template #activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi mdi-cog" v-show="permissao == 'admin'">Configurações</v-list-item>
        </template>

        <v-list-item link to="usuarios" prepend-icon="mdi-account-circle" title="Usuários"></v-list-item>
        <v-list-item link to="setores" prepend-icon="mdi mdi-database-marker" title="Setores"></v-list-item>
        <v-list-item link to="cargos" prepend-icon="mdi mdi-book-account" title="Cargos"></v-list-item>
        <v-list-item link to="categoria" prepend-icon="mdi mdi-pin" title="Categorias"></v-list-item>
      </v-list-group>
    </v-list>
    <!-- <router-link to="NovoChamado"> -->
      <!-- <v-dialog v-model="dialog" max-width="750" persistent>
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn class="novo-chamado-button" color="primary" v-bind="activatorProps">Novo Chamado</v-btn>
        </template>
        <NovoChamado :dialog="dialog" @fechar-dialog="fecharDialog"/>
      </v-dialog> -->
    <!-- </router-link> -->
  </v-navigation-drawer>
</template>

<script>
import { isDrawerOpen } from '@/stores/stores';
import { computed } from 'vue';

export default {
  name: "Sidebar",
  props:{
    permission: String
  },
  data() {
    return {
      dialog: false,
    };
  },
  setup(props) {
    const permissao = computed(() => props.permission);
    return {
      isDrawerOpen,
      permissao
    };
  },
  methods: {
    fecharDialog() {
      this.dialog = false; // Fechar o diálogo
    },
  },
};
</script>

<style scoped>
.sidebar-container {
  position: relative;
}

.novo-chamado-button {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}
</style>