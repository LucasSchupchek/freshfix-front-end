<template>
    <v-card>
      <v-card-title>{{ isEdit ? 'Editar Setor' : 'Cadastrar Setor' }}</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="isFormValid">
          <v-text-field
            v-model="descricao"
            label="Descrição"
            :rules="[rules.required]"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="fecharDialog">Cancelar</v-btn>
        <v-btn color="primary" @click="salvar" :loading="loading">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script>
  import { ref } from 'vue';
  import http from '@/services/http.js';
  import { useAuth } from '@/stores/auth.js';
  
  export default {
    name: 'NovoSetor',
    props: {
      dialog: Boolean,
      isEdit: Boolean,
      setor: Object,
    },
    setup(props, { emit }) {
      const auth = useAuth();
      const bearer = `Bearer ${auth.token}`;
      const descricao = ref(props.setor ? props.setor.descricao : '');
      const loading = ref(false);
      const isFormValid = ref(false);
      const form = ref(null);
  
      const rules = {
        required: value => !!value || 'Este campo é obrigatório',
      };
  
      const fecharDialog = () => {
        emit('fechar-dialog');
      };
  
      const salvar = async () => {
        form.value.validate();
        if (!isFormValid.value) {
          alert('Por favor, preencha todos os campos obrigatórios corretamente.');
          return;
        }
  
        loading.value = true;
        try {
          if (props.isEdit) {
            await http.put(`/setores/${props.setor.id}`, { descricao: descricao.value }, {
              headers: { Authorization: bearer }
            });
          } else {
            await http.post('/setores', { descricao: descricao.value }, {
              headers: { Authorization: bearer }
            });
          }
          emit('setor-salvo');
          fecharDialog();
        } catch (error) {
          console.error('Erro ao salvar setor:', error);
          alert(`Erro ao salvar setor: ${error.response?.data?.error || error.message}`);
        } finally {
          loading.value = false;
        }
      };
  
      return {
        descricao,
        loading,
        isFormValid,
        rules,
        form,
        fecharDialog,
        salvar
      };
    },
  };
  </script>
  
  <style scoped>
  .full-width {
    width: 100%;
  }
  .mb-2 {
    margin-bottom: 16px;
  }
  </style>
  