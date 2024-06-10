<template>
  <v-app theme="light">
    <Header v-if="auth.isAuthenticated"/>
    <Sidebar :permission="auth.permission" v-if="auth.isAuthenticated"/>
    <router-view/>
  </v-app>
</template>

<script setup>
import { useAuth } from '@/stores/auth.js'

import Sidebar from './components/app/Sidebar.vue';
import Header from './components/app/Header.vue';
const auth = useAuth();

</script>

<style>
.custom-container {
  border-radius: 13px;
  padding: 16px;
  background-color: #ffffff;
}

.v-data-table {
  margin-top: 16px;
}

.no-borders .v-data-table-header th,
.no-borders .v-data-table tbody tr {
  border: none !important;
}

.no-borders .v-data-table-header {
  border-bottom: none !important;
}

.no-borders .v-data-table-header th {
  border-bottom: none !important;
}
</style>