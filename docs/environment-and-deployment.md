# Environment variables

## Frontend (`.env.local` / Vercel)

```env
AGENT_VPS_URL=https://your-vps-ip-or-domain:8000
```

## Backend (`.env` on VPS)

```env
GOOGLE_CLOUD_PROJECT=your-hackathon-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

---

# Deployment checklist

## Frontend (Vercel)

- [ ] Push to GitHub
- [ ] Connect repo to Vercel
- [ ] Set `AGENT_VPS_URL` env var
- [ ] Deploy
- [ ] Test on mobile
- [ ] Share URL

## Backend (VPS)

- [ ] Install Python 3.11+
- [ ] `pip install -r requirements.txt`
- [ ] Set up Google Cloud credentials
- [ ] Copy `skills/` directory
- [ ] Run: `uvicorn main:app --host 0.0.0.0 --port 8000`
- [ ] Test: `curl http://VPS_IP:8000/health`
- [ ] Ensure firewall allows port 8000 from Vercel (or use reverse proxy + HTTPS)
