# Deployment Guide

This guide provides instructions for deploying the social media application, both locally for development and online for production.

---

## 1. Local Deployment (for Development)

Follow these steps to run the application on your local machine.

### Prerequisites

*   **Node.js**: Ensure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
*   **MySQL**: You need a running MySQL server. Tools like [XAMPP](https://www.apachefriends.org/index.html), [MAMP](https://www.mamp.info/en/mamp/), or a direct MySQL installation will work.

### Step 1: Database Setup

1.  **Start your MySQL server.**
2.  **Create a new database.** You can use a tool like phpMyAdmin or the MySQL command line. Name the database `social_media`.
3.  **Import the schema.** Import the `database/schema.sql` file into your `social_media` database. This will create all the necessary tables.

### Step 2: Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd social_media_project/backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure environment variables.** Create a copy of `config/config.env` and rename it to `config.env` in the same directory. Update the `DB_USER` and `DB_PASSWORD` fields with your MySQL credentials.
    ```
    NODE_ENV=development
    PORT=5000
    DB_HOST=localhost
    DB_USER=your_mysql_username
    DB_PASSWORD=your_mysql_password
    DB_NAME=social_media
    JWT_SECRET=a_strong_secret_key
    JWT_EXPIRE=30d
    ```
4.  **Start the backend server:**
    ```bash
    npm start
    ```
    The backend API should now be running on `http://localhost:5000`.

### Step 3: Frontend Setup

The frontend is a simple set of static files. You can open the `frontend/index.html` file directly in your browser. For best results (to avoid CORS issues with some browsers), it's recommended to serve the files using a lightweight server.

1.  **Install `live-server` (if you don't have it):**
    ```bash
    npm install -g live-server
    ```
2.  **Serve the frontend directory:**
    ```bash
    cd social_media_project/frontend
    live-server
    ```
    Your browser should open to the application, which will connect to your local backend.

---

## 2. Online Deployment (for Production)

This section guides you through deploying the application to a live production environment. We will use:
*   **Backend (Node.js)**: [Render](https://render.com/)
*   **Frontend (Static Site)**: [Vercel](https://vercel.com/)
*   **Database (MySQL)**: [PlanetScale](https://planetscale.com/)

### Step 1: Push to GitHub

Before deploying, make sure your entire project is pushed to a GitHub repository.

### Step 2: Database Deployment (PlanetScale)

1.  **Create a PlanetScale account** and a new database.
2.  **Import your schema.** On the PlanetScale dashboard, go to the `Console` tab for your database and paste the contents of `database/schema.sql` to create the tables.
3.  **Get connection details.** Go to the `Connect` button and get the connection strings for your database. You will need the host, username, password, and database name for the next step.

### Step 3: Backend Deployment (Render)

1.  **Create a Render account** and connect it to your GitHub account.
2.  **Create a new "Web Service"** on the Render dashboard.
3.  **Select your repository.**
4.  **Configure the service:**
    *   **Name**: `social-media-backend` (or your choice)
    *   **Root Directory**: `social_media_project/backend`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
5.  **Add Environment Variables.** Go to the "Environment" tab and add the following variables, using the credentials from your PlanetScale database:
    *   `DB_HOST`: Your PlanetScale host
    *   `DB_USER`: Your PlanetScale username
    *   `DB_PASSWORD`: Your PlanetScale password
    *   `DB_NAME`: Your PlanetScale database name
    *   `JWT_SECRET`: A new, strong secret key for production.
    *   `NODE_ENV`: `production`
6.  **Deploy.** Render will automatically build and deploy your backend. Once it's live, copy the URL (e.g., `https://social-media-backend.onrender.com`).

### Step 4: Frontend Deployment (Vercel)

1.  **Create a Vercel account** and connect it to your GitHub account.
2.  **Create a new project** and select your repository.
3.  **Configure the project:**
    *   **Root Directory**: `social_media_project/frontend`
4.  **Update API URLs.** In the frontend JavaScript files (`frontend/js/services/*.js`), you must change the `API_URL` to point to your live Render backend URL.
    *   Example in `authService.js`: `const API_URL = 'https://your-backend-url.onrender.com/api/auth';`
    *   Commit and push this change to GitHub. Vercel will automatically redeploy.
5.  **Deploy.** Vercel will build and deploy your frontend. You can now access your live social media application from the Vercel URL.

Congratulations! Your application is now fully deployed.