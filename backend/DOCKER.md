# Docker Setup - IT FARM Backend

## 🐳 Docker Support Added!

The backend now includes full Docker support for containerized deployment.

## 📦 What's Included

- **Dockerfile** - Production-ready multi-stage build
- **.dockerignore** - Optimized build context
- **docker-compose.yml** - Local development orchestration

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended for Development)

1. **Create `.env` file** (if not exists):
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and SECRET_KEY
```

2. **Start the backend**:
```bash
docker-compose up
```

The API will be available at `http://localhost:8000`

3. **Stop the backend**:
```bash
docker-compose down
```

### Option 2: Docker Build & Run (Manual)

1. **Build the image**:
```bash
docker build -t itfarm-backend .
```

2. **Run the container**:
```bash
docker run -d \
  --name itfarm-backend \
  -p 8000:8000 \
  -e MONGODB_URI="your-mongodb-uri" \
  -e SECRET_KEY="your-secret-key" \
  itfarm-backend
```

3. **Check logs**:
```bash
docker logs -f itfarm-backend
```

4. **Stop the container**:
```bash
docker stop itfarm-backend
docker rm itfarm-backend
```

## 🔧 Development Mode

The `docker-compose.yml` includes volume mounting for hot-reload:

```yaml
volumes:
  - ./app:/app/app  # Changes in ./app reflect immediately
```

Edit your code, and uvicorn will auto-reload inside the container!

## 🌐 Production Deployment

### Deploy to Any Container Platform

The Dockerfile is production-ready and works with:
- **Render** (Docker deployments)
- **Railway**
- **Fly.io**
- **AWS ECS/Fargate**
- **Google Cloud Run**
- **Azure Container Instances**
- **DigitalOcean App Platform**

### Build for Production

```bash
docker build -t itfarm-backend:latest .
docker tag itfarm-backend:latest your-registry/itfarm-backend:latest
docker push your-registry/itfarm-backend:latest
```

### Environment Variables (Production)

Make sure to set these in your container platform:

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ Yes | MongoDB connection string |
| `SECRET_KEY` | ✅ Yes | JWT secret key (use strong random value) |
| `ALGORITHM` | No | JWT algorithm (default: HS256) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | Token expiry (default: 1440 = 24h) |
| `BACKEND_URL` | Optional | For keep-alive system (Render free tier) |

## 📝 Docker Commands Cheatsheet

### Development
```bash
# Start with logs
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f backend

# Rebuild and start
docker-compose up --build

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Production
```bash
# Build image
docker build -t itfarm-backend .

# Run container
docker run -p 8000:8000 --env-file .env itfarm-backend

# Run with custom port
docker run -p 3000:8000 --env-file .env itfarm-backend

# Interactive mode (for debugging)
docker run -it itfarm-backend /bin/bash

# Check container health
docker inspect --format='{{.State.Health.Status}}' itfarm-backend
```

### Cleanup
```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove all unused resources
docker system prune -a
```

## 🏥 Health Checks

The Dockerfile includes a health check:

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1
```

Check container health:
```bash
docker ps  # See health status in STATUS column
```

## 🔒 Security Features

1. **Non-root user**: Container runs as `appuser` (UID 1000)
2. **Minimal base image**: Uses `python:3.11-slim`
3. **No cache**: Pip install uses `--no-cache-dir`
4. **Environment isolation**: Uses `.env` files (not committed)

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port 8000
netstat -ano | findstr :8000  # Windows
lsof -i :8000  # Linux/Mac

# Use different port
docker-compose run -p 8001:8000 backend
```

### Container Won't Start
```bash
# Check logs
docker-compose logs backend

# Common issues:
# - .env file missing → Copy from .env.example
# - MongoDB connection failed → Check MONGODB_URI
# - Port conflict → Change port in docker-compose.yml
```

### Can't Connect to MongoDB from Docker
```bash
# If using MongoDB Atlas:
# - Whitelist IP: 0.0.0.0/0 in MongoDB Atlas Network Access
# - Check MONGODB_URI format

# If using local MongoDB:
# - Use host.docker.internal instead of localhost
# - Example: mongodb://host.docker.internal:27017/itfarm
```

### Hot Reload Not Working
```bash
# Make sure volume is mounted correctly
docker-compose config  # Check volumes section

# Restart with rebuild
docker-compose down
docker-compose up --build
```

## 🎯 Optional: Local MongoDB in Docker

If you want to run MongoDB locally (instead of Atlas), uncomment the `mongodb` service in `docker-compose.yml`:

```bash
# Edit docker-compose.yml - uncomment mongodb service
docker-compose up

# Update .env:
MONGODB_URI=mongodb://admin:password@mongodb:27017/itfarm?authSource=admin
```

## 📊 Resource Limits (Production)

Add resource limits to `docker-compose.yml`:

```yaml
services:
  backend:
    # ... existing config
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## 🌟 Benefits of Docker

✅ **Consistent Environment** - Works the same everywhere  
✅ **Easy Deployment** - Single container image  
✅ **Isolation** - No dependency conflicts  
✅ **Scalability** - Easy horizontal scaling  
✅ **Portability** - Deploy anywhere (cloud, on-premise)  
✅ **Version Control** - Tag and rollback easily  

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [FastAPI Docker Deployment](https://fastapi.tiangolo.com/deployment/docker/)
- [Python Docker Best Practices](https://docs.docker.com/language/python/best-practices/)

## ✨ Done!

Your backend is now fully Dockerized! 🎉

Choose the deployment method that works best for you:
- 🔧 **Local Dev**: `docker-compose up`
- 🚀 **Production**: Render (render.yaml) or Docker image push
- 🐳 **Container Platform**: Any Docker-compatible hosting
