# Angular 19 Demo App for Kubernetes

A minimal Angular 19 application demonstrating deployment in Kubernetes/OpenShift with strict security constraints.

## Features

- ✅ Angular 19 standalone components
- ✅ Multi-stage Docker build
- ✅ Non-root container
- ✅ Read-only filesystem support
- ✅ Dynamic environment variables via env.js
- ✅ All logs to stdout/stderr

## Project Structure

```
angular-demo/
├── src/
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   └── app.component.css
│   ├── index.html
│   └── main.ts
├── Dockerfile
├── nginx.conf
├── values.yaml
├── package.json
├── angular.json
└── tsconfig.json
```

## Environment Variables

Traditional `env.js` variables are managed in a ConfigMap
which comes from Helm chart values.  The `env.js` file
is mounted inside an emptyDir.

The app displays these Kubernetes environment variables:
- `APP_VERSION` - Application version
- `ENVIRONMENT` - Deployment environment (dev/staging/production)
- `POD_NAME` - Kubernetes pod name
- `POD_NAMESPACE` - Kubernetes namespace
- `NODE_NAME` - Kubernetes node name

## Building

```bash
# Build the Docker image
docker build -t your-registry/angular-demo:latest .

# Push to registry
docker push your-registry/angular-demo:latest
```

## Deployment

Using the bjw-s helm chart:

```bash
# Add the helm repo
helm repo add bjw-s https://bjw-s-labs.github.io/helm-charts
helm repo update

# Install the app
helm install angular-demo bjw-s/app-template \
  --version 4.5.0 \
  -f values.yaml
```

## Security Features

- **Non-root user**: Runs as an ID
- **Read-only root filesystem**: Writable volumes only for /tmp and nginx cache
- **No privilege escalation**: `allowPrivilegeEscalation: false`
- **Dropped capabilities**: All Linux capabilities dropped
- **Security headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **Health checks**: Liveness and readiness probes

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm start

# Build for production
npm run build
```

## Logs

All nginx access logs go to stdout, error logs go to stderr. View with:

```bash
kubectl logs -f deployment/angular-demo
```

## Notes

- The nginx configuration uses port 8080 (non-privileged)
- Temporary directories are mounted as emptyDir volumes
- Environment variables are injected via the env.js file at runtime
- The app uses Angular 19's standalone components (no NgModules)
