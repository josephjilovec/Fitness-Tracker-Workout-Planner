# Deployment Guide

Production deployment guide for Fitness Tracker.

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database backups configured
- [ ] Monitoring set up
- [ ] Logging configured
- [ ] Security review completed
- [ ] Performance testing done
- [ ] Documentation updated

## Deployment Options

### Option 1: AWS Elastic Beanstalk

1. **Install EB CLI**

```bash
pip install awsebcli
```

2. **Initialize EB**

```bash
eb init -p docker fitness-tracker --region us-east-1
```

3. **Create Environment**

```bash
eb create fitness-tracker-env --instance_type t3.medium
```

4. **Set Environment Variables**

```bash
eb setenv \
  MONGODB_URI=your-mongodb-uri \
  JWT_SECRET=your-secret \
  NODE_ENV=production \
  CORS_ORIGIN=https://your-frontend.com
```

5. **Deploy**

```bash
eb deploy
```

### Option 2: Docker on VPS

1. **Build Docker Image**

```bash
docker build -t fitness-tracker -f deploy/Dockerfile .
```

2. **Run Container**

```bash
docker run -d \
  --name fitness-tracker \
  -p 5000:5000 \
  -e MONGODB_URI=your-mongodb-uri \
  -e JWT_SECRET=your-secret \
  -e NODE_ENV=production \
  fitness-tracker
```

3. **Use Docker Compose**

```yaml
version: '3.8'
services:
  app:
    image: fitness-tracker:latest
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    restart: unless-stopped
```

### Option 3: Kubernetes

1. **Create Deployment**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fitness-tracker
spec:
  replicas: 3
  selector:
    matchLabels:
      app: fitness-tracker
  template:
    metadata:
      labels:
        app: fitness-tracker
    spec:
      containers:
      - name: backend
        image: fitness-tracker:latest
        ports:
        - containerPort: 5000
        env:
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: fitness-tracker-secrets
              key: mongodb-uri
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: fitness-tracker-secrets
              key: jwt-secret
        livenessProbe:
          httpGet:
            path: /api/health/live
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health/ready
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
```

2. **Create Service**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: fitness-tracker-service
spec:
  selector:
    app: fitness-tracker
  ports:
  - protocol: TCP
    port: 80
    targetPort: 5000
  type: LoadBalancer
```

## Environment Configuration

### Required Variables

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=strong-random-secret-32-chars-min
JWT_REFRESH_SECRET=strong-random-secret-32-chars-min
CORS_ORIGIN=https://your-frontend.com
LOG_LEVEL=info
```

### Optional Variables

```env
REDIS_HOST=your-redis-host
REDIS_PORT=6379
AWS_S3_BUCKET=your-bucket
SENTRY_DSN=your-sentry-dsn
```

## Database Setup

### MongoDB Atlas

1. Create cluster
2. Create database user
3. Whitelist deployment IPs
4. Get connection string
5. Update `MONGODB_URI`

### Database Indexes

Indexes are automatically created by Mongoose schemas. Verify:

```javascript
// In MongoDB shell
use fitness-tracker
db.users.getIndexes()
db.workouts.getIndexes()
db.exercises.getIndexes()
```

## Security Hardening

1. **HTTPS/SSL**

- Use reverse proxy (nginx, Cloudflare)
- Configure SSL certificates
- Force HTTPS redirects

2. **Firewall**

```bash
# Allow only necessary ports
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw enable
```

3. **Secrets Management**

- Use environment variables
- Never commit secrets to Git
- Use secret management services (AWS Secrets Manager, HashiCorp Vault)

4. **Rate Limiting**

Already configured in code. Adjust based on traffic:

```env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Monitoring

### Health Checks

- `/api/health` - Full health status
- `/api/health/ready` - Readiness probe
- `/api/health/live` - Liveness probe

### Logging

Logs are written to:
- `logs/app-YYYY-MM-DD.log` - All logs
- `logs/error-YYYY-MM-DD.log` - Errors only

### Metrics to Monitor

- Response times
- Error rates
- Database connection status
- Memory usage
- CPU usage
- Request rate

### Tools

- **Application**: Winston (already configured)
- **Infrastructure**: Prometheus, Grafana
- **APM**: New Relic, Datadog, Sentry

## Scaling

### Horizontal Scaling

1. **Load Balancer**

Configure nginx or cloud load balancer:

```nginx
upstream fitness_tracker {
    server app1:5000;
    server app2:5000;
    server app3:5000;
}
```

2. **Session Management**

- Use stateless JWT (already implemented)
- No session storage needed

### Vertical Scaling

- Increase instance size
- Optimize database queries
- Add caching (Redis)

## Backup Strategy

### Database Backups

1. **MongoDB Atlas**: Automatic backups enabled
2. **Self-hosted**: Set up cron job

```bash
# Daily backup script
mongodump --uri="mongodb://..." --out=/backups/$(date +%Y%m%d)
```

### Application Backups

- Version control (Git)
- Docker images in registry
- Configuration files

## Rollback Procedure

1. **Docker**

```bash
docker stop fitness-tracker
docker run -d --name fitness-tracker fitness-tracker:previous-version
```

2. **Kubernetes**

```bash
kubectl rollout undo deployment/fitness-tracker
```

3. **EB**

```bash
eb deploy fitness-tracker-env --version previous-version
```

## Post-Deployment

1. Verify health endpoints
2. Test critical user flows
3. Monitor error logs
4. Check performance metrics
5. Verify database connections
6. Test authentication flow

## Maintenance

### Regular Tasks

- Weekly: Review logs and metrics
- Monthly: Security updates
- Quarterly: Performance review
- Annually: Architecture review

### Updates

1. Test in staging
2. Backup database
3. Deploy during low traffic
4. Monitor closely
5. Have rollback plan ready

## Troubleshooting

### Application Won't Start

- Check environment variables
- Verify database connection
- Check port availability
- Review logs

### High Error Rate

- Check database status
- Review recent deployments
- Check external dependencies
- Monitor resource usage

### Performance Issues

- Review slow queries
- Check database indexes
- Monitor resource usage
- Consider caching

## Support

For deployment issues:
- Check logs: `logs/app-*.log`
- Review health endpoint: `/api/health`
- Contact DevOps team
- Open GitHub issue

