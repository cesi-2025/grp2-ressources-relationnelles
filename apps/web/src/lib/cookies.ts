
const COOKIE_OPTIONS = 'path=/; SameSite=Strict; max-age=86400'; // 24h
 
export const authCookies = {
  set: (token: string, role: string) => {
    document.cookie = `sanctum_token=${token}; ${COOKIE_OPTIONS}`;
    document.cookie = `user_role=${role}; ${COOKIE_OPTIONS}`;
  },
  remove: () => {
    document.cookie = 'sanctum_token=; path=/; max-age=0';
    document.cookie = 'user_role=; path=/; max-age=0';
  },
};
 