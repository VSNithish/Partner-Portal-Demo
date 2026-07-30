import {
  MoreHorizontal,
  Search,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { DashboardFrame } from "@/components/dashboard-frame";
import { demoSessions, getDemoSession } from "@/lib/demo-session";

type AdminRole = "super-admin" | "partner-admin" | "viewer";
type AdminStatus = "Active" | "Invited" | "Pending" | "Disabled" | "Expired";

type PartnerAdminRow = {
  id: string;
  firstName: string;
  lastName: string;
  emailId: string;
  role: "Viewer";
  status: AdminStatus;
  createdDate: string;
  lastLogin: string;
};

type SuperAdminRow = {
  id: string;
  thirdPartyId: string;
  thirdPartyName: string;
  firstName: string;
  lastName: string;
  emailId: string;
  role: "Viewer";
  status: AdminStatus;
  createdDate: string;
  lastLogin: string;
};

const initialPartnerAdminRows: PartnerAdminRow[] = [
  { id: "1", firstName: "Meer", lastName: "Vadlamudi", emailId: "meer.vadlamudi@example.in", role: "Viewer", status: "Active", createdDate: "03-05-2026", lastLogin: "13-05-2026 11:30 AM" },
  { id: "2", firstName: "Lohith", lastName: "Palla", emailId: "lohith.palla@example.in", role: "Viewer", status: "Invited", createdDate: "03-05-2026", lastLogin: "-" },
  { id: "3", firstName: "Magadhi", lastName: "Padir", emailId: "magadhi.padir@example.in", role: "Viewer", status: "Pending", createdDate: "03-05-2026", lastLogin: "-" },
  { id: "4", firstName: "Rohit", lastName: "Gupta", emailId: "rohit.gupta@example.in", role: "Viewer", status: "Disabled", createdDate: "03-05-2026", lastLogin: "13-05-2026 11:30 AM" },
  { id: "5", firstName: "Anjali", lastName: "Menon", emailId: "anjali.menon@example.in", role: "Viewer", status: "Expired", createdDate: "03-05-2026", lastLogin: "-" },
  { id: "6", firstName: "Vikram", lastName: "Singh", emailId: "vikram.singh@example.in", role: "Viewer", status: "Active", createdDate: "03-05-2026", lastLogin: "13-05-2026 11:30 AM" },
];

const initialSuperAdminRows: SuperAdminRow[] = [
  { id: "1", thirdPartyId: "1234", thirdPartyName: "Angel One", firstName: "Meer", lastName: "Vadlamudi", emailId: "meer.vadlamudi@example.in", role: "Viewer", status: "Active", createdDate: "03-05-2026", lastLogin: "13-05-2026 11:30 AM" },
  { id: "2", thirdPartyId: "5678", thirdPartyName: "Motilal Oswal", firstName: "Lohith", lastName: "Palla", emailId: "lohith.palla@example.in", role: "Viewer", status: "Invited", createdDate: "03-05-2026", lastLogin: "-" },
  { id: "3", thirdPartyId: "9101", thirdPartyName: "Infina", firstName: "Magadhi", lastName: "Padir", emailId: "magadhi.padir@example.in", role: "Viewer", status: "Pending", createdDate: "03-05-2026", lastLogin: "-" },
  { id: "4", thirdPartyId: "1122", thirdPartyName: "50Fin", firstName: "Rohit", lastName: "Gupta", emailId: "rohit.gupta@example.in", role: "Viewer", status: "Disabled", createdDate: "03-05-2026", lastLogin: "13-05-2026 11:30 AM" },
  { id: "5", thirdPartyId: "3344", thirdPartyName: "50Fin", firstName: "Anjali", lastName: "Menon", emailId: "anjali.menon@example.in", role: "Viewer", status: "Expired", createdDate: "03-05-2026", lastLogin: "-" },
  { id: "6", thirdPartyId: "5566", thirdPartyName: "50Fin", firstName: "Vikram", lastName: "Singh", emailId: "vikram.singh@example.in", role: "Viewer", status: "Active", createdDate: "03-05-2026", lastLogin: "13-05-2026 11:30 AM" },
];

const getStatusClassName = (status: AdminStatus) =>
  ({
    Active: "admin-status-pill is-active",
    Invited: "admin-status-pill is-invited",
    Pending: "admin-status-pill is-pending",
    Disabled: "admin-status-pill is-disabled",
    Expired: "admin-status-pill is-expired",
  })[status];

export const AdminPage = () => {
  const [searchParams] = useSearchParams();
  const session = getDemoSession();
  const role = (searchParams.get("role") as AdminRole | null) ?? session.role;
  const partner = searchParams.get("partner") ?? session.partner;
  const [partnerAdminRows, setPartnerAdminRows] = useState(initialPartnerAdminRows);
  const [superAdminRows, setSuperAdminRows] = useState(initialSuperAdminRows);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuState, setMenuState] = useState<{ rowId: string; x: number; y: number } | null>(null);
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!actionMenuRef.current?.contains(event.target as Node)) setMenuState(null);
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const frameSession =
    role === "super-admin"
      ? session
      : role === "partner-admin"
        ? { ...demoSessions["partner-admin"], partner }
        : { ...demoSessions.viewer, partner };

  const filteredPartnerRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return partnerAdminRows.filter((row) =>
      query.length === 0 ||
      [row.firstName, row.lastName, row.emailId, row.role, row.status].some((value) => value.toLowerCase().includes(query)),
    );
  }, [partnerAdminRows, searchQuery]);

  const filteredSuperRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return superAdminRows.filter((row) =>
      query.length === 0 ||
      [row.thirdPartyId, row.thirdPartyName, row.firstName, row.lastName, row.emailId, row.role, row.status].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [searchQuery, superAdminRows]);

  const updatePartnerRowStatus = (rowId: string, status: AdminStatus) => {
    setPartnerAdminRows((rows) => rows.map((row) => (row.id === rowId ? { ...row, status } : row)));
    setMenuState(null);
  };

  const updateSuperRowStatus = (rowId: string, status: AdminStatus) => {
    setSuperAdminRows((rows) => rows.map((row) => (row.id === rowId ? { ...row, status } : row)));
    setMenuState(null);
  };

  const deletePartnerRow = (rowId: string) => {
    setPartnerAdminRows((rows) => rows.filter((row) => row.id !== rowId));
    setMenuState(null);
  };

  const deleteSuperRow = (rowId: string) => {
    setSuperAdminRows((rows) => rows.filter((row) => row.id !== rowId));
    setMenuState(null);
  };

  const submitViewer = () => {
    if (!formFirstName.trim() || !formLastName.trim() || !formEmail.trim()) {
      setMessage("Please fill all required fields before adding a viewer.");
      return;
    }

    setPartnerAdminRows((rows) => [
      {
        id: String(Date.now()),
        firstName: formFirstName.trim(),
        lastName: formLastName.trim(),
        emailId: formEmail.trim(),
        role: "Viewer",
        status: "Invited",
        createdDate: "10-06-2026",
        lastLogin: "-",
      },
      ...rows,
    ]);
    setFormFirstName("");
    setFormLastName("");
    setFormEmail("");
    setMessage(`Invitation sent to ${formEmail.trim()}.`);
  };

  if (role === "viewer" || session.role === "viewer") {
    return <Navigate replace to="/home" />;
  }

  const isSuperAdmin = role === "super-admin";

  return (
    <DashboardFrame activeNav="admin" sessionOverride={frameSession}>
          <div className="home-heading-row">
            <h1 className="home-heading">Admin</h1>
          </div>

          <div className={`admin-layout${isSuperAdmin ? " is-super" : ""}`}>
            <section className="customers-panel">
              <div className="customers-panel-header">
                <div className="customers-panel-actions">
                  <label className="customers-search">
                    <Search size={16} strokeWidth={1.9} />
                    <input
                      className="customers-search-input"
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search anything..."
                      type="text"
                      value={searchQuery}
                    />
                  </label>
                </div>
              </div>

              <div className="customers-table-scroll admin-table-scroll">
                <table className="customers-table admin-table">
                  <thead>
                    <tr>
                      {isSuperAdmin ? <th>Third Party ID</th> : null}
                      {isSuperAdmin ? <th>Third Party Name</th> : null}
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email ID</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Created Date</th>
                      <th>Last Login</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isSuperAdmin
                      ? filteredSuperRows.map((row) => (
                          <tr key={row.id}>
                            <td>{row.thirdPartyId}</td>
                            <td>{row.thirdPartyName}</td>
                            <td>{row.firstName}</td>
                            <td>{row.lastName}</td>
                            <td>{row.emailId}</td>
                            <td>{row.role}</td>
                            <td>
                              <span className={getStatusClassName(row.status)}>{row.status}</span>
                            </td>
                            <td>{row.createdDate}</td>
                            <td>{row.lastLogin === "-" ? "-" : <DateTimeCell value={row.lastLogin} />}</td>
                            <td className="admin-action-cell">
                              <button
                                className="admin-action-trigger"
                                onClick={(event) => {
                                  const rect = event.currentTarget.getBoundingClientRect();
                                  setMenuState((value) =>
                                    value?.rowId === row.id ? null : { rowId: row.id, x: rect.right - 128, y: rect.bottom + 8 },
                                  );
                                }}
                                type="button"
                              >
                                <MoreHorizontal size={18} strokeWidth={2} />
                              </button>
                            </td>
                          </tr>
                        ))
                      : filteredPartnerRows.map((row) => (
                          <tr key={row.id}>
                            <td>{row.firstName}</td>
                            <td>{row.lastName}</td>
                            <td>{row.emailId}</td>
                            <td>{row.role}</td>
                            <td>
                              <span className={getStatusClassName(row.status)}>{row.status}</span>
                            </td>
                            <td>{row.createdDate}</td>
                            <td>{row.lastLogin === "-" ? "-" : <DateTimeCell value={row.lastLogin} />}</td>
                            <td className="admin-action-cell">
                              <button
                                className="admin-action-trigger"
                                onClick={(event) => {
                                  const rect = event.currentTarget.getBoundingClientRect();
                                  setMenuState((value) =>
                                    value?.rowId === row.id ? null : { rowId: row.id, x: rect.right - 128, y: rect.bottom + 8 },
                                  );
                                }}
                                type="button"
                              >
                                <MoreHorizontal size={18} strokeWidth={2} />
                              </button>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </section>

            {!isSuperAdmin ? (
              <aside className="admin-side-panel">
                <div className="admin-side-header">
                  <h2>Add Viewer</h2>
                  <button className="admin-side-close" onClick={() => {
                    setFormFirstName("");
                    setFormLastName("");
                    setFormEmail("");
                    setMessage(null);
                  }} type="button">
                    <X size={20} strokeWidth={1.8} />
                  </button>
                </div>

                <div className="admin-form-grid">
                  <FormField label="First Name *" placeholder="Enter First Name" value={formFirstName} onChange={setFormFirstName} />
                  <FormField label="Last Name *" placeholder="Enter Last Name" value={formLastName} onChange={setFormLastName} />
                  <FormField label="Email ID *" placeholder="Enter Email ID" value={formEmail} onChange={setFormEmail} />
                </div>

                <div className="admin-side-footer">
                  <p className="admin-invite-note">An invitation will be sent to this email.</p>
                  <button className="customers-filter-apply admin-add-button" onClick={submitViewer} type="button">
                    <span>Add Viewer</span>
                    <UserPlus size={16} strokeWidth={2} />
                  </button>
                  {message ? <p className="admin-feedback">{message}</p> : null}
                </div>
              </aside>
            ) : null}
          </div>
          {menuState ? (
            <div className="admin-action-menu admin-action-menu-floating" ref={actionMenuRef} style={{ left: menuState.x, top: menuState.y }}>
              <button
                className="admin-action-option"
                onClick={() => {
                  isSuperAdmin ? updateSuperRowStatus(menuState.rowId, "Invited") : updatePartnerRowStatus(menuState.rowId, "Invited");
                }}
                type="button"
              >
                Resend Invite
              </button>
              <button
                className="admin-action-option"
                onClick={() => {
                  isSuperAdmin ? updateSuperRowStatus(menuState.rowId, "Disabled") : updatePartnerRowStatus(menuState.rowId, "Disabled");
                }}
                type="button"
              >
                Disable User
              </button>
              <button
                className="admin-action-option"
                onClick={() => {
                  isSuperAdmin ? updateSuperRowStatus(menuState.rowId, "Active") : updatePartnerRowStatus(menuState.rowId, "Active");
                }}
                type="button"
              >
                Enable User
              </button>
              <button
                className="admin-action-option is-danger"
                onClick={() => {
                  isSuperAdmin ? deleteSuperRow(menuState.rowId) : deletePartnerRow(menuState.rowId);
                }}
                type="button"
              >
                Delete User
              </button>
            </div>
          ) : null}
    </DashboardFrame>
  );
};

const DateTimeCell = ({ value }: { value: string }) => {
  const [date, time, meridiem] = value.split(" ");
  return (
    <div className="customers-date-time">
      <span>{date}</span>
      <span className="customers-muted">{[time, meridiem].filter(Boolean).join(" ")}</span>
    </div>
  );
};

const FormField = ({
  label,
  placeholder,
  readOnly,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  readOnly?: boolean;
  value: string;
  onChange: (value: string) => void;
}) => (
  <label className="admin-form-field">
    <span>{label}</span>
    <input
      className="admin-form-input"
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      type="text"
      value={value}
    />
  </label>
);
