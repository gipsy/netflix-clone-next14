# Google OAuth (production)

NextAuth callback (verified from live site `/api/auth/providers`):

```text
https://netflix-clone-next14.vercel.app/api/auth/callback/google
```

OAuth client ID in this project (from env):

```text
51346331213-23bfpm4rsemd6cvdbhff2e2t5m4d0ckl.apps.googleusercontent.com
```

## Fix `redirect_uri_mismatch`

1. Open [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials).
2. Select the **same Google Cloud project** that owns the client ID above.
3. Under **OAuth 2.0 Client IDs**, open a client of type **Web application** whose **Client ID** matches exactly (not Android/iOS/Desktop).
4. Set **Authorized JavaScript origins**:
   - `https://netflix-clone-next14.vercel.app`
   - `http://localhost:3000` (optional, for local dev)
5. Set **Authorized redirect URIs** (exact match, no trailing slash):
   - `https://netflix-clone-next14.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (optional, for local dev)
6. Click **Save**. Wait 1–5 minutes before retrying (incognito window).

If you created a **new** OAuth client, update `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`, run `npm run env:vercel`, and redeploy.

## Consent screen

Under **APIs & Services → OAuth consent screen**, if the app is in **Testing**, add `TER4444@gmail.com` (and other testers) under **Test users**, or publish the app when ready.
