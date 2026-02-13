# Order Analysis CSV Import Export Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add CSV import/export so users can batch backup and restore order analysis records with row-level validation feedback.

**Architecture:** Keep CSV logic in `entities/order-entry` as pure functions (`serialize`, `parse`, `validate`) and keep state mutation in `useOrderData`. The page layer only handles file selection, preview result display, and user-triggered import/export actions. This prevents UI components from embedding parsing logic and keeps data rules reusable.

**Tech Stack:** React, TypeScript, Vite, existing hooks/components, browser File API

---

### Task 1: Test CSV entities (RED)

**Files:**
- Test: `src/entities/order-entry/csv.test.ts`

**Step 1: Write failing tests for export behavior**

Test expectations:
- outputs fixed header order
- escapes commas/quotes/newlines
- serializes `humanResourceHours` as `DD:HH:MM`

**Step 2: Write failing tests for import behavior**

Test expectations:
- parses valid rows into `Entry[]`
- reports row index + reason for invalid rows
- supports merge mode input payload

**Step 3: Run tests to verify failures**

Run: `npm test -- src/entities/order-entry/csv.test.ts`
Expected: FAIL due to missing module/functions.

### Task 2: Implement CSV entities (GREEN)

**Files:**
- Create: `src/entities/order-entry/csv.ts`
- Modify: `src/utils/formatters.ts`
- Test: `src/entities/order-entry/csv.test.ts`

**Step 1: Implement minimal CSV serializer/parser/validator**

Functions:
- `serializeEntriesToCsv(entries)`
- `parseCsvToEntries(csvText)`
- `validateEntry(entry)`

**Step 2: Re-run tests for entity module**

Run: `npm test -- src/entities/order-entry/csv.test.ts`
Expected: PASS.

### Task 3: Integrate in data hook

**Files:**
- Modify: `src/hooks/useOrderData.ts`

**Step 1: Add import/export hook APIs**

Add:
- `exportCsv(): string`
- `importCsv(csvText, mode)` with `append`/`replace`
- structured result `{ importedCount, errors }`

**Step 2: Ensure imported rows recompute ratio and summary**

Use existing selectors to normalize imported entries.

**Step 3: Run tests/build**

Run: `npm test -- src/entities/order-entry/csv.test.ts && npm run build`
Expected: PASS + build success.

### Task 4: Add UI controls for CSV actions

**Files:**
- Modify: `src/pages/detailed-order-analysis.tsx`

**Step 1: Add CSV export button**

Trigger download with date-suffixed filename.

**Step 2: Add CSV import file picker + merge mode selector**

Modes:
- append
- replace

**Step 3: Add import result feedback**

Show imported count and first few row errors.

**Step 4: Build verification**

Run: `npm run build`
Expected: build succeeds.

### Task 5: Final verification

**Files:**
- Modify if needed: `docs/plans/2026-02-13-order-analysis-csv-import-export-implementation-plan.md`

**Step 1: Execute smoke checks manually**

1) export existing rows
2) import same file in append mode
3) import malformed CSV and verify row-level error messaging

**Step 2: Run final command set**

Run: `npm test -- src/entities/order-entry/csv.test.ts && npm run build`
Expected: all pass.
