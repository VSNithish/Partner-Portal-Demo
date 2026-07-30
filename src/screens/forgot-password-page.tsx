import { Mail } from "lucide-react";
import { AuthField, BackToLoginFooter, FigmaAuthLayout } from "@/components/figma-auth-layout";

const forgotIllustration =
  "https://www.figma.com/api/mcp/asset/13d29ecc-e2db-453f-bbc7-b3935e8fc92a";

export const ForgotPasswordPage = () => (
  <FigmaAuthLayout
    illustration={<img src={forgotIllustration} alt="" style={{ width: 100, height: 100 }} />}
    title="Forgot Password"
    description="Enter your registered email id"
    primaryLabel="Send Reset Link"
    footer={<BackToLoginFooter />}
    onSubmit={(event) => event.preventDefault()}
  >
    <AuthField label="Email Address *" icon={<Mail size={18} strokeWidth={1.8} />}>
      <input
        placeholder="Enter your email address"
        defaultValue="admin@aarohanwealth.com"
        className="desktop-auth-input"
      />
    </AuthField>
  </FigmaAuthLayout>
);
