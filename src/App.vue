<template>
  <v-app theme="light">
    <Header v-show="auth.isAuthenticated"/>
    <Sidebar :permission="auth.permission" v-show="auth.isAuthenticated"/>
    <router-view/>
  </v-app>
</template>

<script setup>
import { useAuth } from '@/stores/auth.js'

import Sidebar from './components/app/Sidebar.vue';
import Header from './components/app/Header.vue';
const auth = useAuth();

</script>