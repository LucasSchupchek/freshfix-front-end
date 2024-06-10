<template>
  <v-card prepend-icon="mdi-account" title="Novo Chamado">
    <v-alert v-if="alertMessage" type="error" dense dismissible>
      {{ alertMessage }}
      <template v-slot:close>
        <v-btn icon @click="alertMessage = ''">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-alert>

    <v-card-text>
      <v-row dense>
        <v-col cols="12">
          <v-text-field v-model="titulo" label="Titulo do chamado" required :counter="50"></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-autocomplete
            v-model="selectedCategoria"
            label="Categoria"
            :items="categoriaOptions"
            item-title="descricao"
            item-value="id"
            required
          ></v-autocomplete>
        </v-col>

        <v-col cols="12">
          <v-textarea v-model="descricao" label="Descrição" required></v-textarea>
        </v-col>

        <v-col cols="12">
          <v-file-input
            v-model="files"
            label="Anexos"
            prepend-icon="mdi-paperclip"
            multiple
            class="full-width"
          >
            <template v-slot:selection>
              <template v-for="file in files" :key="file.name">
                <v-chip class="me-2 mb-2 full-width" color="primary" size="small" label>{{ file.name }}</v-chip>
              </template>
            </template>
          </v-file-input>
        </v-col>
      </v-row>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="fecharDialog">Cancelar</v-btn>
      <v-btn color="primary" @click="salvar">Salvar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { ref, onMounted } from 'vue';
import http from '@/services/http.js'; // Importe o objeto http
import { useAuth } from '@/stores/auth.js';

export default {
  name: 'NovoChamado',
  props: {
    dialog: Boolean,
  },
  setup(props, { emit }) {
    const auth = useAuth();
    const bearer = `Bearer ${auth.token}`;

    const categoriaOptions = ref([]);
    const selectedCategoria = ref(null);
    const files = ref([]);
    const titulo = ref(''); // Definindo a variável titulo
    const descricao = ref(''); // Definindo a variável descricao
    const alertMessage = ref(''); // Variável para armazenar a mensagem de erro

    // Função para exibir a mensagem de erro na tela
    const mostrarErro = mensagem => {
      alertMessage.value = mensagem;
    };

    const listarCategorias = async () => {
      try {
        const response = await http.get('/categorias', {
          headers: {
            Authorization: bearer
          }
        });
        categoriaOptions.value = response.data.result.data.map(categoria => ({
          id: categoria.id,
          descricao: categoria.descricao
        }));
      } catch (error) {
        console.log(error.response.data);
      }
    };

    const fecharDialog = () => {
      emit('fechar-dialog');
    };

    const salvar = async () => {
      try {
        // Validação do título, da descrição e da categoria
        if (!titulo.value.trim() || !descricao.value.trim() || !selectedCategoria.value) {
          mostrarErro('O título, a descrição e a categoria são campos obrigatórios.');
          return;
        }

        if (titulo.value.length > 50) {
          mostrarErro('O título deve ter no máximo 50 caracteres.');
          return;
        }

        const formData = new FormData();
        formData.append('titulo', titulo.value);
        formData.append('descricao', descricao.value);
        formData.append('categoria', selectedCategoria.value);

        // Adiciona cada arquivo selecionado ao FormData
        for (const file of files.value) {
          formData.append('files', file);
        }

        await http.post('/chamado', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: bearer,
          },
        });

        // Limpa os campos após o envio bem-sucedido
        titulo.value = '';
        descricao.value = '';
        selectedCategoria.value = null;
        files.value = [];

        // Fecha o diálogo após salvar e emite o evento para recarregar os chamados
        emit('fechar-dialog');
      } catch (error) {
        console.error('Erro ao salvar o chamado:', error);

        // Exibe a mensagem de erro no alert
        mostrarErro(error.response?.data?.message || 'Ocorreu um erro ao salvar o chamado.');
      }
    };

    onMounted(() => {
      listarCategorias();
    });

    return { categoriaOptions, selectedCategoria, files, fecharDialog, salvar, titulo, descricao, alertMessage };
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
