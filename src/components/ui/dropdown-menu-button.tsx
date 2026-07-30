import type { ReactNode, RefObject } from "react";

type DropdownMenuButtonProps = {
  buttonClassName: string;
  buttonContent: ReactNode;
  children: ReactNode;
  menuClassName: string;
  wrapperClassName: string;
  menuRef?: RefObject<HTMLDivElement | null>;
  open: boolean;
  onToggle: () => void;
};

export const DropdownMenuButton = ({
  buttonClassName,
  buttonContent,
  children,
  menuClassName,
  wrapperClassName,
  menuRef,
  open,
  onToggle,
}: DropdownMenuButtonProps) => (
  <div className={wrapperClassName} ref={menuRef}>
    <button className={buttonClassName} onClick={onToggle} type="button">
      {buttonContent}
    </button>
    {open ? <div className={menuClassName}>{children}</div> : null}
  </div>
);
