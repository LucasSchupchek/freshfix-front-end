<template>
  <v-dialog :model-value="isOpen" @update:model-value="updateIsOpen" max-width="600px">
    <v-card>
      <v-card-title>
        Editar Usuário
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field v-model="userCopy.nome" label="Nome"></v-text-field>
          <v-text-field v-model="userCopy.sobrenome" label="Sobrenome"></v-text-field>
          <v-text-field v-model="userCopy.email" label="Email"></v-text-field>
          <v-text-field v-model="userCopy.username" label="Username"></v-text-field>
          <v-select v-model="userCopy.nivel_acesso" :items="accessLevels" label="Nível de Acesso"></v-select>
          <v-autocomplete
            v-model="userCopy.setor"
            label="Setor"
            :items="setores"
            item-title="descricao"
            item-value="id"
            dense
            v-if="setores.length > 0"
          ></v-autocomplete>
          <v-autocomplete
            v-model="userCopy.cargo"
            :items="cargos"
            item-title="descricao"
            item-value="id"
            label="Cargo"
            dense
            v-if="cargos.length > 0"
          ></v-autocomplete>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue darken-1" text @click="fecharDialog">Cancelar</v-btn>
        <v-btn color="blue darken-1" text @click="saveUser" :loading="loading">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import http from '@/services/http.js';
import { useAuth } from '@/stores/auth.js';
import { ref, onMounted, watch } from 'vue';

export default {
  props: {
    isOpen: Boolean,
    user: Object,
    accessLevels: Array,
    itemsPerPage: Number
  },
  emits: ['fechar-dialog'],
  setup(props, { emit }) {
    const auth = useAuth();
    const bearer = `Bearer ${auth.token}`;

    const userCopy = ref({ ...props.user });
    const setores = ref([]);
    const cargos = ref([]);
    const loading = ref(false); // Adicionando a variável loading

    onMounted(async () => {
      await loadSetores();
      await loadCargos();
    });

    const loadSetores = async () => {
      try {
        const response = await http.get('/setores', {
          headers: { Authorization: bearer }
        });
        setores.value = response.data.result.map(item => ({ id: item.id, descricao: item.descricao }));
      } catch (error) {
        console.error('Erro ao carregar opções de setor:', error);
      }
    };

    const loadCargos = async () => {
      try {
        const response = await http.get('/cargos', {
          headers: { Authorization: bearer }
        });
        cargos.value = response.data.result.map(item => ({ id: item.id, descricao: item.descricao }));
      } catch (error) {
        console.error('Erro ao carregar opções de cargos:', error);
      }
    };

    const fecharDialog = () => {
      emit('fechar-dialog');
    };

    const saveUser = async () => {
      try {
        // Verificar se a descrição do setor foi alterada
        const setorSelecionado = setores.value.find(setor => setor.descricao === userCopy.value.setor);
        const setorId = setorSelecionado ? setorSelecionado.id : userCopy.value.setor;

        // Verificar se a descrição do cargo foi alterada
        const cargoSelecionado = cargos.value.find(cargo => cargo.descricao === userCopy.value.cargo);
        const cargoId = cargoSelecionado ? cargoSelecionado.id : userCopy.value.cargo;

        // Atualizar userCopy com os IDs correspondentes
        userCopy.value.setor = setorId;
        userCopy.value.cargo = cargoId;

        // Enviar solicitação PUT para atualizar o usuário
        const response = await http.put(`/user/${userCopy.value.id}`, userCopy.value, {
          headers: { Authorization: bearer }
        });

        console.log('Usuário atualizado com sucesso:', response.data);
                
        // Fechar o diálogo
        fecharDialog();
        
      } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
      }
    };

    watch(() => props.user, (newUser) => {
      userCopy.value = { ...newUser };
    });

    return { userCopy, setores, cargos, saveUser, fecharDialog, loading };
  },

  methods: {
    async updateIsOpen(value) {
      this.$emit('update:isOpen', value);
      if (value) {
        await this.loadSetorOptions();
        await this.loadCargoOptions();
      }
    }
  }
};
</script>