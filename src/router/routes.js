import { useAuth } from "@/stores/auth.js";

export default async function routes(to, from, next) {
  if (to.meta?.auth) {
    const auth = useAuth();
    if (auth.token && auth.user) {
      const isAuthenticated = auth.checkToken();
      if (isAuthenticated){
        if (!to.meta.grants || hasRequiredGrants(auth.permission, to.meta.grants)) {
          next();
          if(auth.permission == 'default'){
            next({ name: "meusChamados" });
          }
        } else {
          next({ name: "naoPermitido" });
        }
      }
      else{
        next({ name: "login" });
      }
    } else {
      next({ name: "login" });
    }
  } else {
    next();
  }
}

function hasRequiredGrants(userPermission, requiredGrants) {
  // Verifica se o usuário tem pelo menos um dos privilégios necessários
  return requiredGrants.includes(userPermission);
}
