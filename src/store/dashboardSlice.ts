import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

// Types moved inside dashboardSlice for clean folder structure
export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: 'Active' | 'Inactive';
  joinedDate: string; // ISO date string (YYYY-MM-DD)
  avatar: string;
}

export interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

export interface DashboardFilters {
  department: string;
  role: string;
  searchQuery: string;
  status: 'All' | 'Active' | 'Inactive';
  dateRange: DateRange;
}

export interface DashboardStats {
  totalHeadcount: number;
  activeCount: number;
  newHires: number;
  attritionRate: number;
  departmentDistribution: { name: string; value: number }[];
  roleDistribution: { name: string; value: number }[];
  monthlyHiringTrend: { month: string; count: number }[];
}

export interface DashboardState {
  employees: Employee[];
  filteredEmployees: Employee[];
  filters: DashboardFilters;
  stats: DashboardStats;
  loading: boolean;
  error: string | null;
}

// 5 default mock employee records
export const mockEmployees: Employee[] = [
  {
    id: "EMP-001",
    name: "Sanjay",
    email: "sanjay@example.com",
    department: "Engineering",
    role: "Frontend Engineer",
    status: "Active",
    joinedDate: "2025-01-15",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sanjay"
  },
  {
    id: "EMP-002",
    name: "Rohith",
    email: "rohith@example.com",
    department: "Engineering",
    role: "Backend Engineer",
    status: "Active",
    joinedDate: "2024-03-12",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohith"
  },
  {
    id: "EMP-003",
    name: "Dhoni",
    email: "dhoni@example.com",
    department: "Engineering",
    role: "Fullstack Engineer",
    status: "Active",
    joinedDate: "2024-08-20",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dhoni"
  },
  {
    id: "EMP-004",
    name: "Virat",
    email: "virat@example.com",
    department: "Design",
    role: "Product Designer",
    status: "Active",
    joinedDate: "2025-05-10",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Virat"
  },
  {
    id: "EMP-005",
    name: "Hardik",
    email: "hardik@example.com",
    department: "Product",
    role: "Product Manager",
    status: "Active",
    joinedDate: "2023-11-01",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hardik"
  }
];

const initialFilters: DashboardFilters = {
  department: 'All',
  role: 'All',
  searchQuery: '',
  status: 'All',
  dateRange: {
    startDate: null,
    endDate: null,
  },
};

const initialStats: DashboardStats = {
  totalHeadcount: 0,
  activeCount: 0,
  newHires: 0,
  attritionRate: 0,
  departmentDistribution: [],
  roleDistribution: [],
  monthlyHiringTrend: [],
};

const initialState: DashboardState = {
  employees: [],
  filteredEmployees: [],
  filters: initialFilters,
  stats: initialStats,
  loading: false,
  error: null,
};

// Helper function to filter employees list and compute stats
const applyFiltersAndCalculateStats = (state: DashboardState) => {
  const { department, role, searchQuery, status, dateRange } = state.filters;

  // 1. Filter logic
  let filtered = [...state.employees];

  if (department && department !== 'All') {
    filtered = filtered.filter(
      (emp) => emp.department.toLowerCase() === department.toLowerCase()
    );
  }

  if (role && role !== 'All') {
    filtered = filtered.filter(
      (emp) => emp.role.toLowerCase() === role.toLowerCase()
    );
  }

  if (status && status !== 'All') {
    filtered = filtered.filter(
      (emp) => emp.status.toLowerCase() === status.toLowerCase()
    );
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (emp) =>
        emp.name.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.id.toLowerCase().includes(query) ||
        emp.role.toLowerCase().includes(query) ||
        emp.department.toLowerCase().includes(query)
    );
  }

  if (dateRange.startDate) {
    filtered = filtered.filter((emp) => emp.joinedDate >= dateRange.startDate!);
  }

  if (dateRange.endDate) {
    filtered = filtered.filter((emp) => emp.joinedDate <= dateRange.endDate!);
  }

  state.filteredEmployees = filtered;

  // 2. Calculations
  const total = filtered.length;
  const active = filtered.filter((emp) => emp.status === 'Active').length;
  const inactive = total - active;

  // Base date for "current" is 2026-07-05 (matching system date)
  const currentDate = dayjs('2026-07-05');
  const ninetyDaysAgo = currentDate.subtract(90, 'day');

  const newHiresCount = filtered.filter((emp) => {
    const joined = dayjs(emp.joinedDate);
    return (
      joined.isAfter(ninetyDaysAgo) && joined.isBefore(currentDate.add(1, 'day'))
    );
  }).length;

  const attrition = total > 0 ? Math.round((inactive / total) * 100) : 0;

  // Department distribution
  const deptMap: Record<string, number> = {};
  filtered.forEach((emp) => {
    deptMap[emp.department] = (deptMap[emp.department] || 0) + 1;
  });
  const departmentDistribution = Object.entries(deptMap).map(([name, value]) => ({
    name,
    value,
  }));

  // Role distribution
  const roleMap: Record<string, number> = {};
  filtered.forEach((emp) => {
    roleMap[emp.role] = (roleMap[emp.role] || 0) + 1;
  });
  const roleDistribution = Object.entries(roleMap).map(([name, value]) => ({
    name,
    value,
  }));

  // Monthly hiring trends for the last 6 months
  const monthlyTrend: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const m = currentDate.subtract(i, 'month');
    const monthLabel = m.format('MMM YY');
    const start = m.startOf('month');
    const end = m.endOf('month');

    const count = filtered.filter((emp) => {
      const joined = dayjs(emp.joinedDate);
      return (
        (joined.isSame(start) || joined.isAfter(start)) &&
        (joined.isSame(end) || joined.isBefore(end))
      );
    }).length;

    monthlyTrend.push({ month: monthLabel, count });
  }

  state.stats = {
    totalHeadcount: total,
    activeCount: active,
    newHires: newHiresCount,
    attritionRate: attrition,
    departmentDistribution,
    roleDistribution,
    monthlyHiringTrend: monthlyTrend,
  };
};

