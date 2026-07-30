import { Eye, Lock, Mail, Square } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthField, FigmaAuthLayout } from "@/components/figma-auth-layout";
import { demoSessions, type DemoRole, setDemoSession } from "@/lib/demo-session";

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<DemoRole>("super-admin");
  const [email, setEmail] = useState(demoSessions["super-admin"].email);
  const [password, setPassword] = useState(demoSessions["super-admin"].password);
  const navigate = useNavigate();

  const selectRole = (role: DemoRole) => {
    setSelectedRole(role);
    setEmail(demoSessions[role].email);
    setPassword(demoSessions[role].password);
  };

  return (
    <FigmaAuthLayout
      illustration={null}
      title="Welcome Back"
      description="Login to access your partner portal"
      primaryLabel="Login"
      onSubmit={(event) => {
        event.preventDefault();
        setDemoSession(selectedRole);
        navigate("/home");
      }}
    >
      <div className="demo-login-grid">
        <DemoLoginButton
          active={selectedRole === "super-admin"}
          email={demoSessions["super-admin"].email}
          label="Super Admin"
          onClick={() => selectRole("super-admin")}
          password={demoSessions["super-admin"].password}
        />
        <DemoLoginButton
          active={selectedRole === "partner-admin"}
          email={demoSessions["partner-admin"].email}
          label="Admin"
          onClick={() => selectRole("partner-admin")}
          password={demoSessions["partner-admin"].password}
        />
        <DemoLoginButton
          active={selectedRole === "viewer"}
          email={demoSessions.viewer.email}
          label="Viewer"
          onClick={() => selectRole("viewer")}
          password={demoSessions.viewer.password}
        />
      </div>

      <AuthField label="Email Address *" icon={<Mail size={18} strokeWidth={1.8} />}>
        <input
          placeholder="Enter your email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="desktop-auth-input"
        />
      </AuthField>
      <AuthField
        label="Password *"
        icon={<Lock size={18} strokeWidth={1.8} />}
        trailing={
          <button
            type="button"
            style={{ border: 0, background: "transparent", padding: 0, cursor: "pointer" }}
            onClick={() => setShowPassword((value) => !value)}
          >
            <Eye size={18} strokeWidth={1.8} />
          </button>
        }
      >
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="desktop-auth-input"
        />
      </AuthField>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#5c5c5c", fontSize: 12, fontWeight: 500, lineHeight: "16px" }}>
          <Square size={16} strokeWidth={1.7} color="#757575" />
          Remember Me
        </label>
        <Link to="/forgot-password" style={{ color: "#0f6d66", fontSize: 12, fontWeight: 500, lineHeight: "16px", textDecoration: "none" }}>
          Forgot Password ?
        </Link>
      </div>
    </FigmaAuthLayout>
  );
};

const DemoLoginButton = ({
  active,
  email,
  label,
  onClick,
  password,
}: {
  active: boolean;
  email: string;
  label: string;
  onClick: () => void;
  password: string;
}) => (
  <button className={`demo-login-card${active ? " is-active" : ""}`} onClick={onClick} type="button">
    <span className="demo-login-label">{label}</span>
    <span className="demo-login-copy">ID: {email}</span>
    <span className="demo-login-copy">Pass: {password}</span>
  </button>
);
