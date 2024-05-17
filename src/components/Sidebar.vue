<template>
  <v-navigation-drawer v-model="isDrawerOpen">
    <v-list>
      <v-list-item link to="dashboard" prepend-icon="mdi mdi-monitor-dashboard" title="Dashboard" v-show="permissao !== 'default'"></v-list-item>
      <v-list-item link to="meusChamados" prepend-icon="mdi mdi-file-account" title="Meus Chamados"></v-list-item>
      <v-list-item link to="chamadosTecnicos" prepend-icon="mdi mdi-order-bool-descending-variant" v-show="permissao !== 'default'" title="Chamados"></v-list-item>

      <v-list-group value="Configuracoes">
        <template #activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi mdi-cog" v-show="permissao !== 'default'">Configurações</v-list-item>
        </template>

        <v-list-item link to="usuarios" prepend-icon="mdi-account-circle" title="Usuários"></v-list-item>
        <v-list-item link to="" prepend-icon="mdi mdi-cog" title="Setores"></v-list-item>
        <v-list-item link to="" prepend-icon="mdi mdi-cog" title="Cargos"></v-list-item>
        <v-list-item link to="" prepend-icon="mdi mdi-cog" title="Categorias"></v-list-item>
      </v-list-group>
    </v-list>
    <!-- <router-link to="NovoChamado"> -->
      <v-dialog v-model="dialog" max-width="750" persistent>
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn class="novo-chamado-button" color="primary" v-bind="activatorProps">Novo Chamado</v-btn>
        </template>
        <NovoChamado :dialog="dialog" @fechar-dialog="fecharDialog"/>
      </v-dialog>
    <!-- </router-link> -->
  </v-navigation-drawer>
</template>

<script>
import { isDrawerOpen } from '@/stores/stores';
import { computed } from 'vue';
import NovoChamado from './NovoChamado.vue'

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
  components: {
    NovoChamado,
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