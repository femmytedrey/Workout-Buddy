# **Workout Buddy 🏋️‍**
![Workout Buddy](./ui/Screenshot%20(10).png)

A MERN stack application that allows users to create and track their workouts.
This project demonstrates the implementation of user authentication, CRUD operations, and containerization using Docker.

### **Live Demo**
[*Visit Workout Buddy*](https://mini-workout-buddy.vercel.app/)

### **What is Workout Buddy?**
Workout Buddy serves as your digital fitness companion, allowing you to:
* Basic CRUD operation with MongoDB
* User authentication using JWT
* React Context API for state management
* Docker Containerization
* Development vs Production Environments

Perfect for developers looking to understand MERN stack development and docker with practical examples of workout tracking functionality.

### **Features**
* User Authentication
    - Signup and Login functionality
    - JWT-based secure authentication
    - Protected routes access
* Workout Management
    - Create, Read, Update, and Delete workouts
    - View all workouts in real-time
* State Management
    - React Context API implementation
    - Separate context for auth and workouts
    - Real-time state updates
* Docker Integration
    - Dovelopment environment with hot-reloading
    - Production-ready container setup
    - Multi-container orchestration
    - Volume persistence for MongoDB

### **Tech Stack**
* Frontend: React.js
* Backend: Node.js, Express.js, MongoDB
* Authentication: JSON Web Tokens (JWT)
* Devops: Docker, Docker Compose, Docker Swarm, Volumes management for data persistence
* Development Tools: Nodemon for hot-reloading, Environment Variables management, and more.

### **Data Flow**
1. Frontend makes authenticated API calls
2. Backend validates JWT tokens
3. Protected routes handle workout operations
4. MongoDB handles data storage
5. Context API updates UI in real-time

### **Docker Setup**
**Perequisites**
    * Docker installed on your machine
    * Git for cloning the repository
    
**Development Setup**
    1. Clone the repository:
        ```bash
        git clone https://github.com/femmytedrey/Workout-Buddy.git
        ```
        ```bash
        cd Workout-Buddy
        ```
    2. Create required Docker secrets:

    # Initialize swarm mode
    docker swarm init

    # Create required secrets
    echo "4000" | docker secret create port -
    echo "mongodb://mongodb:27017/workout" | docker secret create mongodb_uri -
    echo "yourSecretKey123" | docker secret create secret -
    echo "http://localhost:3000" | docker secret create client_url -
    echo "http://localhost:4000" | docker secret create react_app_base_url -

    # Deploy the stack
    docker stack deploy -c docker-compose.prod.yaml workout-buddy

### **Production Setup**
    # Initialize swarm:
    docker swarm init

    # Deploy the stack:
    docker stack deploy -c docker-compose.prod.yaml workout-buddy

    # Stop the production environment:
    docker stack rm workout-buddy
    docker swarm leave --force

### **Access Points**
    * Frontend: http://localhost:3000
    * Backend: http://localhost:4000
    * MongoDB: mongodb://localhost:27017

### **Author**
    * Created by FemiDev
