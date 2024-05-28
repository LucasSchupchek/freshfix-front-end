<template>
  <v-dialog :model-value="isOpen" @update:model-value="updateIsOpen" max-width="600px">
    <v-card>
      <v-card-title>
        Editar Usuário
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        <v-col cols="12" class="d-flex flex-column align-center">
          <v-avatar
            size="120"
            class="mb-2 profile-avatar"
            @click="triggerFileInput"
            style="cursor: pointer; position: relative;"
          >
            <img :src="profileImage || userCopy.path_avatar || profilePic" class="profile-image"/>
            <v-file-input
              ref="fileInput"
              v-model="profileImageFile"
              accept="image/*"
              @change="onImageChange"
              style="opacity: 0; position: absolute; top: 0; left: 0; width: 100%; height: 100%; cursor: pointer;"
            ></v-file-input>
          </v-avatar>
          <small class="profile-description">Adicionar imagem de perfil</small>
        </v-col>
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
import profilePic from '@/assets/newProfilePic.png';

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
    const profileImageFile = ref(null); // Adicionando o profileImageFile
    const profileImage = ref(null); // Adicionando o profileImage

    onMounted(async () => {
      await loadSetores();
      await loadCargos();
    });

    const loadSetores = async () => {
      try {
        const response = await http.get('/setores', {
          headers: { Authorization: bearer }
        });
        setores.value = response.data.result.data.map(item => ({ id: item.id, descricao: item.descricao }));
      } catch (error) {
        console.error('Erro ao carregar opções de setor:', error);
      }
    };

    const loadCargos = async () => {
      try {
        const response = await http.get('/cargos', {
          headers: { Authorization: bearer }
        });
        cargos.value = response.data.result.data.map(item => ({ id: item.id, descricao: item.descricao }));
      } catch (error) {
        console.error('Erro ao carregar opções de cargos:', error);
      }
    };

    const fecharDialog = () => {
      emit('fechar-dialog');
    };

    const saveUser = async () => {
      try {
        const formData = new FormData();
        
        // Adicione os dados do usuário ao formulário
        Object.keys(userCopy.value).forEach(key => {
          formData.append(key, userCopy.value[key]);
        });
        // Adicione a nova imagem ao formulário
        formData.append('path_avatar', profileImageFile.value);

        // Enviar solicitação PUT para atualizar o usuário
        const response = await http.put(`/user/${userCopy.value.id}`, formData, {
          headers: { 
            Authorization: bearer,
            'Content-Type': 'multipart/form-data' // Defina o tipo de conteúdo como multipart/form-data
          }
        });

        console.log('Usuário atualizado com sucesso:', response.data);
                
        // Fechar o diálogo
        fecharDialog();
        
      } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
      }
    };

    const onImageChange = event => {
      const file = event.target.files[0];
      if (file) {
        // Atualize a referência para o arquivo de imagem
        profileImageFile.value = file;

        // Atualize a imagem do usuário na visualização
        const reader = new FileReader();
        reader.onload = e => {
          profileImage.value = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };

    watch(() => props.user, (newUser) => {
      // Atualize o userCopy ao receber uma nova propriedade de usuário
      userCopy.value = { ...newUser };
    });

    return { userCopy, setores, cargos, saveUser, fecharDialog, loading, profilePic, profileImage, onImageChange, profileImageFile };
  },
  methods: {
    async updateIsOpen(value) {
      this.$emit('update:isOpen', value);
      if (value) {
        await this.loadSetorOptions();
        await this.loadSetorOptions();
        await this.loadCargoOptions();
      }
    },
  },
};
</script>

<style scoped>
.profile-avatar {
  transition: transform 0.3s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}
.profile-avatar:hover {
  transform: scale(1.1);
}
.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
</style>
