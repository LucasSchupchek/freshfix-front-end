<template>
  <div id="login-page">
    <div id="container">
      <h1 class="title">FreshFix</h1>
      <div class="subtitle">
        <p class="titulos">Login</p>
      </div>
      <button @click="toggleUserCredentials">Alternar Credenciais</button>
      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" type="text" placeholder="Seu E-mail" v-model="user.email">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" type="password" placeholder="Sua Senha" v-model="user.password">
        </div>
        <button type="submit">Login</button>
      </form>
      <a href="/" class="forgot-password-link">Esqueceu sua senha?</a>
    </div>
  </div>
</template>

<script setup>
import http from '@/services/http.js'
import { reactive } from 'vue';
import { useAuth } from '@/stores/auth.js'
import { useRouter } from 'vue-router';

const auth = useAuth();
const router = useRouter();

let user = reactive({
  email: 'lucas',
  password: 'lucas123'
});

function toggleUserCredentials() {
  if (user.email === 'lucas') {
    user.email = 'teste';
    user.password = 'teste123';
  } else {
    user.email = 'lucas';
    user.password = 'lucas123';
  }
}

async function login() {
  try {
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
    console.log(error?.response?.data)
  }
}

</script>

<style scoped>
/* Estilos básicos */
#login-page {
  background-color: #5459F3;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

#container {
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset;
  max-width: 400px;
  width: 100%;
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.subtitle {
  text-align: center;
  margin-bottom: 20px;
}

.login-form {
  text-align: center;
}

.form-group {
  margin-bottom: 10px;
}

label {
  display: block;
  margin-bottom: 5px;
  text-align: left;
  color: #616161;
}

input {
  width: 100%;
  background-color: #FAFAFC;
  border: 1px solid #F0F0F4;
  padding: 10px;
  border-radius: 5px;
}

button {
  width: 100%;
  background-color: #5459F3;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 0;
  cursor: pointer;
}

button:hover {
  background-color: #3e43c4;
}

.forgot-password-link {
  display: block;
  margin-top: 35px;
  margin-bottom: 20px;
  text-align: center;
  color: #616161;
  text-decoration: none;
}

.forgot-password-link:hover {
  color: #3e43c4;
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .title {
    font-size: 24px;
  }

  .subtitle {
    font-size: 18px;
  }

  .form-group input {
    width: calc(100% - 20px);
  }

  button {
    width: calc(100% - 20px);
  }
}
</style>
