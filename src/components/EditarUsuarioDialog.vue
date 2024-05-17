<template>
    <v-dialog :value="dialog" max-width="600" @update:modelValue="updateDialog">
      <v-card>
        <v-card-title>Editar Usuário</v-card-title>
        <v-card-text>
          <!-- Campos de edição de usuário -->
          <v-text-field v-model="usuarioEditado.nome" label="Nome"></v-text-field>
          <v-text-field v-model="usuarioEditado.email" label="Email"></v-text-field>
          <v-text-field v-model="usuarioEditado.username" label="Username"></v-text-field>
          <v-text-field v-model="usuarioEditado.setor" label="Setor"></v-text-field>
          <v-text-field v-model="usuarioEditado.cargo" label="Cargo"></v-text-field>
          <v-text-field v-model="usuarioEditado.acesso" label="Acesso"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="salvarEdicao">Salvar</v-btn>
          <v-btn @click="fechar">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    name: 'EditarUsuarioDialog',
    props: {
      dialog: Boolean // Propriedade booleana para controlar a exibição do diálogo
    },
    methods: {
      updateDialog(newValue) {
        // Emitir evento para atualizar a propriedade dialog
        this.$emit('update:dialog', newValue);
      }
    }
  };
  </script>  
  
  <style scoped>
  /* Adicione estilos conforme necessário */
  </style>
  