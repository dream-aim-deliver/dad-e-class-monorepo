# Deployment Instructions

Apache is configured to proxy traffic on port 443 to the NextJS app. Traffic on port 80 is forwarded to port 443. The NextJS app is managed by pm2 and run locally inside the container on ports 3000. These ports are not exposed to the host.


## Build and Run

Please run the image build from the context of the project's root folder.

```bash
docker build --rm -f apps/platform/Dockerfile -t maany/e-class-platform .
```

or

```bash
cd apps/platform
docker build --rm -f Dockerfile -t maany/e-class-platform ../..
```

For example, to run the container with the provided certificates, use the following command:
```bash
docker run -d --name e-class-platform \
    --hostname <public_hostname> \
    -e HTTPD_ENABLE_SSL=True \
    -e HTTPD_ENABLE_LOGS=True \
    -e HOSTNAME=localhost \
    -e NEXTAUTH_SECRET=<your_nextauth_secret> \
    -e AUTH_AUTH0_CLIENT_ID=<your_auth0_client_id> \
    -e AUTH_AUTH0_CLIENT_SECRET=<your_auth0_client_secret> \
    -e AUTH_AUTH0_ISSUER=<https://your-tenant.auth0.com> \
    -e AUTH_AUTH0_AUTHORIZATION_URL=<https://your-tenant.auth0.com/authorize> \
    -e AUTH_AUTH0_ROLES_CLAIM_KEY=<https://your-app.com/roles> \
    -e E_CLASS_PLATFORM_ID=<1> \
    -e E_CLASS_DEV_MODE=<true> \
    -e NEXT_PUBLIC_E_CLASS_PLATFORM_URL=<http://localhost:3000> \
    -e NEXT_PUBLIC_CONTACT_EMAIL=<example@mail.com> \
    -p 80:80 -p 443:443 \
    --mount type=bind,source=your/hostcert.pem,target=/etc/dad/hostcert.pem \
    --mount type=bind,source=your/hostkey.pem,target=/etc/dad/hostkey.pem \
    --mount type=bind,source=your/ca.pem,target=/etc/dad/ca.pem \
    maany/e-class-platform
```

For running in http mode, use the following command. In this case TLS termination is done by an external loadbalancer:

```bash
docker run -d --name e-class-platform \
    --hostname localhost \
    -e HOSTNAME=localhost \
    -e NEXTAUTH_SECRET=<your_nextauth_secret> \
    -e AUTH_AUTH0_CLIENT_ID=<your_auth0_client_id> \
    -e AUTH_AUTH0_CLIENT_SECRET=<your_auth0_client_secret> \
    -e AUTH_AUTH0_ISSUER=<https://your-tenant.auth0.com> \
    -e AUTH_AUTH0_AUTHORIZATION_URL=<https://your-tenant.auth0.com/authorize> \
    -e AUTH_AUTH0_ROLES_CLAIM_KEY=<https://your-app.com/roles> \
    -e E_CLASS_PLATFORM_ID=<1> \
    -e E_CLASS_DEV_MODE=<true> \
    -e NEXT_PUBLIC_E_CLASS_PLATFORM_URL=<http://localhost:3000> \
    -e NEXT_PUBLIC_CONTACT_EMAIL=<example@mail.com> \
    -p 80:80 -p 443:443 \
    -p 3000:3000 \
    maany/e-class-platform
```

## Minimal Configuration
You must set the following environment variables to run the container:

# E-Class Platform Environment Variables

| Environment Variable                    | Description                                            |
|-----------------------------------------|--------------------------------------------------------|
| AUTH_AUTH0_CLIENT_ID                    | The client ID for your Auth0 application               |
| AUTH_AUTH0_CLIENT_SECRET                | The client secret for your Auth0 application           |
| AUTH_AUTH0_ISSUER                       | The Auth0 domain URL that issues tokens                |
| AUTH_AUTH0_AUTHORIZATION_URL            | The URL for Auth0 authorization endpoint               |
| AUTH_AUTH0_ROLES_CLAIM_KEY              | The JWT claim key used to determine user roles         |
| NEXTAUTH_SECRET                         | The secret key used for encrypting NextAuth.js session |
| E_CLASS_PLATFORM_ID                     | Identifier for the platform instance                   |
| E_CLASS_DEV_MODE                        | Boolean flag to enable development mode                |
| NEXT_PUBLIC_E_CLASS_PLATFORM_URL        | Public URL where the platform is accessible            |
| NEXT_PUBLIC_CONTACT_EMAIL               | Contact email address displayed in error messages
| HTTPD_ENABLE_SSL                        | Boolean flag to enable SSL in HTTP server              |
| HTTPD_ENABLE_LOGS                       | Boolean flag to enable HTTP server logs                |
| HOSTNAME                                | Hostname for the server                                |


## Additional Configuration
The following environment variables can be used to configure the Apache Web Server:


| Environment Variable            | Description                                                                                                                                                                                                    |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HTTPD_SERVER_ADMIN`            | The email address of the server administrator.                                                                                                                                                                 |
| `HTTPD_LOG_LEVEL`               | The log level for the Apache Web Server.                                                                                                                                                                       |
| `HTTPD_ENABLE_LOGS`             | Whether to enable logging for the Apache Web Server.                                                                                                                                                           |
| `HTTPD_LOG_DIR`                 | The directory where the logs for the Apache Web Server should be stored.                                                                                                                                       |
| `HTTPD_ENABLE_SSL`              | Whether to enable SSL for the Apache Web Server. Please mount the SSL certificate and key to `/etc/dad/hostcert.pem` and `/etc/dad/hostkey.pem` respectively. Please mount the ca-bundle to `/etc/dad/ca.pem`. |
| `HTTPD_LOG_FORMAT`              | The log format for the Apache Web Server.                                                                                                                                                                      |
| `HTTPD_MPM_MODE`                | The Multi-Processing Module (MPM) mode for the Apache Web Server.                                                                                                                                              |
| `HTTPD_START_SERVERS`           | Number of servers to start.                                                                                                                                                                                    |
| `HTTPD_MIN_SPARE_SERVERS`       | Minimum number of spare servers.                                                                                                                                                                               |
| `HTTPD_MAX_SPARE_SERVERS`       | Maximum number of spare servers.                                                                                                                                                                               |
| `HTTPD_SERVER_LIMIT`            | Limit on the number of servers.                                                                                                                                                                                |
| `HTTPD_MAX_CLIENTS`             | Maximum number of clients.                                                                                                                                                                                     |
| `HTTPD_MAX_REQUESTS_PER_CHILD`  | Maximum number of requests per child.                                                                                                                                                                          |
| `HTTPD_MIN_SPARE_THREADS`       | Minimum number of spare threads.                                                                                                                                                                               |
| `HTTPD_MAX_SPARE_THREADS`       | Maximum number of spare threads.                                                                                                                                                                               |
| `HTTPD_THREADS_PER_CHILD`       | Threads per child.                                                                                                                                                                                             |
| `HTTPD_KEEP_ALIVE`              | Whether to enable keep-alive.                                                                                                                                                                                  |
| `HTTPD_KEEP_ALIVE_TIMEOUT`      | The keep-alive timeout.                                                                                                                                                                                        |
| `HTTPD_MAX_KEEP_ALIVE_REQUESTS` | Number of requests per keep-alive connection.                                                                                                                                                                  |
| `HTTPD_THREADS_LIMIT`           | Limit on the number of threads.                                                                                                                                                                                |
| `HTTPD_TIMEOUT`                 | The timeout for the Apache Web Server.                                                                                                                                                                         |

