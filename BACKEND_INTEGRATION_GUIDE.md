# Backend Integration Guide for Admin Dashboard

## Overview
This guide provides the exact steps needed to integrate the 2 admin pages that currently use mock data with the backend.

---

## 🔴 Pages Requiring Backend Integration

### 1. Reservations Management
**File:** `src/admin/pages/reservations/AdminReservationsPage.jsx`

### 2. Users Management
**File:** `src/admin/pages/users/AdminUsersPage.jsx`

---

## 📝 Step-by-Step Integration

## Part 1: Reservations Management

### Step 1: Create Backend API Endpoints

Create a new controller in your backend:

**`ReservationController.java`**
```java
@RestController
@RequestMapping("/api/admin/reservations")
public class AdminReservationController {

    @GetMapping
    public ResponseEntity<PagedResponse<ReservationDTO>> getAllReservations(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String status
    ) {
        // Implementation
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ApiResponse> approveReservation(@PathVariable Long id) {
        // Create a loan for the user and mark reservation as FULFILLED
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse> cancelReservation(@PathVariable Long id) {
        // Mark reservation as CANCELLED
    }
}
```

**ReservationDTO.java**
```java
public class ReservationDTO {
    private Long id;
    private String bookTitle;
    private Long bookId;
    private String userName;
    private Long userId;
    private LocalDateTime reservationDate;
    private String status; // PENDING, FULFILLED, CANCELLED, EXPIRED
    private Integer priority;

    // Getters and setters
}
```

### Step 2: Create Redux Thunk

**`src/store/features/reservations/reservationThunk.js`**
```javascript
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../config/api';
import { getHeaders } from '../../../config/getHeaders';

const API_URL = '/api/admin/reservations';

export const fetchReservations = createAsyncThunk(
  'reservations/fetchAll',
  async ({ page, size, status }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ page, size });
      if (status) params.append('status', status);

      const response = await api.get(`${API_URL}?${params.toString()}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reservations');
    }
  }
);

export const approveReservation = createAsyncThunk(
  'reservations/approve',
  async (reservationId, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/${reservationId}/approve`, null, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve reservation');
    }
  }
);

export const cancelReservation = createAsyncThunk(
  'reservations/cancel',
  async (reservationId, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/${reservationId}/cancel`, null, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel reservation');
    }
  }
);
```

### Step 3: Create Redux Slice

**`src/store/features/reservations/reservationSlice.js`**
```javascript
import { createSlice } from '@reduxjs/toolkit';
import {
  fetchReservations,
  approveReservation,
  cancelReservation,
} from './reservationThunk';

const initialState = {
  reservations: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
  },
};

const reservationSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Reservations
      .addCase(fetchReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations = action.payload.content || action.payload;
        state.pagination = {
          currentPage: action.payload.number || 0,
          totalPages: action.payload.totalPages || 0,
          totalElements: action.payload.totalElements || 0,
          pageSize: action.payload.size || 10,
        };
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Approve Reservation
      .addCase(approveReservation.pending, (state) => {
        state.loading = true;
      })
      .addCase(approveReservation.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(approveReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel Reservation
      .addCase(cancelReservation.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelReservation.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(cancelReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = reservationSlice.actions;
export default reservationSlice.reducer;
```

### Step 4: Update Store

**`src/store/store.js`**
```javascript
import reservationReducer from './features/reservations/reservationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    bookLoans: bookLoanReducer,
    subscriptions: subscriptionReducer,
    subscriptionPlans: subscriptionPlanReducer,
    genres: genreReducer,
    payments: paymentReducer,
    bookReviews: bookReviewReducer,
    reservations: reservationReducer, // Add this
  },
});
```

### Step 5: Update AdminReservationsPage.jsx

Replace the mock data section:

```javascript
// REMOVE:
const [reservations, setReservations] = useState([...mock data...]);
const [loading, setLoading] = useState(false);

// ADD:
const { reservations, loading, pagination } = useSelector((state) => state.reservations);

// REMOVE:
const loadReservations = () => {
  // Mock implementation
  setLoading(false);
};

// ADD:
const loadReservations = () => {
  dispatch(
    fetchReservations({
      page,
      size: rowsPerPage,
      status: filterStatus || undefined,
    })
  );
};

// UPDATE handleApprove:
const handleApprove = async () => {
  try {
    await dispatch(approveReservation(selectedReservation.id)).unwrap();
    setApproveDialogOpen(false);
    loadReservations();
  } catch (error) {
    console.error('Error approving reservation:', error);
  }
};

// UPDATE handleCancel:
const handleCancel = async (reservation) => {
  if (window.confirm(`Cancel reservation #${reservation.id} for "${reservation.bookTitle}"?`)) {
    try {
      await dispatch(cancelReservation(reservation.id)).unwrap();
      loadReservations();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
    }
  }
};
```

---

## Part 2: Users Management

### Step 1: Create Backend API Endpoints

**`AdminUserController.java`**
```java
@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    @GetMapping
    public ResponseEntity<PagedResponse<UserDTO>> getAllUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        // Implementation
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<ApiResponse> updateUserRole(
        @PathVariable Long id,
        @RequestBody UpdateRoleRequest request
    ) {
        // Update user role (USER -> ADMIN)
    }

    @PutMapping("/{id}/toggle-active")
    public ResponseEntity<ApiResponse> toggleUserActive(
        @PathVariable Long id,
        @RequestBody ToggleActiveRequest request
    ) {
        // Activate or deactivate user account
    }
}
```

**Enhanced UserDTO.java**
```java
public class UserDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String profilePicture;
    private String role; // USER, ADMIN
    private Boolean active;
    private LocalDateTime createdDate;

    // Activity statistics
    private Integer totalLoans;
    private Integer activeLoans;
    private Integer reviewsCount;
    private Boolean hasSubscription;

    // Getters and setters
}
```

### Step 2: Create Redux Thunk

**`src/store/features/adminUsers/adminUserThunk.js`**
```javascript
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../config/api';
import { getHeaders } from '../../../config/getHeaders';

