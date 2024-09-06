## Encora Task Manager

This repository contains a simple task manager application with a separate frontend (SPA) and backend (API).

### Project Structure

- **`api`**: Contains the backend API built with Node.js and Express.
- **`spa`**: Contains the frontend Single Page Application built with React.

### Prerequisites

- **Node.js and npm:** Make sure you have Node.js and npm installed on your system. You can download them from [https://nodejs.org/](https://nodejs.org/).
- **MongoDB:** You need a running MongoDB instance. You can download it from [https://www.mongodb.com/](https://www.mongodb.com/).

### Setup and Execution

#### 1. Backend (API)

1.  **Navigate to the API directory:**
    ```bash
    cd api
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev 
    ```
    The API will be running at `http://localhost:3000` (or the port you specified).

#### 2. Frontend (SPA)

1.  **Navigate to the SPA directory:**
    ```bash
    cd spa
    ```
2.  **Install dependencies:**
    ```bash
    npm install  
    ```
3.  **Set up API endpoint:**
    -   Update the API base URL in your frontend application's configuration (e.g., in a `.env` file or configuration file) to point to your backend API:
        ```
        API_BASE_URL=http://localhost:3000 
        ```
4.  **Start the development server:**
    ```bash
    npm run dev  
    ```
    This command will vary depending on your frontend framework. The SPA will be running at `http://localhost:3001` (or the port specified by your frontend framework).

### Using the Application

1.  **Access the SPA:** Open your web browser and go to the address where your SPA is running (e.g., `http://localhost:3001`).
2.  **Sign up/Log in:** Create a new account or log in if you already have one.
3.  **Manage Tasks:** Start adding, editing, deleting, and marking tasks as complete.

### Additional Notes

-   **API Documentation:** The API documentation is available at `http://localhost:3000/api-docs` (or your API base URL + `/api-docs`) after you start the API server.
-   **Further Development:** Feel free to explore the codebase and make changes to customize the application further.

