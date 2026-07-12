# TransitOps - Smart Transport Operations Platform
## 8-Hour Hackathon Work Distribution & Implementation Plan

This document establishes a professional, clear, and perfectly balanced work distribution plan for our 4-person development team. It aligns all functional requirements, database entities, strict business rules, and bonus features from the product specification into cohesive tasks distributed equally across frontend and backend responsibilities.

---

## 🗺️ High-Level Architecture & Tech Stack

To ensure rapid integration and seamless collaboration during the 8-hour hackathon, we are using the following stack:
* **Frontend**: React (Vite) + TailwindCSS/CSS Modules + React Router DOM + Zustand (State Management) + Recharts (for analytics).
* **Backend**: Node.js + Express.js (Modular Router pattern) + SQLite / PostgreSQL (Relational DB for enforcing transactional integrity and foreign keys).
* **Communication**: REST APIs (JSON payload) + CORS enabled.
* **Email Client**: Nodemailer (for automated notifications).

---

## 👥 Core Team Roles & Summary of Division

| Developer | Primary Backend Scope | Primary Frontend Scope | Key Integration Points |
| :--- | :--- | :--- | :--- |
| **Developer 1 (You)** | Auth & RBAC Middleware, User & Role Seeders, Dashboard KPI API, General Setup | App Shell Layout, Dark Mode, Authentication Screens, Dashboard Screen with filters | Auth state context, shared Axios setup, page layout wrappers |
| **Developer 2** | Vehicle Registry CRUD APIs, Maintenance Logs APIs & Automatic Status Transition Logic | Vehicle Management Screen, Add/Edit Vehicle Forms, Maintenance Logs Screen | Vehicle availability check for dispatch dropdown |
| **Developer 3** | Driver Profile CRUD APIs, Fuel & Expense Recording APIs, Email Reminder Service | Driver Directory Screen, Add/Edit Driver Forms, Fuel & Expenses Log interface | Driver availability & license expiry checks for trips |
| **Developer 4** | Trip Management APIs, Dispatch Validation Engine, Analytics & ROI Calculation APIs | Trip Scheduling Portal, Trip Status Controls, Reports & Analytics Visualizations | State transitions of vehicles & drivers upon trip dispatch/completion |

---

## 🛠️ Module-by-Module Breakdown & Owner Assignment

### Developer 1: Core Shell, Auth, RBAC & Executive Dashboard
**Backend (50%) & Frontend (50%)**

#### 🖥️ Frontend Deliverables
1. **App Shell Layout**:
   * Create the global template containing the **Collapsible Sidebar Navigation** and **Top Navbar**.
   * Responsive drawer layout for mobile support.
   * Implement **Dark Mode Toggle** (Bonus Feature) using local state/CSS variables.
2. **Authentication Screen**:
   * Login Page styled with a modern glassmorphism UI.
   * Email/Password forms with validation.
   * Session storage integration using a React-Zustand store (`useAuthStore`).
3. **Executive Dashboard Screen**:
   * High-impact metrics grid displaying real-time KPIs:
     * *Active Vehicles*, *Available Vehicles*, *Vehicles in Maintenance*.
     * *Active Trips*, *Pending Trips*.
     * *Drivers On Duty*, *Fleet Utilization (%)*.
   * Filter Bar: Dropdowns to filter metrics by **Vehicle Type**, **Vehicle Status**, and **Region**.

#### ⚙️ Backend Deliverables
1. **Project Scaffold & Common Setup**:
   * Initialize Express project structure with folders (`src/routes`, `src/controllers`, `src/middleware`, `src/lib`).
   * Setup global error handling middleware and CORS.
2. **Auth & RBAC Middleware**:
   * POST `/api/auth/login` and POST `/api/auth/logout`.
   * Secure Session/JWT token signing.
   * Create `authorizeRoles(...roles)` middleware to protect specific endpoints (e.g. only `Financial Analyst` can view ROI, only `Fleet Manager` can create vehicles).
3. **Database Seeding**:
   * Script to seed **Roles** (`Fleet Manager`, `Driver`, `Safety Officer`, `Financial Analyst`) and **Users**.
4. **Dashboard Aggregations API**:
   * GET `/api/dashboard/stats`: Returns calculated KPI counters.
   * Implement filtering parameters (`?type=...&status=...&region=...`) and map them to database `COUNT` and `SUM` operations.

---

### Developer 2: Vehicle Registry & Maintenance Operations
**Backend (50%) & Frontend (50%)**

#### 🖥️ Frontend Deliverables
1. **Vehicle Registry Screen**:
   * Responsive list/grid of vehicles with column headers: Registration Number, Name/Model, Type, Max Load Capacity, Odometer, Acquisition Cost, and Status.
   * Badges indicating status: `Available` (Green), `On Trip` (Blue), `In Shop` (Orange), `Retired` (Red).
   * Search, filter by status, and sort by Odometer/Acquisition Cost (Bonus Feature).
