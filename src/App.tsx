import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { store } from './store';
import { useDashboard } from './hooks/useDashboard';
import './index.css';

// Type definitions for form inputs
interface FormInput {
  name: string;
  email: string;
  department: string;
  role: string;
  status: 'Active' | 'Inactive';
  joinedDate: string;
}

// Yup validation schema matching all data requirements
const employeeSchema: yup.ObjectSchema<FormInput> = yup.object({
  name: yup
    .string()
    .required('Employee name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email address is required')
    .email('Please enter a valid email address'),
  department: yup
    .string()
    .required('Department is required')
    .oneOf(
      ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR'],
      'Select a valid department'
    ),
  role: yup.string().required('Role is required'),
  status: yup
    .mixed<'Active' | 'Inactive'>()
    .required('Status is required')
    .oneOf(['Active', 'Inactive']),
  joinedDate: yup.string().required('Join date is required'),
});

// Helper mappings for department roles
const departmentRoles: Record<string, string[]> = {
  Engineering: [
    'Frontend Engineer',
    'Backend Engineer',
    'Fullstack Engineer',
    'Engineering Manager',
  ],
  Product: ['Product Manager', 'Associate Product Manager'],
  Design: ['Product Designer', 'UI/UX Researcher'],
  Marketing: ['Marketing Specialist', 'Content Strategist'],
  Sales: ['Sales Executive', 'Account Manager'],
  HR: ['HR Manager', 'Talent Acquisition Specialist'],
};

