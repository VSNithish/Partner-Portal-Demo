import { ChevronDown } from "lucide-react";

import type { ReactNode } from "react";

type FilterDropdownProps = {
  active?: boolean;
  children: ReactNode;
  label: string;
  onToggle: () => void;
  open: boolean;
  width: number;
};

export const FilterDropdown = ({
  active,
  children,
  label,
  onToggle,
  open,
  width,
}: FilterDropdownProps) => (
  <div className="home-filter-wrap">
    <button className={`home-filter-btn${active ? " is-active" : ""}`} style={{ width }} onClick={onToggle} type="button">
      <span className="home-filter-btn-label">{label}</span>
      <ChevronDown size={14} color="#5c5c5c" />
    </button>
    {open ? <div className="home-filter-menu">{children}</div> : null}
  </div>
);

type FilterDropdownOptionProps = {
  label: string;
  onClick: () => void;
};

export const FilterDropdownOption = ({ label, onClick }: FilterDropdownOptionProps) => (
  <button className="home-filter-option" onClick={onClick} type="button">
    {label}
  </button>
);
