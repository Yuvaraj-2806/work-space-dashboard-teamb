# Dashboard Features - Sprint 1 (State Management)

Objective: Build functional dashboard features such as filters, widgets, state management, and integrate all dashboard components into a working screen.

## Member 8: Dashboard State Management
Exposes global state and actions for adding, removing, filtering, and summarizing employees:

- **State Slice**: `src/store/dashboardSlice.ts`
- **Store Configuration**: `src/store/index.ts`
- **Custom Hook**: `src/hooks/useDashboard.ts`

## Key Features
1. **Dynamic Statistics**: Dynamic metrics (Headcount, Active counts, New Hires, Attrition Rate) recalculate in real-time on the client side whenever employee lists or filters change.
2. **Advanced Filtering**: Filtering by search query (name/role/email/dept), status, role, and department.
3. **Interactive Employee Modal Form**: Validation powered by `react-hook-form` and `yup` to add new employees.
4. **Toast Alerts**: Built-in notifications using `react-toastify`.
5. **Modern Transitions**: Transitions and hover states in `src/index.css`.

## Installation & Running

To run the application locally:
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
