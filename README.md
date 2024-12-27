# BUILD A NODE/EXPRESS APPLICATION WITH MONGO & REDIS DATABASE USING DOCKER 
## Code structure:
- CRUB application:
    - Controllers: handle requests, sending responses
    - Models: structure of the database
    - Routes: define endpoints (URLs) and maps them to thier respective controller functions
- Middleware: check authentication
- Config: environment variables
- nginx: setup load balancer
- index.js: main file
## `index.js` features:
- Express: web framework
- Mongoose: MongoDB connection, object modeling
- Redis: session storage
- CORS middleware: run API from different domain
## Deploy in production server using Docker Swarm:
```yml
version: "3"
services:
  nginx:
    image: nginx:stable-alpine
    ports:
      - "80:80"
  node-project:
    deploy:
      replicas: 8           #run 8 containers              
      restart_policy:   
        condition: any      #restart if crash
      update_config:
        parallelism: 2      #update 2 containers each 15 seconds
        delay: 15s
    build:
      context: . 
      args: 
        NODE_ENV: production
    environment:
      - NODE_ENV=production
      - MONGO_USER=${MONGO_USER}
      - MONGO_PASSWORD=${MONGO_PASSWORD}
      - SESSION_SECRET=${SESSION_SECRET}
    command: node index.js

  mongo:
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD}

```
<figure style="text-align: center;">
    <img src="images/GCP server.png" alt="Using GCP for production server">
  <figcaption>Figure 1: Using GCP for production server</figcaption>
  <br>
</figure>

## Sample
<figure style="text-align: center;">
  <img src="images/api test.png" alt="HTTP to the URL">
  <figcaption>Figure 2: HTTP to the URL</figcaption>
  <br>

  <img src="images/signup function.png" alt="Signup function">
  <figcaption>Figure 3: Signup function</figcaption>
  <br>

  <img src="images/login function.png" alt="Login function">
  <figcaption>Figure 4: Login function</figcaption>
  <br>

  <img src="images/session with cookie.png" alt="Session with cookie">
  <figcaption>Figure 5: Session with cookie</figcaption>
  <br>
</figure>