function DashboardTester() {
  const {
    filteredEmployees,
    filters,
    stats,
    loading,
    error,
    loadData,
    changeDepartment,
    changeRole,
    changeSearchQuery,
    changeStatus,
    resetAllFilters,
    addNewEmployee,
    removeEmployee,
  } = useDashboard();

  // Local state for modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize react-hook-form with yup validation
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: yupResolver(employeeSchema),
    defaultValues: {
      name: '',
      email: '',
      department: 'Engineering',
      role: '',
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
    },
  });

  // Watch department to dynamically update roles
  const selectedDepartment = watch('department');
  const availableRoles = departmentRoles[selectedDepartment] || [];

  // Fetch initial data
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Form submit handler
  const onSubmit = (data: FormInput) => {
    addNewEmployee(data);
    setIsModalOpen(false);
    reset({
      name: '',
      email: '',
      department: 'Engineering',
      role: '',
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
    });
    toast.success(`Successfully added ${data.name}!`);
  };

  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <h2 style={{ color: '#64748b' }}>Loading dashboard state...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 48, color: '#ef4444', textAlign: 'center' }}>
        <h2>Error loading dashboard: {error}</h2>
      </div>
    );
  }

  return (
    <>
      <div className="animate-fade-in" style={{ padding: '40px 48px', minHeight: '100vh', maxWidth: 1280, margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h1 className="page-title">Dashboard State</h1>
          
          <button
            className="btn-primary"
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: '12px 22px',
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.1)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Employee
          </button>
        </div>

        {/* Metrics Grid Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 24,
            marginBottom: 32,
          }}
        >
          {/* Card 1: Total Headcount */}
          <div
            className="dashboard-card"
            style={{ '--accent-color': '#2563eb', '--icon-bg': '#eff6ff' } as React.CSSProperties}
          >
            <div className="card-header-row">
              <span className="card-title">Total Headcount</span>
              <div className="card-icon-container">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>
            <h2 className="card-value">{stats.totalHeadcount}</h2>
          </div>

          {/* Card 2: Active Count */}
          <div
            className="dashboard-card"
            style={{ '--accent-color': '#10b981', '--icon-bg': '#ecfdf5' } as React.CSSProperties}
          >
            <div className="card-header-row">
              <span className="card-title">Active Count</span>
              <div className="card-icon-container">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
            </div>
            <h2 className="card-value">{stats.activeCount}</h2>
          </div>

          {/* Card 3: New Hires */}
          <div
            className="dashboard-card"
            style={{ '--accent-color': '#3b82f6', '--icon-bg': '#eff6ff' } as React.CSSProperties}
          >
            <div className="card-header-row">
              <span className="card-title">New Hires (90 Days)</span>
              <div className="card-icon-container">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
              </div>
            </div>
            <h2 className="card-value">{stats.newHires}</h2>
          </div>

          {/* Card 4: Attrition Rate */}
          <div
            className="dashboard-card"
            style={{ '--accent-color': '#f59e0b', '--icon-bg': '#fffbeb' } as React.CSSProperties}
          >
            <div className="card-header-row">
              <span className="card-title">Attrition Rate</span>
              <div className="card-icon-container">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                  <polyline points="17 18 23 18 23 12" />
                </svg>
              </div>
            </div>
            <h2 className="card-value">{stats.attritionRate}%</h2>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 32,
            padding: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(8px)',
            borderRadius: 12,
            border: '1px solid rgba(226, 232, 240, 0.7)',
            alignItems: 'center'
          }}
        >
          <input
            type="text"
            className="filter-input"
            placeholder="Search by name, role, dept..."
            value={filters.searchQuery}
            onChange={(e) => changeSearchQuery(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              width: 280,
              fontSize: 14,
              backgroundColor: '#fff'
            }}
          />
          <select
            className="filter-select"
            value={filters.department}
            onChange={(e) => changeDepartment(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              fontSize: 14,
              backgroundColor: '#fff',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="HR">HR</option>
          </select>
          <select
            className="filter-select"
            value={filters.role}
            onChange={(e) => changeRole(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              fontSize: 14,
              backgroundColor: '#fff',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Roles</option>
            <option value="Frontend Engineer">Frontend Engineer</option>
            <option value="Backend Engineer">Backend Engineer</option>
            <option value="Fullstack Engineer">Fullstack Engineer</option>
            <option value="Engineering Manager">Engineering Manager</option>
            <option value="Product Designer">Product Designer</option>
            <option value="UI/UX Researcher">UI/UX Researcher</option>
            <option value="Product Manager">Product Manager</option>
            <option value="Associate Product Manager">Associate Product Manager</option>
            <option value="Marketing Specialist">Marketing Specialist</option>
            <option value="Content Strategist">Content Strategist</option>
            <option value="Sales Executive">Sales Executive</option>
            <option value="Account Manager">Account Manager</option>
            <option value="HR Manager">HR Manager</option>
            <option value="Talent Acquisition Specialist">
              Talent Acquisition Specialist
            </option>
          </select>
          <select
            className="filter-select"
            value={filters.status}
            onChange={(e) =>
              changeStatus(e.target.value as 'All' | 'Active' | 'Inactive')
            }
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              fontSize: 14,
              backgroundColor: '#fff',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          
          <button
            onClick={resetAllFilters}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              fontSize: 14,
              cursor: 'pointer',
              backgroundColor: '#f1f5f9',
              fontWeight: 600,
              color: '#475569',
              marginLeft: 'auto',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#e2e8f0'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
          >
            Reset Filters
          </button>
        </div>

        {/* Employees Grid Table Container */}
        <div className="table-container">
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: 14,
            }}
          >
            <thead>
              <tr className="table-header">
                <th style={{ padding: '18px 24px', fontWeight: 700 }}>Employee</th>
                <th style={{ padding: '18px 24px', fontWeight: 700 }}>ID</th>
                <th style={{ padding: '18px 24px', fontWeight: 700 }}>Department</th>
                <th style={{ padding: '18px 24px', fontWeight: 700 }}>Role</th>
                <th style={{ padding: '18px 24px', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '18px 24px', fontWeight: 700 }}>Join Date</th>
                <th style={{ padding: '18px 24px', fontWeight: 700, textAlign: 'right' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{ padding: '48px 24px', textAlign: 'center', color: '#94a3b8' }}
                  >
                    No employees found matching the current filters.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="table-row"
                    style={{ color: '#334155' }}
                  >
                    <td style={{ padding: '18px 24px' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>
                        {emp.name}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                        {emp.email}
                      </div>
                    </td>
                    <td style={{ padding: '18px 24px', fontWeight: 500 }}>{emp.id}</td>
                    <td style={{ padding: '18px 24px' }}>{emp.department}</td>
                    <td style={{ padding: '18px 24px' }}>{emp.role}</td>
                    <td style={{ padding: '18px 24px' }}>
                      <span className={`status-badge ${emp.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td style={{ padding: '18px 24px' }}>{emp.joinedDate}</td>
                    <td style={{ padding: '18px 24px', textAlign: 'right' }}>
                      <button
                        className="btn-remove"
                        onClick={() => {
                          removeEmployee(emp.id);
                          toast.info(`Removed employee ${emp.name}`);
                        }}
                      >
                        <svg style={{ marginRight: 6 }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal Overlay */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ margin: 0, fontSize: 18, color: '#0f172a', fontWeight: 800 }}>
                Add New Employee
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  cursor: 'pointer',
                  color: '#64748b',
                  lineHeight: 1,
                }}
              >
                &times;
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 24 }}>
              {/* Employee Name */}
              <div className="form-group">
                <label className="form-label">Employee Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter employee name"
                  {...register('name')}
                />
                {errors.name && (
                  <span className="error-text">{errors.name.message}</span>
                )}
              </div>

              {/* Email Address */}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@example.com"
                  {...register('email')}
                />
                {errors.email && (
                  <span className="error-text">{errors.email.message}</span>
                )}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 16,
                }}
              >
                {/* Department Selection */}
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="form-input" {...register('department')}>
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                  </select>
                  {errors.department && (
                    <span className="error-text">
                      {errors.department.message}
                    </span>
                  )}
                </div>

                {/* Role Selection (Dynamically updated based on department) */}
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select className="form-input" {...register('role')}>
                    <option value="">Select Role</option>
                    {availableRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  {errors.role && (
                    <span className="error-text">{errors.role.message}</span>
                  )}
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 16,
                }}
              >
                {/* Status */}
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-input" {...register('status')}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  {errors.status && (
                    <span className="error-text">{errors.status.message}</span>
                  )}
                </div>

                {/* Join Date */}
                <div className="form-group">
                  <label className="form-label">Join Date</label>
                  <input
                    type="date"
                    className="form-input"
                    {...register('joinedDate')}
                  />
                  {errors.joinedDate && (
                    <span className="error-text">
                      {errors.joinedDate.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Form Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 12,
                  marginTop: 24,
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#475569',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fff'; }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: 14,
                  }}
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer position="bottom-right" theme="light" />
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <DashboardTester />
    </Provider>
  );
}
