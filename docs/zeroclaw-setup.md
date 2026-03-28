# ZeroClaw Setup for Zagreb Buddy

Zagreb Buddy uses [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw) as the agent orchestration runtime on the VPS. ZeroClaw provides the gateway, session management, and tool dispatch layer that our FastAPI agent sits behind.

## Prerequisites

- VPS with ZeroClaw installed (`brew install zeroclaw` or build from source)
- Vertex AI credentials (Google Cloud service account with Gemini access)
- Python 3.11+ on the VPS

## VPS Setup

### 1. Install ZeroClaw

```bash
# Option A: One-line install
curl -LsSf https://raw.githubusercontent.com/zeroclaw-labs/zeroclaw/master/install.sh | bash

# Option B: Homebrew
brew install zeroclaw

# Run onboarding
zeroclaw onboard
```

### 2. Configure ZeroClaw provider

Set Gemini as the provider in `~/.zeroclaw/config.toml`:

```toml
default_provider = "gemini"
```

Authenticate via OAuth:

```bash
zeroclaw auth login --provider gemini --profile default
```

### 3. Deploy the Zagreb Buddy agent

```bash
# Clone the repo on VPS
git clone https://github.com/squattedaccount/Zagreb-Buddy.git
cd Zagreb-Buddy/agent

# Install Python dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your Google Cloud project ID and credentials path

# Run the FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 4. Run as a background service

For production, run with systemd or ZeroClaw's service manager:

```bash
# Option A: ZeroClaw service
zeroclaw service install
zeroclaw service start

# Option B: Direct uvicorn with nohup
nohup uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2 &

# Option C: systemd unit (recommended for production)
# Create /etc/systemd/system/zagreb-buddy.service
```

### 5. Verify

```bash
curl http://localhost:8000/health
```

Expected response:

```json
{
  "status": "running",
  "skills_loaded": 6,
  "skill_names": ["Architecture & Design", "Coffee Culture", "Food & Markets", "Street Art & Graffiti", "Hidden Courtyards & Passages", "Local Bars & Nightlife"]
}
```

## Architecture with ZeroClaw

```
Mobile Browser
    │
    ▼
Vercel (Next.js Frontend)
    │  /api/chat proxy
    ▼
VPS ─── ZeroClaw Gateway (manages sessions, tools, auth)
    │
    ├── FastAPI (main.py, port 8000)
    │   ├── ZagrebAgent (zagreb_agent.py)
    │   ├── SkillLoader (skill_loader.py)
    │   └── Skills (6 skill directories)
    │
    └── Vertex AI / Gemini 2.0 Flash
```

## Useful ZeroClaw Commands

```bash
zeroclaw status          # Check if gateway is running
zeroclaw doctor          # Run diagnostics
zeroclaw agent -m "test" # Quick test message
zeroclaw gateway         # Start the gateway
```

## Security Notes

- The FastAPI server should be behind a reverse proxy (nginx/caddy) with HTTPS in production
- ZeroClaw's DM pairing is enabled by default — unknown senders need explicit approval
- The `.env` file with Google Cloud credentials should never be committed to git
