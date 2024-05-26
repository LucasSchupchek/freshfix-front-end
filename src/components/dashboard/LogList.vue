<template>
    <v-card class="log-card">
      <v-list>
        <v-list-item-group>
          <v-list-item v-for="log in logs" :key="log.timestamp">
            <v-list-item-content>
              <v-list-item-title>{{ log.user }}</v-list-item-title>
              <v-list-item-subtitle>{{ log.action }}</v-list-item-subtitle>
              <v-list-item-subtitle>{{ log.timestamp }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </template>
  
  <script>
  export default {
    name: 'LogList',
    props: {
      logs: {
        type: Array,
        default: () => []
      }
    }
  }
  </script>
  
  <style scoped>
  .log-card {
    width: 100%;
    max-height: 400px;
    overflow-y: auto;
  }
  </style>
  