// Async Thunk simulating future API integration
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_filters: DashboardFilters | undefined, { rejectWithValue }) => {
    try {
      // Future integration note: Here we would perform an HTTP request, e.g.:
      // const response = await axios.get('/api/dashboard', { params: _filters });
      // return response.data;

      // Simulating network latency
      await new Promise((resolve) => setTimeout(resolve, 800));
      return mockEmployees;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch dashboard data');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDepartmentFilter: (state, action: PayloadAction<string>) => {
      state.filters.department = action.payload;
      applyFiltersAndCalculateStats(state);
    },
    setRoleFilter: (state, action: PayloadAction<string>) => {
      state.filters.role = action.payload;
      applyFiltersAndCalculateStats(state);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
      applyFiltersAndCalculateStats(state);
    },
    setStatusFilter: (state, action: PayloadAction<'All' | 'Active' | 'Inactive'>) => {
      state.filters.status = action.payload;
      applyFiltersAndCalculateStats(state);
    },
    setDateRange: (state, action: PayloadAction<DateRange>) => {
      state.filters.dateRange = action.payload;
      applyFiltersAndCalculateStats(state);
    },
    resetFilters: (state) => {
      state.filters = initialFilters;
      applyFiltersAndCalculateStats(state);
    },
    // CRUD state capabilities to enrich widget utility
    addEmployee: (
      state,
      action: PayloadAction<Omit<Employee, 'id' | 'avatar'>>
    ) => {
      const nextIdNum = state.employees.length + 1;
      const formattedId = `EMP-${String(nextIdNum).padStart(3, '0')}`;
      const newEmp: Employee = {
        ...action.payload,
        id: formattedId,
        joinedDate: action.payload.joinedDate || dayjs().format('YYYY-MM-DD'),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${action.payload.name}`,
      };
      state.employees.push(newEmp);
      applyFiltersAndCalculateStats(state);
    },
    deleteEmployee: (state, action: PayloadAction<string>) => {
      state.employees = state.employees.filter((emp) => emp.id !== action.payload);
      applyFiltersAndCalculateStats(state);
    },
    updateEmployeeStatus: (
      state,
      action: PayloadAction<{ id: string; status: 'Active' | 'Inactive' }>
    ) => {
      const emp = state.employees.find((e) => e.id === action.payload.id);
      if (emp) {
        emp.status = action.payload.status;
        applyFiltersAndCalculateStats(state);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action: PayloadAction<Employee[]>) => {
        state.loading = false;
        state.employees = action.payload;
        applyFiltersAndCalculateStats(state);
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'An error occurred';
      });
  },
});

export const {
  setDepartmentFilter,
  setRoleFilter,
  setSearchQuery,
  setStatusFilter,
  setDateRange,
  resetFilters,
  addEmployee,
  deleteEmployee,
  updateEmployeeStatus,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
