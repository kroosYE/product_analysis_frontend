# Order Analysis Architecture-First Design

## Decision

Use architecture-first refactor on top of `develop` branch to stabilize data flow, isolate domain logic, and then re-layout UI sections without changing business behavior.

## Current Problems Found During Review

1. Draft form data was mixed into charts/cards, causing empty/partial records to affect analytics.
2. Staff card deletion used filtered index instead of original index, deleting wrong record in some cases.
3. `DD:HH:MM` formatter returned broken string output.
4. Summary and ratio logic existed in multiple locations with inconsistent behavior.

## Design Changes

1. Add domain selectors in `entities/order-entry`:
   - entry filtering
   - ratio normalization
   - summary aggregation
2. Keep state orchestration in `useOrderData` and move summary build to selector.
3. Restrict charts/cards to committed entries only (`data`), no draft merging.
4. Re-layout page into explicit sections:
   - data input
   - core metrics
   - analysis view

## Expected Outcome

1. Consistent metrics and chart data.
2. Cleaner architecture boundaries (`hooks` orchestration + `entities` calculations + `components` rendering).
3. Better UX hierarchy on desktop/mobile without replacing existing libraries.
