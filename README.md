# Encora Task Manager

## Getting Started with Docker

This project uses Docker to simplify the development setup. Make sure you have Docker installed on your machine.

### Prerequisites

- Docker: [https://www.docker.com/get-started](https://www.docker.com/get-started)

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/encora-task-manager.git
   cd encora-task-manager
2. **Build the Docker images:**

    ```bash
    docker-compose build
3. **Start the containers:**
    ```bash
    docker-compose up -d
    ```
    This command will start the API, React app, and MongoDB containers in detached mode.
4. **Access the application:**

    Open your web browser and go to http://localhost:3001. You should see the Encora Task Manager application running.

### Stopping the application
To stop the Docker containers, run:
```bash
docker-compose down
```
### Additional Notes
- The API will be accessible at http://localhost:3002.
- MongoDB data will be persisted in a Docker volume.

### Troubleshooting
- If you encounter any issues, make sure Docker is running on your machine.
- You can view container logs using `docker-compose logs [service-name]`, replacing [service-name] with the name of the service you want to inspect (e.g., api, spa, db).