# SAHYOG AI prototype

Build a polished, responsive, frontend-only prototype for the uploaded SAHYOG AI brief.

## Deliverables
- Replace the template home screen with a government-tech case-management workspace: overview, new assessment, case management and details, referral center, reports, and settings.
- Use clearly synthetic cases and metrics; support search, filters, sorting, pagination, editable notes/statuses, and mock referral creation.
- Implement a validated assessment form with English/Hindi/Other, Text/Transcript modes, three prepared scenarios, a brief loading state, and explainable illustrative results that always require human review.
- Keep all state local to the frontend; include no backend, real AI, authentication, personal data, clinical claims, or external actions.

## Design and implementation
- Establish a restrained navy, white, and light-grey design system with accessible amber/red status tokens; responsive sidebar and mobile navigation.
- Use existing TanStack Start, shadcn controls, Lucide icons, and Recharts. Keep shared demo state in one client-side application shell so changes persist while navigating between views.
- Add route-specific page metadata and an architecture note in the project guidance.

## Validation
- Run existing routing tests and inspect the preview/build diagnostics. Verify the main navigation and a representative assessment flow in the running app.
