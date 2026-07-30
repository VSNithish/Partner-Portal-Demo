import type { FormEventHandler, ReactNode } from "react";
import { Link } from "react-router-dom";
import loginHeroImage from "../../Login Page Image.png";
import logoImage from "../../Small Logo.png";

export const FigmaAuthLayout = ({
  illustration,
  title,
  description,
  children,
  primaryLabel,
  onSubmit,
  footer,
}: {
  illustration: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
  primaryLabel: string;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  footer?: ReactNode;
}) => (
  <div style={{ minHeight: "100vh", background: "#ededed", fontFamily: "Roboto, sans-serif" }}>
    <div className="desktop-auth-shell">
      <section className="desktop-auth-hero">
        <div className="desktop-auth-logo">
          <img src={logoImage} alt="50Fin" style={{ height: 42, width: "auto", display: "block" }} />
        </div>
        <div className="desktop-auth-hero-inner">
          <img src={loginHeroImage} alt="Partner portal illustration" className="desktop-auth-loop" />
        </div>
      </section>

      <section className="desktop-auth-panel">
        <form className="desktop-auth-form" onSubmit={onSubmit}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <div style={{ marginBottom: 4 }}>{illustration}</div>
            <div>
              <h1 className="desktop-auth-title">{title}</h1>
              <p className="desktop-auth-copy">{description}</p>
            </div>
          </div>

          <div style={{ marginTop: 40, display: "grid", gap: 24 }}>{children}</div>

          <button type="submit" className="desktop-auth-submit">
            {primaryLabel}
          </button>

          {footer ? <div style={{ marginTop: 24 }}>{footer}</div> : null}
        </form>
      </section>
    </div>
  </div>
);

export const AuthField = ({
  label,
  icon,
  children,
  trailing,
}: {
  label: string;
  icon: ReactNode;
  children: ReactNode;
  trailing?: ReactNode;
}) => (
  <label style={{ display: "block" }}>
    <span className="desktop-auth-label">{label}</span>
    <span className="desktop-auth-inputshell">
      <span style={{ color: "#010101", display: "inline-flex" }}>{icon}</span>
      {children}
      {trailing ? <span style={{ color: "#010101", display: "inline-flex" }}>{trailing}</span> : null}
    </span>
  </label>
);

export const BackToLoginFooter = () => (
  <div style={{ display: "grid", gap: 16 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ height: 1, flex: 1, background: "#e1e1e1" }} />
      <p style={{ margin: 0, color: "#757575", fontSize: 11, lineHeight: "14px" }}>
        Remember your password ?
      </p>
      <div style={{ height: 1, flex: 1, background: "#e1e1e1" }} />
    </div>
    <div style={{ textAlign: "center" }}>
      <Link to="/login" style={{ color: "#0f6d66", fontSize: 12, fontWeight: 500, lineHeight: "16px", textDecoration: "none" }}>
        Back to Login
      </Link>
    </div>
  </div>
);
