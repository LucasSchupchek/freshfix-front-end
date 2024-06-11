<template>
  <v-card prepend-icon="mdi-account" title="Meu Perfil">
    <v-card-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text v-if="user">
      <v-alert v-if="alertMessage" type="error" dense dismissible>
        {{ alertMessage }}
        <template v-slot:close>
          <v-btn icon @click="alertMessage = ''">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-alert>
      <v-form ref="profileForm" v-model="isFormValid">
        <v-row dense justify="center">
          <v-col cols="12" class="d-flex flex-column align-center">
            <v-avatar
              size="120"
              class="mb-2 profile-avatar"
              @click="triggerFileInput"
              style="cursor: pointer; position: relative;"
            >
              <img :src="profileImage || user.path_avatar || profilePic" class="profile-image"/>
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
          <v-col cols="6">
            <v-text-field
              v-model="userCopy.nome"
              label="Nome"
              :rules="nameRules"
              :readonly="loading"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="userCopy.sobrenome"
              label="Sobrenome"
              :rules="nameRules"
              :readonly="loading"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="userCopy.email"
              label="Email"
              :rules="emailRules"
              :readonly="loading"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="userCopy.username" label="Username" readonly></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="userCopy.setor" label="Setor" readonly></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="userCopy.cargo" label="Cargo" readonly></v-text-field>
          </v-col>
        </v-row>
        <v-btn color="blue darken-1" text @click="openChangePasswordDialog">Mudar Senha</v-btn>
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="justify-end">
      <v-btn color="blue darken-1" text @click="$emit('close')">Cancelar</v-btn>
      <v-btn color="blue darken-1" text @click="saveProfile" :loading="loading" :disabled="!isFormValid">Salvar</v-btn>
    </v-card-actions>

    <!-- Dialog para mudar senha -->
    <v-dialog v-model="isChangePasswordDialogOpen" max-width="500px">
      <v-card>
        <v-card-title>Mudar Senha</v-card-title>
        <v-card-text>
          <v-form ref="changePasswordForm">
            <v-text-field v-model="currentPassword" label="Senha Atual" type="password"></v-text-field>
            <v-text-field v-model="newPassword" label="Nova Senha" type="password"></v-text-field>
            <v-text-field v-model="confirmPassword" label="Confirmar Nova Senha" type="password"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="blue darken-1" text @click="isChangePasswordDialogOpen = false">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="changePassword" :loading="loading">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import http from '@/services/http.js';
import { useAuth } from '@/stores/auth.js';
import { ref, onMounted, watch } from 'vue';
import profilePic from '@/assets/newProfilePic.png';

export default {
  name: 'UserProfile',
  props: {
    userId: Number
  },
  emits: ['close', 'profile-updated'],
  setup(props, { emit }) {
    const auth = useAuth();
    const bearer = `Bearer ${auth.token}`;

    const user = ref(null);
    const userCopy = ref({});
    const loading = ref(false);
    const profileImageFile = ref(null);
    const profileImage = ref(null);
    const currentPassword = ref('');
    const newPassword = ref('');
    const confirmPassword = ref('');
    const isChangePasswordDialogOpen = ref(false);
    const alertMessage = ref('');
    const isFormValid = ref(false);

    const nameRules = [
      v => !!v || 'Este campo é obrigatório',
    ];
    const emailRules = [
      v => !!v || 'Email é obrigatório',
      v => /.+@.+\..+/.test(v) || 'Email deve ser válido',
    ];

    onMounted(async () => {
      await fetchUserData();
    });

    const fetchUserData = async () => {
      try {
        const response = await http.get(`user/${props.userId}`, {
          headers: {
            Authorization: bearer
          }
        });
        user.value = response.data.result;
        userCopy.value = { ...response.data.result };
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const saveProfile = async () => {
      if (!isFormValid.value) return;

      try {
        loading.value = true;

        const formData = new FormData();
        if (profileImageFile.value) {
          formData.append('path_avatar', profileImageFile.value);
        }
        formData.append('nome', userCopy.value.nome);
        formData.append('sobrenome', userCopy.value.sobrenome);
        formData.append('email', userCopy.value.email);

        const response = await http.put(`/user/${userCopy.value.id}/profile`, formData, {
          headers: {
            Authorization: bearer,
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data.result.profile_path) {
          auth.setProfilePath(response.data.result.profile_path);
        }

        console.log('Perfil atualizado com sucesso:', response.data);
        await fetchUserData();
        emit('profile-updated');
        emit('close');
      } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
      } finally {
        loading.value = false;
      }
    };

    const changePassword = async () => {
      if (newPassword.value !== confirmPassword.value) {
        alertMessage.value = 'Nova senha e confirmação de senha não coincidem.';
        return;
      }

      try {
        loading.value = true;

        const response = await http.put(`/user/${userCopy.value.id}/password`, {
          currentPassword: currentPassword.value,
          newPassword: newPassword.value
        }, {
          headers: {
            Authorization: bearer
          }
        });

        console.log('Senha alterada com sucesso:', response.data);
        isChangePasswordDialogOpen.value = false;
      } catch (error) {
        console.error('Erro ao mudar a senha:', error);
      } finally {
        loading.value = false;
      }
    };

    const onImageChange = event => {
      const file = event.target.files[0];
      if (file) {
        profileImageFile.value = file;
        const reader = new FileReader();
        reader.onload = e => {
          profileImage.value = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };

    watch(() => props.userId, async (newUserId) => {
      if (newUserId) {
        await fetchUserData();
      }
    });

    return {
      user,
      userCopy,
      loading,
      profilePic,
      profileImage,
      profileImageFile,
      currentPassword,
      newPassword,
      confirmPassword,
      onImageChange,
      saveProfile,
      changePassword,
      isChangePasswordDialogOpen,
      alertMessage,
      isFormValid,
      nameRules,
      emailRules,
      openChangePasswordDialog: () => { isChangePasswordDialogOpen.value = true; },
      triggerFileInput: () => {
        const fileInput = this.$refs.fileInput;
        if (fileInput) {
          fileInput.click();
        }
      }
    };
  }
};
</script>

<style scoped>
.profile-avatar {
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-description {
  font-size: 12px;
  color: #888;
}
</style>
