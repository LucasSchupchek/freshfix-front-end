import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import http from '@/services/http.js'

export const useAuth = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token'));
    const user = ref(JSON.parse(localStorage.getItem("user")));

    function setToken(tokenValue) {
        localStorage.setItem('token', tokenValue);
        token.value = tokenValue;
    }

    function setUser(userValue) {
        localStorage.setItem('user', JSON.stringify(userValue));
        user.value = userValue;
      }

    const isAuthenticated = computed(() => {
        return token.value && user.value;
    })

    const fullName = computed(() => {
        if(user.value){
            return `${user.value.nome} ${user.value.sobrenome}`
        }
        return '';
    })

    const permission = computed(() => {
        if(user.value){
            return user.value.permission
        }
    })

    async function checkToken() {
        try {
            const tokenAuth = `Bearer ${token.value}`;
            console.log(tokenAuth)
            const {data} = await http.get('/verify', {
                headers: {
                    Authorization: tokenAuth
                }
            });
            console.log('data auth verify:' + data)
            return data;
        } catch(error) {
            console.log(error.response.data)
            clear()
        }
    }

    function clear(){
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        token.value = '';
        user.value = '';
    }

    return {
        setToken,
        setUser,
        token,
        user,
        checkToken,
        isAuthenticated,
        fullName,
        clear,
        permission
    }
})