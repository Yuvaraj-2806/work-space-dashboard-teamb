
interface Role {
  id: number;
  role: string;
  employees: number;
}

interface RoleWidgetProps {
  title?: string;
  roles: Role[];
}

export function RoleWidget({
  title = "Employees by Role",
  roles,
}: RoleWidgetProps) {
  const maxEmployees = Math.max(
    ...roles.map((r) => r.employees),
    1
  );

  return (
    <div className="widget-card">
      <h2>{title}</h2>

      {roles.map((role) => (
        <div className="widget-row" key={role.id}>
          <span>{role.role}</span>

          <div className="progress">
            <div
              className="progress-fill"
              style={{
                width: `${(role.employees / maxEmployees) * 100}%`,
              }}
            ></div>
          </div>

          <strong>{role.employees}</strong>
        </div>
      ))}
    </div>
  );
}

export default RoleWidget;
