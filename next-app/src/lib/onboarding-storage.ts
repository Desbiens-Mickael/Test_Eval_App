/**
 * Mémoire de l'accueil (visite guidée vue, « Premiers pas » masqués), propre à
 * chaque compte et à chaque navigateur. Sans stockage disponible (navigation
 * privée, cookies bloqués…), rien n'est retenu : l'accueil revient, sans gêne.
 */
const PREFIX = "educraft:onboarding:v1";

export const onboardingKey = (name: string, userId: string) =>
  `${PREFIX}:${name}:${userId}`;

export const readOnboardingFlag = (key: string): boolean => {
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
};

export const writeOnboardingFlag = (key: string, value: boolean) => {
  try {
    if (value) localStorage.setItem(key, "1");
    else localStorage.removeItem(key);
  } catch {
    // Stockage indisponible : sans conséquence
  }
};
