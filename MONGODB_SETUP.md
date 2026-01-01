# MongoDB Setup with Docker Compose

This project uses MongoDB for data persistence. Follow these steps to set up MongoDB locally using Docker Compose.

## Prerequisites

- Docker and Docker Compose installed on your system
- Port 27017 available

## Quick Start

1. **Start MongoDB**:
   ```bash
   docker-compose up -d
   ```

2. **Verify MongoDB is running**:
   ```bash
   docker ps
   ```
   You should see `signal-mongodb` container running.

3. **Check logs**:
   ```bash
   docker-compose logs -f mongodb
   ```

## Environment Variables

Add these variables to your `.env.local` file:

```bash
# MongoDB Configuration
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password123
MONGO_DATABASE=signal
MONGODB_URI=mongodb://admin:password123@localhost:27017/signal?authSource=admin
```

## MongoDB Service

- **Port**: 27017
- **Container**: signal-mongodb
- **Image**: mongo:7.0
- **Data**: Persisted in Docker volume `mongodb_data`

## Docker Commands

```bash
# Start MongoDB
docker-compose up -d

# Stop MongoDB
docker-compose down

# View logs
docker-compose logs -f mongodb

# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v

# Restart MongoDB
docker-compose restart
```

## Connection String Format

```
mongodb://[username]:[password]@[host]:[port]/[database]?authSource=admin
```

**Example**:
```
mongodb://admin:password123@localhost:27017/signal?authSource=admin
```

## Connecting with MongoDB Compass

You can use [MongoDB Compass](https://www.mongodb.com/products/compass) to manage your database:

1. Download and install MongoDB Compass
2. Use connection string: `mongodb://admin:password123@localhost:27017/signal?authSource=admin`

## Security Notes

⚠️ **Important**: The default credentials are for development only. 

For production:
1. Change all passwords in `.env.local`
2. Use strong, randomly generated passwords
3. Never commit `.env.local` to version control
4. Consider using MongoDB Atlas for production

## Troubleshooting

### Port already in use
If port 27017 is already in use:
```bash
# Find process using port 27017
lsof -i :27017

# Or change the port in docker-compose.yml
ports:
  - "27018:27017"  # Use 27018 instead
```

### Connection refused
1. Ensure Docker container is running: `docker ps`
2. Check logs: `docker-compose logs mongodb`
3. Verify connection string in `.env.local`

### Reset database
```bash
docker-compose down -v
docker-compose up -d
```