2. **Add/Edit Vehicle Modal**:
   * Validation-secured form for vehicle attributes.
   * Ensures Registration Number is unique before submitting.
3. **Maintenance Logs Screen**:
   * A secondary panel or detail view for creating maintenance logs.
   * Forms containing fields for: Vehicle select, Maintenance Type (e.g., Oil Change, Repair), Cost, Start Date, and Estimated Completion.
4. **Vehicle Document Management (Bonus Feature)**:
   * Interface to upload and list attachments (Insurance PDF, Registration scans).

#### ⚙️ Backend Deliverables
1. **Vehicle CRUD Endpoints**:
   * GET `/api/vehicles`, POST `/api/vehicles`, PUT `/api/vehicles/:id`, DELETE `/api/vehicles/:id`.
   * Strict validation rule: Registration Number must be unique (`UNIQUE` constraint at DB level).
2. **Maintenance Log Endpoints**:
   * GET `/api/maintenance`, POST `/api/maintenance`, PUT `/api/maintenance/:id/close`.
3. **Status Automations & Business Rules (Critical)**:
   * **Rule 1**: Creating an active maintenance record automatically sets the corresponding vehicle's status to `In Shop`.
   * **Rule 2**: Closing/completing a maintenance record automatically restores the vehicle's status to `Available` (unless its status has been changed to `Retired`).
4. **Document Attachment Storage**:
   * Upload endpoints using `multer` to store documents locally under `/uploads` and save paths in the database.

---

### Developer 3: Driver Profiles, Licensing & Expenses
**Backend (50%) & Frontend (50%)**

#### 🖥️ Frontend Deliverables
1. **Driver Directory Screen**:
   * Table displaying: Driver Name, License Number, License Category, License Expiry Date, Contact Number, Safety Score (0-100), and Status.
   * Color-coded status badges: `Available` (Green), `On Trip` (Blue), `Off Duty` (Gray), `Suspended` (Red).
   * Highlights in RED if the license expiry date is in the past.
   * Search input, filtering by status, and sorting by safety score (Bonus Feature).
2. **Add/Edit Driver Modal**:
   * Input forms validating fields (contact number format, expiry dates, etc.).
3. **Fuel & Expenses Logging Screen**:
   * Unified ledger interface to list and record:
     * **Fuel logs**: Liters, Cost per Liter, Total Cost, Date, Current Odometer.
     * **Other expenses**: Tolls, Insurance fees, miscellaneous operational costs.

#### ⚙️ Backend Deliverables
1. **Driver CRUD Endpoints**:
   * GET `/api/drivers`, POST `/api/drivers`, PUT `/api/drivers/:id`, DELETE `/api/drivers/:id`.
2. **Fuel & Expenses Endpoints**:
   * GET `/api/expenses`, POST `/api/expenses` (records fuel logs and general expense entities).
3. **Calculations & Business Logic**:
   * Automatically compute total operational cost (`Fuel Cost` + `Maintenance Cost` + `General Expenses`) per vehicle. Expose via GET `/api/vehicles/:id/expenses`.
4. **Email Reminders Service (Bonus Feature)**:
   * Setup a background cron task (using `node-cron` or simple timer logic) that scans driver licenses.
   * Triggers an automated notification email using **Nodemailer** if a driver's license is expiring within 30 days.

---

### Developer 4: Trip Management, Dispatch Workflow & Reports
**Backend (50%) & Frontend (50%)**

#### 🖥️ Frontend Deliverables
1. **Trip Management Portal**:
   * Main list showing active, completed, draft, and cancelled trips.
   * Status indicators for the trip lifecycle: `Draft` ➔ `Dispatched` ➔ `Completed` / `Cancelled`.
2. **Create/Dispatch Trip Form**:
   * Input fields for: Source location, Destination, Cargo Weight, and Planned Distance.
   * **Vehicle Dropdown**: Fetches only eligible vehicles (must be `Available`, not `Retired`, and not `In Shop`).
   * **Driver Dropdown**: Fetches only eligible drivers (must be `Available`, not `Suspended`, and with a valid unexpired license).
3. **Trip Action Controllers**:
   * "Dispatch" button to trigger the active trip state.
   * "Complete" button triggers a modal requiring: **Final Odometer Reading** and **Fuel Consumed (Liters)**.
   * "Cancel" button to roll back the trip.
4. **Reports & Analytics Screen (Bonus & Core)**:
   * Elegant visual charts displaying Fuel Efficiency (Distance / Fuel), Fleet Utilization trends, and Operational Costs.
   * High-end data table representing **Vehicle ROI**:
     $$\text{ROI} = \frac{\text{Revenue} - (\text{Maintenance} + \text{Fuel})}{\text{Acquisition Cost}}$$
   * Buttons to export reports to **CSV** and **PDF** (using libraries like `jsPDF` or server-side rendering).

