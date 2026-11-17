import {
  ACCOUNT_POLICY,
  ThrottleState,
  accountKey,
  ipKey,
  lockMessage,
  lockRemainingMs,
  nextStateAfterFailure,
} from "@/lib/login-throttle";

const policy = { maxFailures: 3, windowMs: 10_000, lockMs: 60_000 };
const t = (ms: number) => new Date(Date.UTC(2026, 10, 17) + ms);

const fail = (state: ThrottleState | null, at: number) =>
  nextStateAfterFailure(state, policy, t(at));

describe("nextStateAfterFailure", () => {
  it("bloque au seuil d'échecs dans la fenêtre", () => {
    let state = fail(null, 0);
    state = fail(state, 1000);
    expect(state.lockedUntil).toBeNull();
    state = fail(state, 2000);
    expect(state.failures).toBe(3);
    expect(state.lockedUntil).toEqual(t(2000 + 60_000));
  });

  it("repart de zéro quand la fenêtre est passée", () => {
    let state = fail(null, 0);
    state = fail(state, 1000);
    state = fail(state, 20_000);
    expect(state).toMatchObject({ failures: 1, lockedUntil: null });
    expect(state.windowStart).toEqual(t(20_000));
  });

  it("repart de zéro après la fin d'un blocage", () => {
    let state = fail(fail(fail(null, 0), 1), 2);
    expect(lockRemainingMs(state, t(30_000))).toBeGreaterThan(0);
    // Le blocage a duré 60 s : l'échec suivant ouvre une fenêtre neuve
    state = fail(state, 70_000);
    expect(state).toMatchObject({ failures: 1, lockedUntil: null });
  });

  it("la politique par compte bloque au 5e échec", () => {
    let state: ThrottleState | null = null;
    for (let i = 0; i < 4; i++) state = nextStateAfterFailure(state, ACCOUNT_POLICY, t(i));
    expect(state?.lockedUntil).toBeNull();
    state = nextStateAfterFailure(state, ACCOUNT_POLICY, t(5));
    expect(state.lockedUntil).not.toBeNull();
  });
});

describe("lockRemainingMs", () => {
  it("vaut 0 sans blocage ou après la fin du blocage", () => {
    expect(lockRemainingMs(null)).toBe(0);
    expect(lockRemainingMs({ lockedUntil: t(1000) }, t(2000))).toBe(0);
    expect(lockRemainingMs({ lockedUntil: t(5000) }, t(2000))).toBe(3000);
  });
});

describe("clés et message", () => {
  it("normalise la clé d'un compte", () => {
    expect(accountKey("student", "  Demo.Hugo ")).toBe("student:demo.hugo");
    expect(accountKey("user", "Prof@Mail.fr")).toBe("user:prof@mail.fr");
  });

  it("ignore une IP inconnue", () => {
    expect(ipKey(null)).toBeNull();
    expect(ipKey("1.2.3.4")).toBe("ip:1.2.3.4");
  });

  it("indique le temps d'attente arrondi à la minute supérieure", () => {
    expect(lockMessage(61_000, "student")).toBe(
      "Trop de tentatives de connexion. Réessaie dans 2 minutes."
    );
    expect(lockMessage(10_000, "user")).toBe(
      "Trop de tentatives de connexion. Réessayez dans 1 minute."
    );
  });
});
