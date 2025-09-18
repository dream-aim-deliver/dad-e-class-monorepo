# EClassMonorepo

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is almost ready ✨.

[Learn more about this workspace setup and its capabilities](https://nx.dev/nx-api/next?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!


## Contributing

To install dependencies:

Create a `.npmrc` file in the root of the workspace with the following content:

```plaintext
@dream-aim-deliver:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Please issue the token in the developer settings on GitHub with `read:packages` scope.

```sh
# At the root of the workspace
pnpm install
```

Before submitting a Pull Request, please run the following commands to ensure your code follows our standards, and make sure to fix any issues that come up:

Lint:
```sh
pnpm nx run-many -t lint
```

Build:
```sh
pnpm nx run-many -t build
```

Tests:
```sh
pnpm nx run-many -t test
```


## Finish your CI setup

[Click here to finish setting up your workspace!](https://cloud.nx.app/connect/BXkMuj9bMK)


## Run tasks

To run the dev server for your app, use:

```sh
npx nx dev platform
```

To create a production bundle:

```sh
npx nx build platform
```

To see all available targets to run for a project, run:

```sh
npx nx show project platform
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Running the Development Environment (Docker Compose)

### Prerequisites
- Docker and Docker Compose installed
- DAD Github PAT with `read:packages` scope

### Login to the Github Docker Registry
```bash
echo $DAD_GITHUB_PAT | docker login ghcr.io -u USERNAME --password-stdin
```
### Host Configuration

To make `http://minio` resolve to your local machine, you need to add an entry to your system’s hosts file.

#### macOS / Linux
Edit the `/etc/hosts` file (requires sudo):

```bash
sudo nano /etc/hosts
```
Add the following line:

```plaintext
127.0.0.1 minio
```

Save and exit

#### Windows
Edit the `C:\Windows\System32\drivers\etc\hosts` file (requires admin privileges):

```bash
notepad C:\Windows\System32\drivers\etc\hosts
```
Add the following line:

```plaintext
127.0.0.1 minio
```

Save and exit

### Starting the Services

```bash
# Build and start all services in detached mode
docker compose up -d
```

This command will start the following services:
- **PostgreSQL** - Relational database
- **MongoDB** - Document database
- **MinIO** - S3-compatible object storage
- **CMS FastAPI** - Backend API service
- **CMS REST** - Frontend application
- **Adminer** - Database management UI
- **Mongo Express** - MongoDB management UI

### Monitoring Services

```bash
# View logs from all services
docker compose logs -f

# View logs from specific services
docker compose logs -f cms-fastapi
docker compose logs -f cms-rest
```

### Service Endpoints

Once all services are running, you can access:

| Service       | URL                   | Credentials       | Description                     |
|---------------|-----------------------|-------------------|---------------------------------|
| CMS FastAPI   | http://localhost:8000 | -                 | Backend REST API & Swagger docs |
| CMS REST      | http://localhost:5173 | -                 | Frontend application            |
| Adminer       | http://localhost:8080 | postgres/postgres | PostgreSQL management           |
| MinIO Console | http://localhost:9091 | minio/minio123    | Object storage console          |
| Mongo Express | http://localhost:8082 | admin/admin123    | MongoDB management              |

### Managing the Environment

```bash
# Stop all services (preserves data)
docker compose down

# Stop services and remove volumes (clean slate)
docker compose down -v

# Rebuild specific service
docker compose up --build cms-fastapi

# View service status
docker compose ps
```

### Initializing the Platform

After all services are running, you need to initialize the platform data before developing your NextJS application.

#### Method 1: Using Swagger UI (Recommended)

1. Open the FastAPI Swagger documentation at <http://localhost:8000/docs>
2. Locate the `POST /initializePlatform` endpoint
3. Click "Try it out"
4. Use the following request body (or customize as needed):

**NOTE**: Make sure to use the correct name. It should mimic the value of the `E_CLASS_PLATFORM_NAME` in your NextJS setup.

```json
{
  "request": {
    "type": "public",
    "context": {
      "platformLanguageId": 0,
      "platformId": 0,
      "userRoles": [],
      "expires": 0,
      "digest": "string"
    },
    "platform": {
      "name": "E-Class Dev Platform",
      "accentColor": "orange",
      "font": "sans-serif",
      "hasOnlyFreeCourses": true,
      "public": true,
      "footerContent": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"© 2025 JUST DO AD GmbH • Hermetschloostrasse 70, 8048 Zürich • hi@justdoad.ai\"}]}]",
      "currency": "CHF",
      "domainName": "http://localhost:3000"
    },
    "languages": [
      "en", "de"
    ]
  }
}
```

5. Click "Execute"

#### What This Does

This initialization endpoint will:

- Create default user roles in the system
- Set up supported languages (English and German)
- Create the platform with your specified configuration
- Generate platform-language associations
- Provide sample icons and background images for the UI

### Start the Platform

```bash
# Start the platform services
pnpm nx run platform:dev
```

Then, open your browser and navigate to <http://localhost:3000> to access the platform.

### Login

You **MUST** log in via the SSO Provider ( AUTH 0 ). Please do not use the test accounts.

### Assign Roles

You may need to make yourself coach/admin depending on the page you are building.
1. Open the FastAPI Swagger documentation at <http://localhost:8000/docs>
2. Locate the `POST /api/va/user/attach` endpoint
3. Click "Try it out"
4. Use the following request body (or customize as needed):

#### Assign Coach Role
```json
{
  "filter": {
    "byId": {
      "field": "id",
      "type": "number",
      "op": "eq",
      "value": 1
    }
  },
  "operationType": "attach",
  "relationship": "roles",
  "relatedId": 3
}
```

#### Assign Admin Role

```
{
  "filter": {
    "byId": {
      "field": "id",
      "type": "number",
      "op": "eq",
      "value": 1
    }
  },
  "operationType": "attach",
  "relationship": "roles",
  "relatedId": 4
}
```
