export const mockDropdownMenu = {
  DropdownMenu: ({ children }: { children: React.ReactNode }) => {
    return <div>{children}</div>;
  },
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode; asChild?: boolean }) => {
    return <div>{children}</div>;
  },
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => {
    return <div>{children}</div>;
  },
  DropdownMenuItem: ({
    children,
    onClick,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    <div role="menuitem" className={className} data-testid="logout-button" onClick={onClick}>
      {children}
    </div>
  ),
};