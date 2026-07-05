import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  setDepartmentFilter,
  setRoleFilter,
  setSearchQuery,
  setStatusFilter,
  setDateRange,
  resetFilters,
  fetchDashboardData,
  addEmployee,
  deleteEmployee,
  updateEmployeeStatus,
  Employee,
} from '../store/dashboardSlice';

export const useDashboard = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const employees = useAppSelector((state) => state.dashboard.employees);
  const filteredEmployees = useAppSelector((state) => state.dashboard.filteredEmployees);
  const filters = useAppSelector((state) => state.dashboard.filters);
  const stats = useAppSelector((state) => state.dashboard.stats);
  const loading = useAppSelector((state) => state.dashboard.loading);
  const error = useAppSelector((state) => state.dashboard.error);

  // Dispatchers (wrapped in useCallback for performance optimization)
  const loadData = useCallback(() => {
    dispatch(fetchDashboardData(filters));
  }, [dispatch, filters]);

  const changeDepartment = useCallback(
    (department: string) => {
      dispatch(setDepartmentFilter(department));
    },
    [dispatch]
  );

  const changeRole = useCallback(
    (role: string) => {
      dispatch(setRoleFilter(role));
    },
    [dispatch]
  );

  const changeSearchQuery = useCallback(
    (query: string) => {
      dispatch(setSearchQuery(query));
    },
    [dispatch]
  );

  const changeStatus = useCallback(
    (status: 'All' | 'Active' | 'Inactive') => {
      dispatch(setStatusFilter(status));
    },
    [dispatch]
  );

  const changeDateRange = useCallback(
    (startDate: string | null, endDate: string | null) => {
      dispatch(setDateRange({ startDate, endDate }));
    },
    [dispatch]
  );

  const resetAllFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  // CRUD helpers
  const addNewEmployee = useCallback(
    (employeeData: Omit<Employee, 'id' | 'avatar'>) => {
      dispatch(addEmployee(employeeData));
    },
    [dispatch]
  );

  const removeEmployee = useCallback(
    (id: string) => {
      dispatch(deleteEmployee(id));
    },
    [dispatch]
  );

  const toggleEmployeeStatus = useCallback(
    (id: string, status: 'Active' | 'Inactive') => {
      dispatch(updateEmployeeStatus({ id, status }));
    },
    [dispatch]
  );

  return {
    // State values
    employees,
    filteredEmployees,
    filters,
    stats,
    loading,
    error,

    // Dispatch operations
    loadData,
    changeDepartment,
    changeRole,
    changeSearchQuery,
    changeStatus,
    changeDateRange,
    resetAllFilters,
    addNewEmployee,
    removeEmployee,
    toggleEmployeeStatus,
  };
};
