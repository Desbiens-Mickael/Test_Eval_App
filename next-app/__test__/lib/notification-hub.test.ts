/**
 * @jest-environment node
 */
import { listenerCount, publishNotification, subscribeToNotifications } from "@/lib/notification-hub";
import { createSharedTicker } from "@/lib/shared-ticker";

describe("notification-hub", () => {
  it("ne prévient que le destinataire concerné", () => {
    const lea = jest.fn();
    const prof = jest.fn();
    const stopLea = subscribeToNotifications({ kind: "student", id: "s1" }, lea);
    const stopProf = subscribeToNotifications({ kind: "teacher", id: "s1" }, prof);

    publishNotification([{ kind: "student", id: "s1" }, { kind: "student", id: "s2" }]);
    expect(lea).toHaveBeenCalledTimes(1);
    // Même identifiant mais autre rôle : pas de mélange
    expect(prof).not.toHaveBeenCalled();

    stopLea();
    stopProf();
    publishNotification([{ kind: "student", id: "s1" }]);
    expect(lea).toHaveBeenCalledTimes(1);
    expect(listenerCount({ kind: "student", id: "s1" })).toBe(0);
  });
});

describe("createSharedTicker", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("tourne tant qu'au moins un utilisateur en a besoin", async () => {
    const task = jest.fn().mockResolvedValue(undefined);
    const ticker = createSharedTicker(task, 1000);

    const release1 = ticker.acquire();
    const release2 = ticker.acquire();
    await jest.advanceTimersByTimeAsync(3000);
    // Un seul minuteur, même avec deux utilisateurs
    expect(task).toHaveBeenCalledTimes(3);

    release1();
    release1(); // une double libération ne compte qu'une fois
    expect(ticker.users).toBe(1);
    await jest.advanceTimersByTimeAsync(1000);
    expect(task).toHaveBeenCalledTimes(4);

    release2();
    await jest.advanceTimersByTimeAsync(5000);
    expect(task).toHaveBeenCalledTimes(4);
  });

  it("ne relance pas la tâche tant que la précédente n'est pas finie", async () => {
    let finish = () => {};
    const task = jest.fn(() => new Promise<void>((resolve) => (finish = resolve)));
    const release = createSharedTicker(task, 1000).acquire();
    await jest.advanceTimersByTimeAsync(3000);
    expect(task).toHaveBeenCalledTimes(1);
    finish();
    await jest.advanceTimersByTimeAsync(1000);
    expect(task).toHaveBeenCalledTimes(2);
    release();
  });
});
