# Security Policy — Mini D-Mart

## Security Design

### Authentication
- **JWT (JSON Web Tokens)** — Stateless authentication using HS256 algorithm
- Tokens expire after **24 hours** (configurable via `jwt.expiration`)
- Passwords hashed using **BCrypt** with strength factor 12
- No plaintext credentials stored anywhere

### Authorization (RBAC)
- Four roles: `CUSTOMER`, `STAFF`, `MANAGER`, `ADMIN`
- Route-level protection via Spring Security `@PreAuthorize` and `.requestMatchers()`
- Hierarchical access: ADMIN ⊇ MANAGER ⊇ STAFF ⊇ CUSTOMER
- All protected routes return `403 Forbidden` with no internal details on unauthorized access

### Input Validation
- All request bodies validated using **Jakarta Bean Validation** (`@NotBlank`, `@Email`, `@Size`, etc.)
- Validation errors return `400 Bad Request` with field-level error messages
- No raw SQL queries — all DB access via **JPA/Hibernate** (parameterized queries, prevents SQL injection)

### API Security
- **CORS** restricted to known frontend origins only (`http://localhost:5173`, production Vercel URL)
- CSRF disabled (stateless JWT, no cookie-based sessions)
- Swagger/OpenAPI docs accessible only in development
- No sensitive information in error responses (stack traces never exposed)

### Secrets & Environment Variables
- JWT secret stored in `application.properties` (never hardcoded in source)
- Database credentials via environment variables in production
- `.env.example` provided — actual `.env` excluded from git (`.gitignore`)

### Concurrency & Data Integrity
- **Pessimistic locking** (`PESSIMISTIC_WRITE`) on product stock during checkout — prevents race conditions on last item
- `@Version` field on Product entity for optimistic locking support
- `@Transactional` on all service methods that modify data

### Audit Logging
- All significant actions are logged: login, register, place order, cancel order, role changes, return processing
- Log entries capture: `userId`, `action`, `entityType`, `entityId`, `ipAddress`, `timestamp`, `details`
- Audit logs are append-only (never deleted or modified)

---

## Known Vulnerabilities & Limitations

| Issue | Severity | Status | Notes |
|-------|----------|--------|-------|
| No rate limiting | Medium | ⚠️ Known | Brute-force login possible; recommend adding Spring Rate Limiter or API Gateway |
| JWT not blacklistable | Medium | ⚠️ Known | Logout doesn't invalidate server-side; token remains valid until expiry |
| No email verification | Low | ⚠️ Known | Any email accepted at registration |
| Single JWT secret | Low | ⚠️ Known | Rotate secret via environment variable on compromise |
| Swagger UI in production | Low | ⚠️ Known | Should be disabled with `springdoc.api-docs.enabled=false` in prod |

---

## Threat Model

| Threat | Mitigation |
|--------|------------|
| Unauthorized API access | JWT auth on all non-public routes |
| Privilege escalation | RBAC enforced server-side; role checked per request |
| SQL injection | JPA parameterized queries |
| XSS | React auto-escapes output; Content-Security-Policy recommended |
| CSRF | Stateless JWT; CSRF disabled |
| Stock race conditions | Pessimistic DB locking |
| Password disclosure | BCrypt hashing; never stored plaintext |
| Information leakage | Global exception handler returns safe messages only |

---

## Reporting a Security Issue

If you discover a security vulnerability, please report it by emailing the repository owner directly. Do not open a public issue.

---

## Security Checklist

- [x] Passwords hashed with BCrypt
- [x] JWT signed with HMAC-SHA256
- [x] RBAC enforced on all protected endpoints
- [x] Input validation on all request bodies
- [x] No SQL injection (JPA/parameterized queries)
- [x] CORS restricted to known origins
- [x] Audit logging for sensitive operations
- [x] Environment variables for secrets
- [x] Pessimistic locking on critical transactions
- [x] Soft delete preserves referential integrity
- [ ] Rate limiting (recommended for production)
- [ ] HTTPS enforced (handled by Render/Vercel in production)
- [ ] JWT refresh token rotation (future improvement)
- [ ] Email verification (future improvement)
