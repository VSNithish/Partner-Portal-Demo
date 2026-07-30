import { Eye, Lock } from "lucide-react";
import { useState } from "react";
import { AuthField, FigmaAuthLayout } from "@/components/figma-auth-layout";

const activationIllustration =
  "https://www.figma.com/api/mcp/asset/b3b93706-b9a7-4f35-bacc-d0dc14803eb4";

export const ActivationPage = () => {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <FigmaAuthLayout
      illustration={<img src={activationIllustration} alt="" style={{ width: 100, height: 100 }} />}
      title="You’ve been Invited"
      description="Please set a strong password to activate your account"
      primaryLabel="Activate Account"
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
