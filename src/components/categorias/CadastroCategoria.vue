<template>
    <v-card>
      <v-card-title>{{ isEdit ? 'Editar Categoria' : 'Cadastrar Categoria' }}</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="isFormValid">
          <v-text-field
            v-model="categoriaCopy.descricao"
            label="Descrição"
            :rules="[rules.required]"
            required
          ></v-text-field>
          <v-text-field
            v-model="categoriaCopy.cor"
            label="Cor"
            readonly
            :rules="[rules.required]"
            append-icon="mdi-palette"
            @click:append="colorPickerVisible = true"
          ></v-text-field>
          <v-dialog
            v-model="colorPickerVisible"
            persistent
            max-width="350px"
            draggable
          >
            <v-card>
              <v-card-title>
                <span class="headline">Selecionar Cor</span>
              </v-card-title>
              <v-card-text>
                <v-color-picker v-model="categoriaCopy.cor" flat></v-color-picker>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="colorPickerVisible = false">Cancelar</v-btn>
                <v-btn color="primary" @click="colorPickerVisible = false">OK</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
    name: 'CadastroCategoria',
    props: {
      dialog: Boolean,
      isEdit: Boolean,
      categoria: Object,
    },
    setup(props, { emit }) {
      const auth = useAuth();
      const bearer = `Bearer ${auth.token}`;
      const loading = ref(false);
      const isFormValid = ref(false);
      const form = ref(null);
      const colorPickerVisible = ref(false);
      const categoriaCopy = ref({
        descricao: '',
        cor: '#FFFFFF' // Valor padrão para a cor
      });
  
      const rules = {
        required: value => !!value || 'Este campo é obrigatório',
      };
  
      const fecharDialog = () => {
        emit('fechar-dialog');
      };
  
      watch(() => props.categoria, (newCategoria) => {
        if (newCategoria) {
          categoriaCopy.value = { ...newCategoria };
        }
      });
  
      onMounted(() => {
        if (props.categoria) {
          categoriaCopy.value = { ...props.categoria };
        }
      });
  
      const salvar = async () => {
        form.value.validate();
        if (!isFormValid.value) {
          
          return;
        }
        console.log('Categoria:', JSON.stringify(categoriaCopy.value));
        loading.value = true;
        try {
          if (props.isEdit) {
            await http.put(`/categoria/${props.categoria.id}`, categoriaCopy.value, {
              headers: { Authorization: bearer }
            });
          } else {
            await http.post('/categoria', categoriaCopy.value, {
              headers: { Authorization: bearer }
            });
          }
          fecharDialog();
          emit('categoria-salvo');
        } catch (error) {
          console.error('Erro ao salvar categoria:', error);
          alert(`Erro ao salvar categoria: ${error.response?.data?.error || error.message}`);
        } finally {
          loading.value = false;
        }
      };
  
      const getContrastingColor = (hexColor) => {
        if (!hexColor) return '#000000';
        hexColor = hexColor.replace('#', '');
        const r = parseInt(hexColor.substring(0, 2), 16);
        const g = parseInt(hexColor.substring(2, 4), 16);
        const b = parseInt(hexColor.substring(4, 6), 16);
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 128 ? '#000000' : '#FFFFFF';
      };
  
      return {
        loading,
        isFormValid,
        rules,
        form,
        fecharDialog,
        salvar,
        categoriaCopy,
        colorPickerVisible,
        getContrastingColor
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
  