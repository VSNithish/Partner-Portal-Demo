import { Eye, EyeOff } from "lucide-react";
import { useMemo, useState } from "react";
import { DashboardFrame } from "@/components/dashboard-frame";
import { getDemoSession, updateDemoSession, type DemoSession } from "@/lib/demo-session";

const getRoleLabel = (role: DemoSession["role"]) =>
  role === "super-admin" ? "Super Admin" : role === "partner-admin" ? "Admin" : "Viewer";

const getInitialProfileState = (session: DemoSession) => {
  const [firstName = "", ...rest] = session.name.split(" ");
  return {
    email: session.email,
    firstName,
    lastName: rest.join(" "),
    partner: session.partner,
    role: getRoleLabel(session.role),
  };
};

export const ProfilePage = () => {
  const session = getDemoSession();
  const [profile, setProfile] = useState(() => getInitialProfileState(session));
  const [draftProfile, setDraftProfile] = useState(() => getInitialProfileState(session));
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    confirmPassword: false,
    currentPassword: false,
    newPassword: false,
  });
  const [feedback, setFeedback] = useState<string | null>(null);

  const isPasswordEditing = useMemo(
    () => Object.values(passwordForm).some((value) => value.trim().length > 0),
    [passwordForm],
  );

  const saveProfile = () => {
    setProfile(draftProfile);
    updateDemoSession({
      email: draftProfile.email,
      initials: `${draftProfile.firstName[0] ?? ""}${draftProfile.lastName[0] ?? ""}`.toUpperCase(),
      name: `${draftProfile.firstName} ${draftProfile.lastName}`.trim(),
      partner: draftProfile.partner,
    });
    setIsProfileEditing(false);
    setFeedback("Profile details saved.");
  };

  const updatePassword = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setFeedback("Please fill all password fields.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setFeedback("New password and confirm password must match.");
      return;
    }

    setPasswordForm({
      confirmPassword: "",
      currentPassword: "",
      newPassword: "",
    });
    setFeedback("Password updated successfully.");
  };

  return (
    <DashboardFrame activeNav="home">
      <div className="home-heading-row">
        <h1 className="home-heading">My Profile</h1>
      </div>

      <section className="profile-layout">
        <aside className="profile-summary-card">
          <div className="profile-summary-avatar">{session.initials}</div>
          <div className="profile-summary-copy">
            <h2>{profile.firstName} {profile.lastName}</h2>
            <p>{profile.partner}</p>
          </div>
          <span className="profile-summary-badge">{profile.role}</span>
        </aside>

        <div className="profile-main">
          <section className="profile-panel">
            <div className="profile-panel-header">
              <h2>Personal Information</h2>
              <button
                className="profile-edit-button"
                disabled={isPasswordEditing}
                onClick={() => {
                  if (isProfileEditing) {
                    saveProfile();
                    return;
                  }

                  setDraftProfile(profile);
                  setIsProfileEditing(true);
                  setFeedback(null);
                }}
                type="button"
              >
                {isProfileEditing ? "Save Profile" : "Edit Profile"}
              </button>
            </div>

            <div className="profile-fields-grid">
              <ProfileField
                disabled={!isProfileEditing}
                label="First Name *"
                onChange={(value) => setDraftProfile((current) => ({ ...current, firstName: value }))}
                value={draftProfile.firstName}
              />
              <ProfileField
                disabled={!isProfileEditing}
                label="Last Name *"
                onChange={(value) => setDraftProfile((current) => ({ ...current, lastName: value }))}
                value={draftProfile.lastName}
              />
              <ProfileField
                disabled={!isProfileEditing}
                label="Email ID *"
                onChange={(value) => setDraftProfile((current) => ({ ...current, email: value }))}
                value={draftProfile.email}
              />
              <ProfileField disabled label="Partner Name *" onChange={() => undefined} value={draftProfile.partner} />
              <ProfileField disabled label="Role *" onChange={() => undefined} value={draftProfile.role} />
            </div>
          </section>

          <section className="profile-panel">
            <div className="profile-panel-header">
              <h2>Change Password</h2>
            </div>

            <div className="profile-fields-grid profile-fields-grid-password">
              <PasswordField
                disabled={isProfileEditing}
                label="Current Password *"
                onChange={(value) => {
                  setPasswordForm((current) => ({ ...current, currentPassword: value }));
                  setFeedback(null);
                }}
                onToggleVisibility={() =>
                  setShowPasswords((current) => ({ ...current, currentPassword: !current.currentPassword }))
                }
                placeholder="Enter current password"
                showValue={showPasswords.currentPassword}
                value={passwordForm.currentPassword}
              />
              <PasswordField
                disabled={isProfileEditing}
                label="New Password *"
                onChange={(value) => {
                  setPasswordForm((current) => ({ ...current, newPassword: value }));
                  setFeedback(null);
                }}
                onToggleVisibility={() =>
                  setShowPasswords((current) => ({ ...current, newPassword: !current.newPassword }))
                }
                placeholder="Enter new password"
                showValue={showPasswords.newPassword}
                value={passwordForm.newPassword}
              />
              <PasswordField
                disabled={isProfileEditing}
                label="Confirm New Password *"
                onChange={(value) => {
                  setPasswordForm((current) => ({ ...current, confirmPassword: value }));
                  setFeedback(null);
                }}
                onToggleVisibility={() =>
                  setShowPasswords((current) => ({ ...current, confirmPassword: !current.confirmPassword }))
                }
                placeholder="Confirm new password"
                showValue={showPasswords.confirmPassword}
                value={passwordForm.confirmPassword}
              />
            </div>

            <div className="profile-password-footer">
              <button
                className="profile-password-button"
                disabled={isProfileEditing}
                onClick={updatePassword}
                type="button"
              >
                Update Password
              </button>
            </div>
          </section>

          {feedback ? <p className="profile-feedback">{feedback}</p> : null}
        </div>
      </section>
    </DashboardFrame>
  );
};

const ProfileField = ({
  disabled,
  label,
  onChange,
  value,
}: {
  disabled?: boolean;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) => (
  <label className="profile-field">
    <span>{label}</span>
    <input
      className={`profile-input${disabled ? " is-disabled" : ""}`}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      type="text"
      value={value}
    />
  </label>
);

const PasswordField = ({
  disabled,
  label,
  onChange,
  onToggleVisibility,
  placeholder,
  showValue,
  value,
}: {
  disabled?: boolean;
  label: string;
  onChange: (value: string) => void;
  onToggleVisibility: () => void;
  placeholder: string;
  showValue: boolean;
  value: string;
}) => (
  <label className="profile-field">
    <span>{label}</span>
    <div className={`profile-password-input${disabled ? " is-disabled" : ""}`}>
      <input
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={showValue ? "text" : "password"}
        value={value}
      />
      <button disabled={disabled} onClick={onToggleVisibility} type="button">
        {showValue ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
      </button>
    </div>
  </label>
);
