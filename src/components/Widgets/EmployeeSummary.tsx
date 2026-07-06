import { useMemo } from "react";
import { useAppSelector } from "../../store";
import HeadCountCard from "./HeadCountCard";

export function EmployeeSummary() {
  const employees = useAppSelector((state) => state.dashboard.employees);

  const summary = useMemo(() => {
    const totalEmployees = employees.length;

    const activeEmployees = employees.filter(
      (employee) => employee.status === "Active"
    ).length;

    const inactiveEmployees = employees.filter(
      (employee) => employee.status === "Inactive"
    ).length;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const newJoiners = employees.filter((employee) => {
      const joiningDate = new Date(employee.joinedDate);
      return (
        joiningDate.getMonth() === currentMonth &&
        joiningDate.getFullYear() === currentYear
      );
    }).length;

    return {
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      newJoiners,
    };
  }, [employees]);

  return (
    <section style={{ marginBottom: "32px" }}>
      <h2
        style={{
          marginBottom: "20px",
          color: "#0f172a",
          fontWeight: 800,
          fontSize: "22px",
          letterSpacing: "-0.025em",
        }}
      >
        Employee Summary
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "24px",
        }}
      >
        <HeadCountCard
          title="Total Employees"
          value={summary.totalEmployees}
        />

        <HeadCountCard
          title="Active Employees"
          value={summary.activeEmployees}
        />

        <HeadCountCard
          title="Inactive Employees"
          value={summary.inactiveEmployees}
        />

        <HeadCountCard
          title="New Joiners"
          value={summary.newJoiners}
        />
      </div>
    </section>
  );
}

export default EmployeeSummary;
