<template>
    <v-main>
      <v-container>
        <h2>Meu chamados</h2>
        <h1>{{ permissao }}</h1>
        <v-expansion-panels>
            <v-expansion-panel
                title="Title"
                text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus! Eaque cupiditate minima"
            >
            </v-expansion-panel>
        </v-expansion-panels>
      </v-container>
    </v-main>
  </template>
  
  <script>
  import { useAuth } from '@/stores/auth.js'
  import { computed } from 'vue'
  
  export default {
    setup() {
      const auth = useAuth();
      const permissao = computed(() => auth.permission);
      return {
        permissao
      };
    }
  }
  </script>
  
  <style>
  
  </style>
  