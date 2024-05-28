<template>
    <v-app-bar flat class="border-b">
      <v-app-bar-nav-icon @click="isDrawerOpen = !isDrawerOpen"></v-app-bar-nav-icon>
      <v-app-bar-title>FreshFix</v-app-bar-title>

      <template #append>
        <v-btn icon class="mr-2">
          <v-badge dot color="info">
            <v-icon icon="mdi-bell-outline"></v-icon>
          </v-badge>
        </v-btn>

        <v-menu>
          <template #activator="{ props }">
            <v-avatar class="cursor-pointer" v-bind="props">
              <v-img
                cover
                src="https://thumbs.dreamstime.com/z/nerd-portrait-young-cheerful-businessman-smiling-36201399.jpg"
              ></v-img>
            </v-avatar>
          </template>

          <v-card min-width="200px">
            <v-list :lines="false" dense nav>
              <v-list-item>
                <v-btn text block @click="goToProfile">
                  <v-list-item-icon>
                    <v-icon>mdi-account-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                      <v-list-item-title>Meu perfil</v-list-item-title>
                    </v-list-item-content>
                </v-btn>
              </v-list-item>

              <v-list-item>
                <v-btn text block @click="logout">
                  <v-list-item-icon>
                    <v-icon>mdi mdi-logout</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Sair</v-list-item-title>
                  </v-list-item-content>
                </v-btn>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </template>
    </v-app-bar>

</template>
<script>
import { isDrawerOpen } from '@/stores/stores';
import { useAuth } from '@/stores/auth.js'
import { createPinia } from 'pinia'
import { useRouter } from 'vue-router';
import { watch } from 'vue';

export default {
  name: "Header",
  setup() {
    const pinia = createPinia()
    const auth = useAuth(pinia);
    const router = useRouter();

    function logout() {
      console.log("Logout function called"); // Adicione esta linha
      auth.clear();
      if (router) {
        // router.push({ name: "login" });
        window.location.reload();
      } else {
        console.error("Router não está disponível.");
      }
    };

    // Aqui está o bloco de watch
    watch(auth.isAuthenticated, (newValue) => {
      if (!newValue) {
        // Se o usuário não estiver autenticado, feche a barra lateral
        isDrawerOpen.value = false;
      }
    });

    return {
      isDrawerOpen,
      logout
    }
  },
};
</script>


<style scoped>

</style>
