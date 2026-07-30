export type DemoRole = "super-admin" | "partner-admin" | "viewer";

export type DemoSession = {
  email: string;
  initials: string;
  name: string;
  partner: string;
  password: string;
  role: DemoRole;
};

const STORAGE_KEY = "partner-portal-demo-session";

const normalizeRole = (role: string | undefined): DemoRole => {
  if (role === "sub-admin") return "viewer";
  if (role === "partner-admin" || role === "super-admin" || role === "viewer")
    return role;
  return "super-admin";
};

export const demoSessions: Record<DemoRole, DemoSession> = {
  "super-admin": {
    email: "superadmin@50fin.in",
    initials: "NV",
    name: "Nithish V",
    partner: "50Fin Internal",
    password: "password",
    role: "super-admin",
  },
  "partner-admin": {
    email: "admin@angelone.in",
    initials: "PR",
    name: "Prithvi Raj",
    partner: "AngelOne",
    password: "password",
    role: "partner-admin",
  },
  viewer: {
    email: "viewer@angelone.in",
    initials: "MV",
    name: "Meer V",
    partner: "AngelOne",
    password: "password",
    role: "viewer",
  },
};

export const getDemoSession = (): DemoSession => {
  if (typeof window === "undefined") return demoSessions["super-admin"];
  const rawValue = window.localStorage.getItem(STORAGE_KEY);
  if (!rawValue) return demoSessions["super-admin"];

  try {
    const parsed = JSON.parse(rawValue) as Partial<DemoSession>;
    const role = normalizeRole(parsed.role);
    const session = { ...demoSessions[role], ...parsed, role };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return session;
  } catch {
    return demoSessions["super-admin"];
  }
};

export const setDemoSession = (role: DemoRole) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demoSessions[role]));
};

export const clearDemoSession = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
};

export const updateDemoSession = (updates: Partial<DemoSession>) => {
  if (typeof window === "undefined") return;
  const current = getDemoSession();
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...current, ...updates }),
  );
};

export const getAdminRoute = (session: DemoSession) =>
  session.role === "super-admin"
    ? "/admin?role=super-admin"
    : session.role === "partner-admin"
      ? `/admin?role=${session.role}&partner=${encodeURIComponent(session.partner)}`
      : "/home";
