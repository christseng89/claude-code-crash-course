# OWASP ZAP – Docker Compose Setup

This Docker Compose setup runs two services: a headless ZAP daemon for API/proxy use, and a browser-based ZAP GUI via Webswing.

---

## Services

### `zap` – Headless Daemon

- Uses the official `ghcr.io/zaproxy/zaproxy:stable` image
- Runs ZAP as a background daemon accessible at `http://localhost:8086`
- Exposes the REST API and proxy port (mapped `8086` → `8080` inside container)
- API key is set to `changeme` — **please change this before use**

### `zap-webswing` – Browser-based GUI

- Also uses the stable ZAP image, started with `zap-webswing.sh`
- Gives you the full ZAP Desktop GUI in your browser at `http://localhost:8096/zap`
- No VNC or X11 forwarding needed — it runs entirely in-browser
- Port mapped `8096` → `8080` inside container

---

## Getting Started

### 1. Start the containers

```bash
docker compose up -d
```

### 2. Access the ZAP GUI

Open your browser and navigate to:

```browser
http://localhost:8096/zap
```

> **Note:** Go to `/zap` (not just `/`). The root path `/` is the Webswing admin console. The ZAP GUI is at the `/zap` path and requires no login.

### 3. Access the ZAP API

The REST API is available at:

```browser
http://localhost:8086/JSON/core/view/version/?apikey=changeme
```

---

## Session Persistence (First Launch)

On first launch, ZAP will ask:

> **"Do you want to persist the ZAP Session?"**

**Recommended choice:** Select **"No, I do not want to persist this session at this moment in time"** and check **"Remember my choice and do not ask me again"**, then click **Start**.

You can always save a session manually later via **File → Save Session**.

---

## Network

Both services share a `zapnet` bridge network so they can communicate with each other and with any target containers you add. To scan an app running in another Docker container, add it to the same `zapnet` network.

---

## Volumes

| Volume | Mount | Purpose |
|--------|-------|---------|
| `zap-data` | `/zap/wrk` | ZAP daemon working directory |
| `zap-gui-data` | `/zap/wrk` | ZAP GUI working directory |

On Windows 11 with Docker Desktop (WSL2), named volumes are stored at:

```wsl
\\wsl$\docker-desktop-data\data\docker\volumes\zap-data\_data
```

To use a local Windows folder instead, replace the named volume with a bind mount:

```yaml
volumes:
  - D:\zap-data:/zap/wrk
```

---

## Port Reference

| Service | Host Port | Container Port | Purpose |
|---------|-----------|----------------|---------|
| `owasp-zap` | `8086` | `8080` | ZAP API / Proxy |
| `owasp-zap-gui` | `8096` | `8080` | ZAP Webswing GUI |

---

## Useful Commands

```bash
# Start services in background
docker compose up -d

# Stop and remove containers
docker compose down

# View logs for ZAP daemon
docker logs owasp-zap

# View logs for ZAP GUI
docker logs owasp-zap-gui

# Follow live logs
docker logs -f owasp-zap-gui

# Check running containers and ports
docker ps
```

---

## Troubleshooting

**`localhost:8096` shows "This page isn't working"**
Webswing takes 30–60 seconds to fully initialize. Wait and retry. Check logs with `docker logs -f owasp-zap-gui`.

**`localhost:8096` shows a login prompt**
You are on the admin console path. Navigate to `http://localhost:8096/zap` instead — no credentials required.

**Port already allocated error**
Another process is using the port. Find it with:

```bash
netstat -ano | findstr :8096
```

Then either stop that process or change the host port in `docker-compose.yaml`.

**Git Bash path conversion issues with `docker exec`**
Prefix commands with `MSYS_NO_PATHCONV=1` or use Windows CMD instead of Git Bash:

```bash
MSYS_NO_PATHCONV=1 docker exec -it owasp-zap-gui cat /zap/webswing/webswing.config
```

---

> ⚠️ **Security note:** The API is configured to accept connections from any host (`api.addrs.addr.name=.*`). This is convenient for local use, but tighten the network configuration before deploying to any shared or production environment. Also change the `api.key` value from `changeme`.
