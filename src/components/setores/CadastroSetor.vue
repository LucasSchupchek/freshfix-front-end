<template>
  <v-card>
    <v-card-title>{{ isEdit ? 'Editar Setor' : 'Cadastrar Setor' }}</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="isFormValid">
        <v-text-field
          v-model="setorCopy.descricao"
          label="Descrição"
          :rules="[rules.required]"
          required
        ></v-text-field>
        <v-text-field
          v-model="setorCopy.localizacao"
          label="Localização"
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
import { ref, watch, onMounted } from 'vue';
import http from '@/services/http.js';
import { useAuth } from '@/stores/auth.js';

export default {
  name: 'CadastroSetor',
  props: {
    dialog: Boolean,
    isEdit: Boolean,
    setor: Object,
  },
  setup(props, { emit }) {
    const auth = useAuth();
    const bearer = `Bearer ${auth.token}`;
    const loading = ref(false);
    const isFormValid = ref(false);
    const form = ref(null);
    const setorCopy = ref({
      descricao: '',
      localizacao: ''
    });

    const rules = {
      required: value => !!value || 'Este campo é obrigatório',
    };

    const fecharDialog = () => {
      emit('fechar-dialog');
    };

    watch(() => props.setor, (newSetor) => {
      if (newSetor) {
        setorCopy.value = { ...newSetor };
      }
    });

    onMounted(() => {
      if (props.setor) {
        setorCopy.value = { ...props.setor };
      }
    });

    const salvar = async () => {
      form.value.validate();
      if (!isFormValid.value) {
  
        return;
      }
      loading.value = true;
      try {
        if (props.isEdit) {
          await http.put(`/setor/${props.setor.id}`, setorCopy.value, {
            headers: { Authorization: bearer }
          });
        } else {
          await http.post('/setor', setorCopy.value, {
            headers: { Authorization: bearer }
          });
        }
        fecharDialog();
        emit('setor-salvo');
      } catch (error) {
        alert(`Erro ao salvar setor: ${error.response?.data?.error || error.message}`);
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
      setorCopy
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
