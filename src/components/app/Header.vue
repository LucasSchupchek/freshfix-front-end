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

      <v-menu v-if="isUserLoggedIn">
        <template #activator="{ props }">
          <v-avatar class="cursor-pointer" v-bind="props">
            <v-img cover :src="computedImageUrl"></v-img>
          </v-avatar>
        </template>

        <v-card min-width="200px">
          <v-list :lines="false" dense nav>
            <v-list-item>
              <v-btn text block @click="openProfileDialog">
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

    <!-- Dialog para mostrar o perfil do usuário -->
    <v-dialog v-model="isProfileDialogOpen" max-width="500px">
      <UserProfile :userId="userId" @close="isProfileDialogOpen = false" @profile-updated="updateProfilePath"/>
    </v-dialog>
  </v-app-bar>
</template>

<script>
import { isDrawerOpen } from '@/stores/stores';
import { useAuth } from '@/stores/auth.js';
import { createPinia } from 'pinia';
import { useRouter } from 'vue-router';
import { watch, ref, computed, onMounted } from 'vue';
import UserProfile from './UserProfile.vue';

export default {
  name: "Header",
  components: {
    UserProfile
  },
  setup() {
    const pinia = createPinia();
    const auth = useAuth(pinia);
    const router = useRouter();
    const profilePath = ref(auth.ProfilePath);
    const isProfileDialogOpen = ref(false);

    const userId = computed(() => auth.user ? auth.user.id : null);
    const isUserLoggedIn = computed(() => !!auth.user);

    const openProfileDialog = () => {
      if (isUserLoggedIn.value) {
        isProfileDialogOpen.value = true;
      }
    };

    const logout = () => {
      console.log("Logout function called");
      auth.clear();
      if (router) {
        window.location.reload();
      } else {
        console.error("Router não está disponível.");
      }
    };

    // Observar mudanças no ProfilePath e atualizar o cabeçalho
    watch(
      () => auth.ProfilePath,
      (newValue) => {
        profilePath.value = newValue;
      }
    );

    onMounted(() => {
      if (auth.isAuthenticated) {
        isDrawerOpen.value = false;
      }
      
      userId.value = auth.user ? auth.user.id : null;
    });

    return {
      isDrawerOpen,
      logout,
      profilePath,
      openProfileDialog,
      isProfileDialogOpen,
      userId,
      isUserLoggedIn
    };
  },
  computed: {
    computedImageUrl() {
      return this.profilePath || '/path/to/default/image.png'; // Imagem padrão se não houver ProfilePath
    }
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
