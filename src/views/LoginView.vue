<template>
  <div id="login-page">
    <div id="container">
      <h1 class="title">FreshFix</h1>
      <div class="subtitle">
        <p class="titulos">Login</p>
      </div>
      <form @submit.prevent="login" class="login-form">
        <div v-if="errorMessage" class="error-alert">
          {{ errorMessage }}
        </div>
        <div class="form-group">
          <v-text-field v-model="user.email" label="Usuario" outlined></v-text-field>
        </div>
        <div class="form-group">
          <v-text-field v-model="user.password" label="Senha" type="password" outlined></v-text-field>
        </div>
        <v-btn color="primary" dark type="submit">Login</v-btn>
      </form>
    </div>
  </div>
</template>

<script setup>
import http from '@/services/http.js'
import { reactive, ref } from 'vue';
import { useAuth } from '@/stores/auth.js'
import { useRouter } from 'vue-router';

const auth = useAuth();
const router = useRouter();
const errorMessage = ref('');
const user = reactive({
  email: '',
  password: ''
});

async function login() {
  try {
    console.log('VITE_HOST_API:', import.meta.env.VITE_HOST_API);
    console.log('VITE_HOST_API:', process.env.VITE_HOST_API);
    const data = await http.post('/login', {
      user: user.email,
      password: user.password
    });

    auth.setToken(data.data.result.token);
    auth.setUser(data.data.result.user);
    auth.setProfilePath(data.data.result.ProfilePath);

    if (auth.permission === 'admin') {
      router.push({ name: 'dashboard' });
    } else {
      router.push({ name: 'meusChamados' });
    }
  } catch (error) {
    errorMessage.value = error?.response?.data?.error || 'Erro ao fazer login, por favor tente novamente.';
  }
}
</script>

<style scoped>
/* Estilos básicos */
#login-page {
  background-color: #EDEFF1;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

#container {
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px 0px;
  max-width: 400px;
  width: 100%;
}

.title {
  text-align: center;
  margin-bottom: 20px;
  color: #5459F3;
}

.subtitle {
  text-align: center;
  margin-bottom: 20px;
}

.login-form {
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.error-alert {
  color: red;
  margin-bottom: 20px;
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .title {
    font-size: 24px;
  }

  .subtitle {
    font-size: 18px;
  }

  .form-group v-text-field {
    width: 100%;
  }

  .forgot-password-link {
    margin-top: 40px;
  }
}
</style>