const API_URL = '/api/admin/users';

export const fetchUsers = createAsyncThunk(
  'adminUsers/fetchAll',
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}?page=${page}&size=${size}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'adminUsers/updateRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `${API_URL}/${userId}/role`,
        { role },
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user role');
    }
  }
);

export const toggleUserActive = createAsyncThunk(
  'adminUsers/toggleActive',
  async ({ userId, active }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `${API_URL}/${userId}/toggle-active`,
        { active },
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle user status');
    }
  }
);
```

### Step 3: Create Redux Slice

**`src/store/features/adminUsers/adminUserSlice.js`**
```javascript
import { createSlice } from '@reduxjs/toolkit';
import { fetchUsers, updateUserRole, toggleUserActive } from './adminUserThunk';

const initialState = {
  users: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
  },
};

const adminUserSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.content || action.payload;
        state.pagination = {
          currentPage: action.payload.number || 0,
          totalPages: action.payload.totalPages || 0,
          totalElements: action.payload.totalElements || 0,
          pageSize: action.payload.size || 10,
        };
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update User Role
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserRole.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle User Active
      .addCase(toggleUserActive.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleUserActive.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(toggleUserActive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminUserSlice.actions;
export default adminUserSlice.reducer;
```

### Step 4: Update Store

**`src/store/store.js`**
```javascript
import adminUserReducer from './features/adminUsers/adminUserSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    bookLoans: bookLoanReducer,
    subscriptions: subscriptionReducer,
    subscriptionPlans: subscriptionPlanReducer,
    genres: genreReducer,
    payments: paymentReducer,
    bookReviews: bookReviewReducer,
    reservations: reservationReducer,
    adminUsers: adminUserReducer, // Add this
  },
});
```

### Step 5: Update AdminUsersPage.jsx

Replace the mock data section:

```javascript
// REMOVE:
const [users, setUsers] = useState([...mock data...]);
const [loading, setLoading] = useState(false);

// ADD:
const { users, loading, pagination } = useSelector((state) => state.adminUsers);

// UPDATE loadUsers:
const loadUsers = () => {
  dispatch(fetchUsers({ page, size: rowsPerPage }));
};

// UPDATE handleUpgradeToAdmin:
const handleUpgradeToAdmin = async (user) => {
  if (
    window.confirm(
      `Upgrade "${user.fullName}" to admin role? This will grant full administrative privileges.`
    )
  ) {
    try {
      await dispatch(updateUserRole({ userId: user.id, role: 'ADMIN' })).unwrap();
      loadUsers();
    } catch (error) {
      console.error('Error upgrading user:', error);
    }
  }
};

// UPDATE handleToggleActive:
const handleToggleActive = async (user) => {
  const action = user.active ? 'deactivate' : 'activate';
  if (
    window.confirm(
      `${action.charAt(0).toUpperCase() + action.slice(1)} user "${user.fullName}"?`
    )
  ) {
    try {
      await dispatch(toggleUserActive({ userId: user.id, active: !user.active })).unwrap();
      loadUsers();
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
    }
  }
};
```

---

## 🎯 Testing Checklist

After implementing the backend integration:

### Reservations:
- [ ] Fetch all reservations from backend
- [ ] Apply status filter (PENDING, FULFILLED, CANCELLED, EXPIRED)
- [ ] Search functionality works
- [ ] Approve reservation creates a loan and updates status
- [ ] Cancel reservation updates status
- [ ] Statistics cards show correct counts
- [ ] Pagination works correctly

### Users:
- [ ] Fetch all users from backend
- [ ] Search by name, email, phone works
- [ ] View user details dialog shows correct data
- [ ] Upgrade to admin changes user role
- [ ] Deactivate/Activate user toggles status
- [ ] Statistics cards show correct counts
- [ ] Pagination works correctly

---

## 🚨 Common Issues & Solutions

### Issue 1: CORS Error
**Solution:** Ensure backend allows requests from your frontend origin:
```java
@CrossOrigin(origins = "http://localhost:5173")
```

### Issue 2: 403 Forbidden
**Solution:** Verify JWT token is being sent in headers and user has ADMIN role

### Issue 3: 404 Not Found
**Solution:** Check API endpoint paths match between frontend and backend

### Issue 4: Pagination Not Working
**Solution:** Ensure backend returns data in PagedResponse format with:
- `content`: Array of items
- `number`: Current page number
- `totalPages`: Total number of pages
- `totalElements`: Total number of items
- `size`: Page size

---

## 📚 Additional Resources

### Backend Response Format

All admin endpoints should return standardized responses:

**Success Response:**
```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Error message here",
  "errorCode": "ERROR_CODE"
}
```

**Paged Response:**
```json
{
  "content": [ ... ],
  "number": 0,
  "size": 10,
  "totalPages": 5,
  "totalElements": 50
}
```

---

## ✅ Completion Checklist

- [ ] Backend API endpoints created for Reservations
- [ ] Backend API endpoints created for Users
- [ ] Reservation Redux thunk and slice created
- [ ] Admin Users Redux thunk and slice created
- [ ] Both reducers added to store
- [ ] AdminReservationsPage.jsx updated to use Redux
- [ ] AdminUsersPage.jsx updated to use Redux
- [ ] All functionality tested
- [ ] Error handling verified
- [ ] Pagination tested
- [ ] Search and filters tested

---

Once these steps are complete, all admin pages will be fully integrated with the backend and ready for production use!

**Last Updated:** 2025-10-11
