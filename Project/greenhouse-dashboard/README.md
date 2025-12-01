## Greenhouse Monitoring Dashboard

IoT-enabled strawberry cultivation dashboard that mirrors the reference UI while integrating live data from Firebase. The UI highlights environment metrics, device health, camera feeds, and agronomy tasks in one responsive layout.

### Stack

- Next.js App Router with TypeScript
- Tailwind CSS (v4 via `@tailwindcss/postcss`)
- Firebase Web SDK (Auth + Firestore) for real-time data
- Lucide icons for UI parity with the proposal mockups

### Getting started

```bash
npm install
npm run dev
# or, if port 3000 is blocked, npx next dev -p 4000
```

Open `http://localhost:3000` to view the dashboard.

### Navigation

All routes share the same glassmorphic sidebar to keep the theme consistent:

- `/` Overview: hero weather card, KPI grid, devices, camera, and tasks preview.
- `/details`: proposal context, SMART goals, and optimal parameter table.
- `/plant`: section-by-section health with analytic CCTV hero.
- `/tasks`: ritual tracker with timeline flow.
- `/devices`: fleet status with online/issue/offline highlights.
- `/activity`: alert log plus architecture and security notes.

### Firebase setup

1. Create a Firebase project and enable Firestore in Native mode.
2. Add a Web app and copy the keys into a `.env.local` file (use `.env.local.example` as the template).
3. Create a `dashboards/primary` document that matches the `DashboardData` type in `src/lib/types.ts`.
4. Deploy the ESP32 publisher so it writes readings to that document or update the mock data generator to push aggregated values.

When no Firebase config is present the UI automatically falls back to `src/lib/sample-data.ts` so designers can work offline.

### Data contract

The dashboard consumes:

- `overview`: greenhouse metadata, current weather, and active sector info.
- `metrics`: sensor KPIs with helper text and status.
- `devices`: sensors, cameras, and calibration notes.
- `tasks`: agronomy workflow list that powers the progress indicator.
- `sections`: health scores for each greenhouse bay.
- `camera`: currently selected camera feed metadata.

See `src/lib/types.ts` for the exact schema.

### Contribution notes

- Follow the “dont include comments and emojis” repo rule for all files.
- Use the existing component folders inside `src/components/dashboard` for UI additions so styling remains consistent.
- Run `npm run lint` before raising a PR.
