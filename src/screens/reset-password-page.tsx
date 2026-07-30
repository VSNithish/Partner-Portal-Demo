import { Eye, Lock } from "lucide-react";
import { useState } from "react";
import { AuthField, BackToLoginFooter, FigmaAuthLayout } from "@/components/figma-auth-layout";

const resetIllustration =
  "https://www.figma.com/api/mcp/asset/32db6c9a-60ab-43e1-b532-82775c14f3bb";

export const ResetPasswordPage = () => {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <FigmaAuthLayout
      illustration={<img src={resetIllustration} alt="" style={{ width: 100, height: 100 }} />}
      title="Create New Password"
      description="Enter new password for your acount"
      primaryLabel="Update Password"
      footer={<BackToLoginFooter />}
      onSubmit={(event) => event.preventDefault()}
    >
      <AuthField
        label="New Password *"
        icon={<Lock size={18} strokeWidth={1.8} />}
        trailing={
          <button
            type="button"
            style={{ border: 0, background: "transparent", padding: 0, cursor: "pointer" }}
            onClick={() => setShowNew((value) => !value)}
          >
            <Eye size={18} strokeWidth={1.8} />
          </button>
        }
      >
        <input
          type={showNew ? "text" : "password"}
          placeholder="Enter new password"
          className="desktop-auth-input"
        />
      </AuthField>
      <AuthField
        label="Confirm Password *"
        icon={<Lock size={18} strokeWidth={1.8} />}
        trailing={
          <button
            type="button"
            style={{ border: 0, background: "transparent", padding: 0, cursor: "pointer" }}
            onClick={() => setShowConfirm((value) => !value)}
          >
            <Eye size={18} strokeWidth={1.8} />
          </button>
        }
      >
        <input
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm new password"
          className="desktop-auth-input"
        />
      </AuthField>
    </FigmaAuthLayout>
  );
};
