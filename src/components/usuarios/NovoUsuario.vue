<template>
  <v-card prepend-icon="mdi-account" title="Novo Usuário">
    <v-form ref="form" v-model="isFormValid">
      <v-card-text>
        <v-alert v-if="alertMessage" type="error" dense dismissible>
          {{ alertMessage }}
          <template v-slot:close>
            <v-btn icon @click="alertMessage = ''">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-alert>
        <v-row dense justify="center">
          <v-col cols="12" class="d-flex flex-column align-center">
            <v-avatar
              size="120"
              class="mb-2 profile-avatar"
              @click="triggerFileInput"
              style="cursor: pointer; position: relative;"
            >
              <img :src="profileImage || profilePic" class="profile-image"/>
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
          <v-col cols="12">
            <v-text-field
              v-model="nome"
              label="Nome"
              :rules="[rules.required]"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="sobrenome"
              label="Sobrenome"
              :rules="[rules.required]"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              :rules="[rules.required, rules.email]"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="password"
              label="Senha"
              type="password"
              :rules="[rules.required]"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-autocomplete
              v-model="selectedSetor"
              label="Setor"
              :items="setores"
              item-title="descricao"
              item-value="id"
              dense
              v-if="setores.length > 0"
              :rules="[rules.required]"
              required
            ></v-autocomplete>
          </v-col>
          <v-col cols="12">
            <v-autocomplete
              v-model="selectedCargo"
              :items="cargos"
              item-title="descricao"
              item-value="id"
              label="Cargo"
              dense
              v-if="cargos.length > 0"
              :rules="[rules.required]"
              required
            ></v-autocomplete>
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="selectedNivelAcesso"
              :items="accessLevels"
              label="Nível de Acesso"
              :rules="[rules.required]"
              required
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="fecharDialog">Close</v-btn>
        <v-btn color="primary" @click="salvar" :loading="loading">Save</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { ref, onMounted } from 'vue';
import http from '@/services/http.js'; // Importe o objeto http
import { useAuth } from '@/stores/auth.js';
import profilePic from '@/assets/newProfilePic.png';

export default {
  name: 'NovoChamado',
  props: {
    dialog: Boolean,
  },
  setup(props, { emit }) {
    const auth = useAuth();
    const bearer = `Bearer ${auth.token}`;

    const nome = ref('');
    const sobrenome = ref('');
    const email = ref('');
    const password = ref('');
    const selectedSetor = ref(null);
    const selectedCargo = ref(null);
    const selectedNivelAcesso = ref(null);
    const accessLevels = ref(['admin', 'supervisor', 'tecnico', 'default']);
    const setores = ref([]);
    const cargos = ref([]);
    const loading = ref(false);
    const isFormValid = ref(false);
    const form = ref(null);
    const alertMessage = ref('');
    const profileImage = ref('');
    const profileImageFile = ref(null);

    const rules = {
      required: value => !!value || 'Este campo é obrigatório',
      email: value => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(value) || 'E-mail inválido';
      }
    };

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

    const salvar = async () => {
      form.value.validate();
      if (!isFormValid.value) {
        alertMessage.value = 'Por favor, preencha todos os campos obrigatórios corretamente.';
        return;
      }

      loading.value = true;
      try {
        const formData = new FormData();
        formData.append('nome', nome.value);
        formData.append('sobrenome', sobrenome.value);
        formData.append('email', email.value);
        formData.append('password', password.value);
        formData.append('setor', selectedSetor.value);
        formData.append('cargo', selectedCargo.value);
        formData.append('acesso', selectedNivelAcesso.value);
        formData.append('profileImage', profileImageFile.value); // Use profileImageFile em vez de profileImage

        const response = await http.post('/user', formData, {
          headers: { 
            Authorization: bearer,
            'Content-Type': 'multipart/form-data' // Importante para enviar arquivos via FormData
          }
        });

        console.log('Usuário cadastrado com sucesso:', response.data);
        emit('usuario-cadastrado');
        fecharDialog();
      } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        alertMessage.value = `Erro ao cadastrar usuário: ${error.response?.data?.error || error.message}`;
      } finally {
        loading.value = false;
      }
    };

    const onImageChange = event => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          profileImage.value = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };

    const triggerFileInput = () => {
      document.querySelector('input[type="file"]').click();
    };

    return {
      nome,
      sobrenome,
      email,
      password,
      selectedSetor,
      selectedCargo,
      selectedNivelAcesso,
      accessLevels,
      setores,
      cargos,
      loading,
      isFormValid,
      rules,
      form,
      alertMessage,
      profileImage,
      profileImageFile,
      fecharDialog,
      salvar,
      onImageChange,
      triggerFileInput,
      profilePic
    };
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
.profile-description {
  font-size: 0.8em;
  color: #888;
  text-align: center;
}
.full-width {
  width: 100%;
}
.mb-2 {
  margin-bottom: 16px;
}
</style>
