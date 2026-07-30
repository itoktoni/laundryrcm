# Membangun LaundryKu sebagai Android APK

Aplikasi ini adalah **SvelteKit full-stack app** (auth, database Turso, API routes), jadi APK
dibungkus sebagai **WebView yang menunjuk ke URL server yang sudah di-deploy** — bukan static export.
UI sudah dioptimalkan untuk itu (safe-area, `viewport-fit=cover`, `h-dvh`, bottom nav ala aplikasi).

## Opsi A — Capacitor (direkomendasikan)

1. **Deploy aplikasi** (Netlify/VPS) dan catat URL-nya, mis. `https://laundry-app.netlify.app`.

2. **Set URL** di `capacitor.config.json` → `server.url`.

3. **Install Capacitor & buat project Android:**
   ```bash
   npm install @capacitor/core @capacitor/android
   npm install -D @capacitor/cli
   npx cap add android
   npx cap sync
   ```

4. **Build APK** di Android Studio:
   ```bash
   npx cap open android
   ```
   Lalu **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
   APK ada di `android/app/build/outputs/apk/debug/app-debug.apk`.

5. (Opsional) ganti ikon aplikasi di `android/app/src/main/res/mipmap-*`
   memakai `static/icon-192.png` & `static/icon-512.png`.

## Opsi B — TWA (Trusted Web Activity) via Bubblewrap

APK paling ringan — render 100% dari URL PWA, tanpa UI browser sama sekali:

```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://laundry-app.netlify.app/manifest.json
bubblewrap build
```

Syarat: deploy via HTTPS + pasang `/.well-known/assetlinks.json` (dibuat Bubblewrap).

## Catatan

- Login/session memakai cookie — bekerja normal di dalam WebView Capacitor/TWA.
- Fitur Bluetooth print & kamera absensi butuh WebView modern (Android 8+).
- Jika suatu saat ingin **full offline**, app harus dipisah jadi SPA (adapter-static)
  + API terpisah — di luar cakupan file ini.
