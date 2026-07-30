import type { ReactNode } from "react";

type StatCardProps = {
  danger?: boolean;
  icon?: ReactNode;
  label: string;
  value: string;
};

export const StatCard = ({ danger, icon, label, value }: StatCardProps) => (
  <div className={`home-stat-card${danger ? " is-danger" : ""}`}>
    <div>
      <p className="home-stat-label">{label}</p>
      <p className={`home-stat-value${danger ? " is-danger" : ""}`}>{value}</p>
    </div>
    {icon ? <div className="home-stat-icon">{icon}</div> : null}
  </div>
);
