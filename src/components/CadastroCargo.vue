<template>
    <v-card>
      <v-card-title>{{ isEdit ? 'Editar Cargo' : 'Cadastrar Cargo' }}</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="isFormValid">
          <v-text-field
            v-model="cargoCopy.descricao"
            label="Descrição"
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
  import { ref, watch, onMounted } from 'vue';
  import http from '@/services/http.js';
  import { useAuth } from '@/stores/auth.js';
  
  export default {
    name: 'CadastroCargo',
    props: {
      dialog: Boolean,
      isEdit: Boolean,
      cargo: Object,
    },
    setup(props, { emit }) {
      const auth = useAuth();
      const bearer = `Bearer ${auth.token}`;
      const loading = ref(false);
      const isFormValid = ref(false);
      const form = ref(null);
      const cargoCopy = ref({
        descricao: ''
      });
  
      const rules = {
        required: value => !!value || 'Este campo é obrigatório',
      };
  
      const fecharDialog = () => {
        emit('fechar-dialog');
      };
  
      watch(() => props.cargo, (newCargo) => {
        if (newCargo) {
          cargoCopy.value = { ...newCargo };
        }
      });
  
      onMounted(() => {
        if (props.cargo) {
          cargoCopy.value = { ...props.cargo };
        }
      });
  
      const salvar = async () => {
        form.value.validate();
        if (!isFormValid.value) {
          alert('Por favor, preencha todos os campos obrigatórios corretamente.');
          return;
        }
        console.log('valooorororo' + JSON.stringify(cargoCopy.value))
        loading.value = true;
        try {
          if (props.isEdit) {
            await http.put(`/cargo/${props.cargo.id}`, cargoCopy.value, {
              headers: { Authorization: bearer }
            });
          } else {
            await http.post('/cargo', cargoCopy.value, {
              headers: { Authorization: bearer }
            });
          }
          fecharDialog();
          emit('cargo-salvo');
        } catch (error) {
          console.error('Erro ao salvar cargo:', error);
          alert(`Erro ao salvar cargo: ${error.response?.data?.error || error.message}`);
        } finally {
          loading.value = false;
        }
      };
  
      return {
        loading,
        isFormValid,
        rules,
        form,
        fecharDialog,
        salvar,
        cargoCopy
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
  