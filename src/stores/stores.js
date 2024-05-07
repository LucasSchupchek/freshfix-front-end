import { ref } from 'vue';
import { useAuth } from '@/stores/auth.js'
import { createPinia } from 'pinia'
const pinia = createPinia()
const auth = useAuth(pinia);

export const isDrawerOpen = ref(false);
export const bearer = `Bearer ${auth.token}`;