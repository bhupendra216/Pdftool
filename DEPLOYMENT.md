# Deployment environment variables

Configure these variables on the Render backend:

- `ADMIN_USERNAME`: the admin login username.
- `ADMIN_PASSWORD`: a strong admin password.
- `ADMIN_SESSION_SECRET`: a long random secret used to sign admin cookies. Keep this unchanged across deploys or existing sessions will expire.
- `FRONTEND_URL`: the deployed Vercel origin, for example `https://your-project.vercel.app`. Multiple comma-separated origins are supported.

The frontend admin requests already use `credentials: "include"`. The backend now issues a signed, stateless cookie, so admin sessions survive Render restarts without a database or paid storage.

Generate a session secret with:

```sh
openssl rand -base64 32
```
