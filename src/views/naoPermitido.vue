<template>
    <v-main>
      <v-container>
        <h2>NÃO PERMITIDO</h2>
        <h1>{{ permissao }}</h1>
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
  