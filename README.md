# 🚚 TransitOps – Smart Transport Operations Platform

Welcome to the TransitOps repository!

We have prepared a professional and comprehensive work distribution plan for our 4-person team. This plan divides both frontend and backend tasks equally to ensure smooth execution during the 8-hour hackathon.

👉 **View the complete work distribution plan here: [work_distribution.md](work_distribution.md)**

TransitOps is a centralized Transport Operations Management System designed to help logistics and transport companies manage vehicles, drivers, trips, maintenance, fuel consumption, expenses, and operational analytics from a single platform.

The platform replaces manual spreadsheets and logbooks with a digital system that improves operational efficiency, prevents scheduling conflicts, enforces business rules, and provides real-time insights into fleet operations.

---

## 🎯 Objective

The objective of TransitOps is to build an end-to-end transport management platform that digitizes the complete lifecycle of transport operations.

The system manages:

- Vehicles
- Drivers
- Trips and Dispatch
- Vehicle Maintenance
- Fuel Logs
- Operational Expenses
- Reports and Analytics

---

## 👥 Target Users

### Fleet Manager

Manages fleet vehicles, maintenance schedules, vehicle lifecycle, and overall fleet efficiency.

### Driver / Dispatcher

Creates trips, assigns available vehicles and drivers, and monitors active deliveries.

### Safety Officer

Monitors driver licenses, driver eligibility, safety scores, and compliance.

### Financial Analyst

Tracks fuel expenses, maintenance costs, operational costs, and vehicle profitability.

---

## ✨ Core Features

### 🔐 Authentication & Role-Based Access Control

- Secure login using email and password.
- Role-Based Access Control (RBAC).
- Only authenticated users can access the application.
- Different users have different permissions.

### 📊 Dashboard

The dashboard provides important operational KPIs such as:

- Active Vehicles
- Available Vehicles
- Vehicles in Maintenance
- Active Trips
- Pending Trips
- Drivers On Duty
- Fleet Utilization

Users can filter data based on vehicle type, status, and region.

### 🚛 Vehicle Management

Users can add, view, update, and manage vehicles.

Vehicle information includes:

- Registration Number
- Vehicle Name / Model
- Vehicle Type
- Maximum Load Capacity
- Odometer Reading
- Acquisition Cost
- Vehicle Status

Vehicle Status:

`Available → On Trip → In Shop → Retired`

### 👨‍✈️ Driver Management

Maintain complete driver profiles.

Driver information includes:

- Driver Name
- License Number
- License Category
- License Expiry Date
- Contact Number
- Safety Score
- Driver Status

Driver Status:

`Available → On Trip → Off Duty → Suspended`

### 🗺️ Trip Management

Users can create and manage transportation trips.

Each trip contains:

- Source
- Destination
- Vehicle
- Driver
- Cargo Weight
- Planned Distance

Trip Lifecycle:

`Draft → Dispatched → Completed / Cancelled`

The system automatically validates vehicle capacity, driver eligibility, and vehicle availability before dispatching a trip.

### 🔧 Maintenance Management

Users can create and manage vehicle maintenance records.

When a vehicle enters maintenance:

`Available → In Shop`

The vehicle is automatically removed from the dispatch selection.

After maintenance is completed:

`In Shop → Available`

### ⛽ Fuel Management

Users can record vehicle fuel consumption.

Fuel logs contain:

- Vehicle
- Fuel Quantity
- Fuel Cost
- Date
- Distance Travelled

The system calculates fuel efficiency.

Fuel Efficiency:

`Fuel Efficiency = Distance Travelled / Fuel Consumed`

### 💰 Expense Management

Users can record operational expenses such as:

- Fuel Costs
- Maintenance Costs
- Toll Charges
- Other Operational Expenses

The system automatically calculates the total operational cost of each vehicle.

### 📈 Reports & Analytics

TransitOps provides operational insights such as:

- Fuel Efficiency
- Fleet Utilization
- Operational Cost
- Maintenance Cost
- Vehicle ROI

Vehicle ROI:

`ROI = (Revenue - (Maintenance Cost + Fuel Cost)) / Acquisition Cost`

Reports can be exported as CSV files.

---

## ⚙️ Business Rules

The system enforces the following rules:

- Vehicle registration numbers must be unique.
- Vehicles marked as `Retired` or `In Shop` cannot be assigned to trips.
- Drivers with expired licenses cannot be assigned to trips.
- Suspended drivers cannot be assigned to trips.
- A vehicle already `On Trip` cannot be assigned to another trip.
- A driver already `On Trip` cannot be assigned to another trip.
- Cargo weight cannot exceed vehicle capacity.
- Dispatching a trip automatically changes the vehicle and driver status to `On Trip`.
- Completing a trip changes both statuses back to `Available`.
- Cancelling a dispatched trip restores the vehicle and driver status to `Available`.
- Starting maintenance automatically changes vehicle status to `In Shop`.
- Completing maintenance restores vehicle status to `Available`, unless the vehicle is retired.

---

## 🔄 Application Workflow

```text
Register Vehicle
       ↓
Register Driver
       ↓
Create Trip
       ↓
Validate Vehicle + Driver + Cargo
       ↓
Dispatch Trip
       ↓
Vehicle & Driver → On Trip
       ↓
Complete Trip
       ↓
Vehicle & Driver → Available
       ↓
Record Fuel & Expenses
       ↓
Maintenance (If Required)
       ↓
Update Dashboard & Analytics
