# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Security Features

### Built-in Security Measures

1. **Input Validation**
   - All event data (title, description, dates, color, location) is validated
   - Maximum field lengths enforced (title: 200 chars, description: 2000 chars)
   - Date validation prevents invalid dates
   - Color validation ensures hex format (#RRGGBB)

2. **SQL Injection Protection**
   - Prisma ORM used for all database queries
   - Parameterized queries prevent SQL injection
   - No raw SQL queries in application code

3. **Rate Limiting**
   - Production: 100 requests per 15 minutes per IP
   - Development: 1000 requests per 15 minutes
   - Prevents brute force and DoS attacks

4. **Request Size Limits**
   - JSON payload limited to 10MB
   - Prevents memory exhaustion attacks

5. **CORS Configuration**
   - Configurable via environment variable
   - Supports single or multiple allowed origins
   - Default: `*` (only for development)

6. **Environment-based Configuration**
   - Secrets managed via environment variables
   - No hardcoded credentials in source code
   - `.env` files gitignored by default

## Configuration for Production

### 1. Database Security

**Change Default Password:**
```bash
# In .env file
POSTGRES_PASSWORD=your_very_strong_password_here_min_32_chars
```

**Generate Strong Password:**
```bash
# Linux/macOS
openssl rand -base64 32

# Or use the setup script which does this automatically
./setup.sh
```

**PostgreSQL Port:**
- By default, PostgreSQL port is NOT exposed in docker-compose.yml
- Only accessible within Docker network
- For local DB access, use docker-compose.override.yml.example

### 2. CORS Configuration

**Single Domain:**
```bash
# In server/.env
CORS_ORIGIN=https://yourdomain.com
```

**Multiple Domains:**
```bash
# In server/.env
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com,https://app.yourdomain.com
```

**Never use `*` in production!**

### 3. HTTPS/SSL

**Option A: Reverse Proxy (Recommended)**

Use nginx, Caddy, or Traefik in front of the Docker containers:

```nginx
# nginx example
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Option B: Let's Encrypt with Certbot**

```bash
sudo certbot --nginx -d yourdomain.com
```

### 4. Environment Variables

**Production Checklist:**

```bash
# .env (root)
VITE_API_URL=https://api.yourdomain.com/api
POSTGRES_USER=calendar_user
POSTGRES_PASSWORD=<STRONG_PASSWORD>
POSTGRES_DB=event_calendar
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com

# server/.env
DATABASE_URL=postgresql://calendar_user:<STRONG_PASSWORD>@postgres:5432/event_calendar
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

## Security Limitations

### What This App Does NOT Provide

1. **Authentication/Authorization**
   - No user login system
   - No access control
   - Anyone with API access can modify events
   - **Use Case**: Designed for single-user or trusted network deployment

2. **Audit Logging**
   - No logs of who created/modified/deleted events
   - No login attempt tracking

3. **DDoS Protection**
   - Basic rate limiting included
   - For production, use Cloudflare or similar

4. **Session Management**
   - No sessions or tokens
   - No "remember me" functionality

5. **Data Encryption at Rest**
   - Database data not encrypted on disk
   - Use PostgreSQL encryption features if needed

## Reporting a Vulnerability

If you discover a security vulnerability, please email the maintainer directly. Do not open a public GitHub issue.

**Response Time:**
- Critical vulnerabilities: Within 48 hours
- High/Medium: Within 1 week
- Low: Within 2 weeks

## Best Practices for Deployment

### Development Environment

✅ **Safe to use defaults**
- Default passwords acceptable
- CORS `*` is fine
- PostgreSQL port exposure okay

### Production Environment

⚠️ **MUST change before deployment:**

1. **Passwords**
   - Generate random 32+ character passwords
   - Use different passwords for different environments
   - Rotate regularly (quarterly recommended)

2. **CORS**
   - Set specific domain(s)
   - Test thoroughly

3. **HTTPS**
   - SSL/TLS required
   - Use valid certificates (not self-signed)
   - HTTP → HTTPS redirect

4. **Network**
   - Don't expose PostgreSQL port (5432)
   - Use firewall rules
   - Consider VPN or private network

5. **Backups**
   - Regular database backups
   - Store backups securely
   - Test restoration process

6. **Updates**
   - Keep Docker images updated
   - Monitor npm audit results
   - Apply security patches promptly

### Docker Security

**Don't run as root:**
```dockerfile
# Add to Dockerfile
USER node
```

**Scan images:**
```bash
docker scan event-calendar-backend
docker scan event-calendar-frontend
```

**Limit resources:**
```yaml
# In docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

## Security Checklist

### Before First Deployment

- [ ] Change all default passwords
- [ ] Configure CORS for specific domain(s)
- [ ] Set up HTTPS/SSL
- [ ] Review .env files (ensure not committed to git)
- [ ] Test rate limiting
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Review Docker security settings

### Ongoing Maintenance

- [ ] Monitor API logs for suspicious activity
- [ ] Review and rotate passwords quarterly
- [ ] Update dependencies monthly (`npm audit`)
- [ ] Update Docker images monthly
- [ ] Test backups quarterly
- [ ] Review CORS configuration when adding domains
- [ ] Monitor rate limit effectiveness

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

## Contact

For security concerns, please contact the repository maintainer directly.

---

**Last Updated:** 2025-10-30
