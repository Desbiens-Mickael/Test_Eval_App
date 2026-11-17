/**
 * Tâche répétée tant qu'au moins un utilisateur en a besoin.
 *
 * `acquire()` démarre la répétition au premier appel et renvoie une fonction
 * de libération ; la répétition s'arrête quand tout a été libéré. Une
 * exécution n'est jamais lancée tant que la précédente n'est pas terminée.
 */
export const createSharedTicker = (task: () => Promise<unknown>, intervalMs: number) => {
  let users = 0;
  let timer: ReturnType<typeof setInterval> | undefined;
  let running = false;

  const tick = async () => {
    if (running) return;
    running = true;
    try {
      await task();
    } finally {
      running = false;
    }
  };

  return {
    acquire() {
      users += 1;
      if (users === 1) timer = setInterval(tick, intervalMs);
      let released = false;
      return () => {
        if (released) return;
        released = true;
        users -= 1;
        if (users === 0 && timer) {
          clearInterval(timer);
          timer = undefined;
        }
      };
    },
    get users() {
      return users;
    },
  };
};
