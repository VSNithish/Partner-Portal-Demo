import {
  Bell,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CreditCard,
  Landmark,
  LogOut,
  ShieldAlert,
  UserRound,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../../Small Logo.png";
import { clearDemoSession, getAdminRoute, getDemoSession, type DemoSession } from "@/lib/demo-session";

type DashboardNavKey =
  | "home"
  | "customers"
  | "loan"
  | "interest-payment"
  | "risk-reports"
  | "billing"
  | "admin";

const COLLAPSE_KEY = "partner-portal-sidebar-collapsed";

export const DashboardFrame = ({
  activeNav,
  children,
  sessionOverride,
}: {
  activeNav: DashboardNavKey;
  children: ReactNode;
  sessionOverride?: DemoSession;
}) => {
  const navigate = useNavigate();
  const session = sessionOverride ?? getDemoSession();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(COLLAPSE_KEY) === "true";
  });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(COLLAPSE_KEY, String(collapsed));
    }
  }, [collapsed]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const navItems = useMemo(
    () =>
      [
        { key: "home" as const, icon: <Landmark size={18} />, label: "Home", path: "/home" },
        { key: "customers" as const, icon: <Users size={18} />, label: "Customers", path: "/customers" },
        { key: "loan" as const, icon: <CreditCard size={18} />, label: "Loans", path: "/loan" },
        { key: "interest-payment" as const, icon: <CircleAlert size={18} />, label: "Interest Payments", path: "/interest-payment" },
        { key: "risk-reports" as const, icon: <ShieldAlert size={18} />, label: "Risk Reports", path: "/risk-reports" },
        { key: "billing" as const, icon: <Bell size={18} />, label: "Revenue", path: "/billing" },
        session.role !== "viewer"
          ? { key: "admin" as const, icon: <Users size={18} />, label: "Admin", path: getAdminRoute(session) }
          : null,
      ].filter(Boolean) as Array<{ key: DashboardNavKey; icon: ReactNode; label: string; path: string }>,
    [session],
  );

  const roleLabel =
    session.role === "super-admin"
      ? "Super Admin"
      : session.role === "partner-admin"
        ? "Admin"
        : "Viewer";

  return (
    <div
      className={`home-shell${collapsed ? " is-collapsed" : ""}`}
      style={
        {
          "--dashboard-sidebar-width": collapsed ? "90px" : "220px",
        } as CSSProperties
      }
    >
      <aside className="home-sidebar">
        <div className="home-sidebar-logo">
          <img src={logoImage} alt="50Fin" className="home-sidebar-logo-image" />
        </div>

        <button
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="home-sidebar-toggle"
          onClick={() => setCollapsed((value) => !value)}
          type="button"
        >
          <ChevronRight size={16} strokeWidth={2} />
        </button>

        <nav className="home-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`home-nav-item${activeNav === item.key ? " is-active" : ""}`}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : undefined}
              type="button"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="home-main">
        <header className="home-topbar">
          <p className="home-topbar-title">Welcome</p>
          <div className="home-profile-wrap" ref={profileMenuRef}>
            <button
              className={`home-profile-trigger${showProfileMenu ? " is-open" : ""}`}
              onClick={() => setShowProfileMenu((value) => !value)}
              type="button"
            >
              <div className="home-profile-avatar">{session.initials}</div>
              <div className="home-profile-copy">
                <span className="home-profile-name">{session.name}</span>
                <span className="home-profile-meta">{session.partner}</span>
              </div>
              <ChevronDown size={16} color="#5c5c5c" />
            </button>

            {showProfileMenu ? (
              <div className="home-profile-menu">
                <div className="home-profile-menu-header">
                  <div className="home-profile-menu-user">
                    <div className="home-profile-menu-avatar">{session.initials}</div>
                    <div className="home-profile-menu-copy">
                      <p>{session.name}</p>
                      <span>{session.partner}</span>
                    </div>
                  </div>
                  <span className="home-profile-badge">{roleLabel}</span>
                </div>

                <button
                  className="home-profile-menu-item"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/profile");
                  }}
                  type="button"
                >
                  <UserRound size={18} strokeWidth={1.8} />
                  <span>My Profile &amp; Security</span>
                </button>
                <button
                  className="home-profile-menu-item is-logout"
                  onClick={() => {
                    setShowProfileMenu(false);
                    clearDemoSession();
                    navigate("/login");
                  }}
                  type="button"
                >
                  <LogOut size={18} strokeWidth={1.8} />
                  <span>Logout</span>
                </button>
              </div>
            ) : null}
          </div>
        </header>

        <main className="home-content">{children}</main>
      </div>
    </div>
  );
};
