import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SearchIcon from '@mui/icons-material/Search';

import { useDashboard } from '../../hooks/useDashboard';

const departments = ['IT', 'HR', 'Finance', 'Sales', 'Marketing'];
const roles = ['Developer', 'Tester', 'Manager', 'HR Executive'];
const locations = ['Chennai', 'Bangalore', 'Hyderabad', 'Pune'];
const statuses = ['Active', 'Inactive'];

export function DashboardFilter() {
  const {
    filters,
    changeDepartment,
    changeRole,
    changeLocation,
    changeStatus,
    resetAllFilters,
  } = useDashboard();

  const handleApply = () => {
    console.log('Current Filters:', filters);
  };

  return (
    <Box
      sx={{
        pt: 5,
        pb: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          p: 4,
          borderRadius: 4,
        }}
      >
        {/* Header */}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterAltIcon color="primary" fontSize="large" />

            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold' }}
              color="primary"
            >
              Workforce Dashboard
            </Typography>
          </Box>

          <Typography color="text.secondary">
            Dashboard Filters
          </Typography>
        </Box>

        {/* Filters */}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            >
              <InputLabel>Department</InputLabel>

              <Select
                value={filters.department === 'All' ? '' : filters.department}
                label="Department"
                onChange={(e) => changeDepartment(e.target.value || 'All')}
              >
                <MenuItem value="">All Departments</MenuItem>

                {departments.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            >
              <InputLabel>Role</InputLabel>

              <Select
                value={filters.role === 'All' ? '' : filters.role}
                label="Role"
                onChange={(e) => changeRole(e.target.value || 'All')}
              >
                <MenuItem value="">All Roles</MenuItem>

                {roles.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            >
              <InputLabel>Location</InputLabel>

              <Select
                value={filters.location === 'All' ? '' : filters.location}
                label="Location"
                onChange={(e) => changeLocation(e.target.value || 'All')}
              >
                <MenuItem value="">All Locations</MenuItem>

                {locations.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            >
              <InputLabel>Status</InputLabel>

              <Select
                value={filters.status === 'All' ? '' : filters.status}
                label="Status"
                onChange={(e) => changeStatus((e.target.value || 'All') as any)}
              >
                <MenuItem value="">All Status</MenuItem>

                {statuses.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Buttons */}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            mt: 5,
          }}
        >
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<RestartAltIcon />}
            onClick={resetAllFilters}
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1.2,
              textTransform: 'none',
              fontWeight: 'bold',
            }}
          >
            Reset
          </Button>

          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleApply}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.2,
              textTransform: 'none',
              fontWeight: 'bold',
              boxShadow: '0 10px 20px rgba(25,118,210,0.35)',
            }}
          >
            Apply Filters
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default DashboardFilter;
