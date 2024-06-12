## 🌟 Angular 17 Fullstack Project 

Welcome to the InproCode project repository. This project is split into two main parts:

- **Frontend**: Angular 17 application with Mapbox, FullCalendar, and Chart.js.
- **Backend**: Node.js (Express) server with a MySQL database.

This project showcases an Angular 17 standalone application that integrates a Mapbox map, FullCalendar for event management, and Chart.js for data visualization. It is connected to a backend server for fetching and storing data, making it a complete full-stack application.

## 📋 Prerequisites

Ensure you have the following installed:

- Node.js (v16.x or later)
- npm (v7.x or later)
- Angular CLI (v17.x or later)
- MySQL (v8.x or later)

## 📂 Repository Structure

This repository is divided into two separate repositories for frontend and backend:

- **Frontend**: [Sprint-8-front](https://github.com/sergi-moliner/Sprint-8-front)
- **Backend**: [Sprint-8-back](https://github.com/sergi-moliner/Sprint-8-back)

Please clone each repository and follow the specific instructions provided below for setup.

## 📦 Installation

### 🔧 Backend Setup

1. Clone the backend repository:
    ```bash
    git clone https://github.com/sergi-moliner/Sprint-8-back.git
    cd Sprint-8-back
    ```

2. Install the necessary dependencies:
    ```bash
    npm install
    ```

3. Set up your environment variables by creating a `.env` file in the `backend` directory and adding your database configuration:
    ```env
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=yourpassword
    DB_NAME=inprocode
    PORT=3000
    ```

4. Import the provided SQL file to set up the database schema and initial data:
    ```bash
    mysql -u your-username -p your-database-name < path/to/your-database-file.sql
    ```
    - Replace `your-username` with your MySQL username.
    - Replace `your-database-name` with the name of the database you created.
    - Replace `path/to/your-database-file.sql` with the relative path to the SQL file in the repository.

5. Run the backend server:
    ```bash
    npm start
    ```

### 🖼️ Frontend Setup

1. Clone the frontend repository:
    ```bash
    git clone https://github.com/sergi-moliner/Sprint-8-front.git
    cd Sprint-8-front
    ```

2. Install the necessary dependencies:
    ```bash
    npm install
    ```

3. Obtain a Mapbox API token from [Mapbox](https://account.mapbox.com/access-tokens/).

4. Set up your environment variables by creating a `src/environments/environment.ts` file in the `frontend` directory and adding your API endpoint and Mapbox token:
    ```typescript
    export const environment = {
      production: false,
      apiUrl: 'http://localhost:3000',
      mapboxToken: 'your_mapbox_token'
    };
    ```

5. Run the frontend application:
    ```bash
    ng serve
    ```

6. Open your browser and navigate to `http://localhost:4200`.

## 🔍 Features

### Frontend

- **Mapbox Integration**: Interactive maps with markers.
- **FullCalendar Integration**: Event management with a modal for creating, editing, and deleting events.
- **Chart.js Integration**: Various charts to visualize user roles, events, and marker categories.

### Backend

- **User Management**: CRUD operations for users.
- **Event Management**: CRUD operations for events with category filtering.
- **Marker Management**: CRUD operations for map markers.

## 📝 Usage

### Mapbox

- Display interactive maps.
- Add, edit, and remove markers dynamically.

### FullCalendar

- Manage events with a modal interface.
- Supports creation, editing, and deletion of events.

### Chart.js

- Visualize data with different types of charts (bar, line, radar, etc.).

## Database Configuration

The database configuration is located in `src/db/connection.ts` in the backend repository:

```typescript
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('inprocode', 'root', 'yourpassword', {
    host: 'localhost',
    dialect: 'mysql'
});

export default sequelize;
```
Replace 'yourpassword' with your actual MySQL password.