#### ⚙️ Backend Deliverables
1. **Trip CRUD & Transaction Endpoints**:
   * GET `/api/trips`, POST `/api/trips`, PATCH `/api/trips/:id/status`.
2. **Strict Dispatch Validation Engine (Mandatory Business Rules)**:
   * Prior to transition `Draft` ➔ `Dispatched`, check:
     1. Vehicle status is `Available` (reject if `Retired` or `In Shop`).
     2. Driver status is `Available` (reject if `Suspended` or `Off Duty`).
     3. Driver license is valid (expiry date > current date).
     4. Vehicle is not already assigned to an active trip.
     5. Cargo Weight $\le$ Vehicle's Maximum Load Capacity.
3. **Status State Machine Transitions**:
   * **Dispatching a trip**: Changes both vehicle and driver status to `On Trip`.
   * **Completing a trip**: Changes both vehicle and driver status back to `Available`. Updates vehicle odometer reading and appends a fuel consumption log.
   * **Cancelling a dispatched trip**: Restores both vehicle and driver status to `Available`.
4. **Reports & Analytics Aggregation API**:
   * GET `/api/reports/analytics`: Returns lists of ROI metrics per vehicle and calculates average fuel efficiencies.
   * CSV & PDF export endpoints.

---

## 🗄️ Database Entity Schema Design

The following tables must be created and linked to maintain data integrity:

```mermaid
erDiagram
    USERS ||--|| ROLES : "has"
    VEHICLES ||--o{ TRIPS : "assigned to"
    VEHICLES ||--o{ MAINTENANCE_LOGS : "undergoes"
    VEHICLES ||--o{ FUEL_LOGS : "consumes"
    VEHICLES ||--o{ EXPENSES : "incurs"
    DRIVERS ||--o{ TRIPS : "drives"

    USERS {
        int id PK
        string email
        string password_hash
        int role_id FK
    }
    ROLES {
        int id PK
        string name "Fleet Manager | Driver | Safety Officer | Financial Analyst"
    }
    VEHICLES {
        int id PK
        string reg_number UNIQUE
        string model
        string type
        float max_load_capacity
        float odometer
        float acquisition_cost
        string status "Available | On Trip | In Shop | Retired"
        string region
    }
    DRIVERS {
        int id PK
        string name
        string license_number
        string license_category
        date license_expiry_date
        string contact_number
        int safety_score
        string status "Available | On Trip | Off Duty | Suspended"
    }
    TRIPS {
        int id PK
        string source
        string destination
        float cargo_weight
        float planned_distance
        float final_odometer
        float fuel_consumed
        string status "Draft | Dispatched | Completed | Cancelled"
        int vehicle_id FK
        int driver_id FK
        float revenue
    }
    MAINTENANCE_LOGS {
        int id PK
        int vehicle_id FK
        string type
        float cost
        date start_date
        date completion_date
        string status "Active | Closed"
    }
    FUEL_LOGS {
        int id PK
        int vehicle_id FK
        float liters
        float cost
        date date
    }
    EXPENSES {
        int id PK
        int vehicle_id FK
        string expense_type "Toll | Maintenance | Other"
        float cost
        date date
    }
```

---

## ⏱️ Hackathon 8-Hour Suggested Schedule

| Phase | Duration | Hour | Developer Tasks |
| :--- | :--- | :--- | :--- |
| **Phase 1: Setup** | 1 Hour | H0 - H1 | Dev 1 sets up backend server, DB schemas, and seeds. Devs 2, 3, 4 pull the code and set up base routes / folder structures. |
| **Phase 2: Core Dev** | 3.5 Hours | H1 - H4.5 | Devs build their respective APIs and frontend views in parallel. Run tests using Postman/Swagger. |
| **Phase 3: Integration** | 1.5 Hours | H4.5 - H6 | Merge Git branches. Connect frontend views to backend APIs. Verify user state sharing and status triggers. |
| **Phase 4: Polish & Refine** | 1.5 Hours | H6 - H7.5 | Implement bonus features (Dark Mode, Charts, Email checks, Export formats). UI styling, animations, and transitions. |
| **Phase 5: Dry Run** | 0.5 Hour | H7.5 - H8 | Walk through the user workflow from Registration to Reports. Ensure all business rule validations trigger correctly. |

---

## 📢 Integration Guidelines & Git Strategy

1. **Git Branching**:
   * Each developer works on their designated branch:
     * `feature/auth-dashboard` (Developer 1)
     * `feature/vehicles-maintenance` (Developer 2)
     * `feature/drivers-expenses` (Developer 3)
     * `feature/trips-analytics` (Developer 4)
2. **API Conventions**:
   * Base URL: `/api`
   * Always send and receive JSON requests.
   * Respond with standardized error formats: `{ "error": "Detailed error message" }`.
3. **Database Access**:
   * Avoid concurrent write lock issues by using transactions for operations that touch both `trips` and `vehicles`/`drivers` tables.
