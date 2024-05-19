import { useAuth } from "@/stores/auth.js";

export default async function routes(to, from, next) {
  const auth = useAuth();

  if (to.meta?.auth) {
    if (auth.token && auth.user) {
      const isAuthenticated = await auth.checkToken(); // Use `await` para garantir a verificação assíncrona
      if (isAuthenticated) {
        if (!to.meta.grants || hasRequiredGrants(auth.permission, to.meta.grants)) {
          if (auth.permission === 'default' && to.name !== 'meusChamados') {
            return next({ name: "meusChamados" });
          }
          return next();
        } else {
          return next({ name: "naoPermitido" });
        }
      }
    }
    return next({ name: "login" });
  } else {
    return next();
  }
}

function hasRequiredGrants(userPermission, requiredGrants) {
  return requiredGrants.includes(userPermission);
}
