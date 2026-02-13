# Order Analysis Architecture-First Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor the order analysis frontend so committed data, summary logic, and chart rendering are consistent and maintainable.

**Architecture:** Keep UI components modular, move aggregation logic to `entities/order-entry`, and let `useOrderData` orchestrate normalized state updates. Page layout is reorganized into input/metrics/analysis sections without changing core feature scope.

**Tech Stack:** React, TypeScript, Vite, TailwindCSS, Recharts, html2canvas

---

### Task 1: Add Domain Selectors

**Files:**
- Create: `src/entities/order-entry/selectors.ts`
- Create: `src/entities/order-entry/model.ts`

**Step 1: Add entry selector utilities**

Create pure functions for:
- valid-entry filtering
- ratio normalization
- summary aggregation

**Step 2: Run build to verify imports/types**

Run: `npm run build`
Expected: build succeeds.

### Task 2: Fix Time Conversion Pipeline

**Files:**
- Modify: `src/utils/formatters.ts`
- Modify: `src/hooks/useOrderData.ts`

**Step 1: Fix `DD:HH:MM` formatter output**

Ensure formatter returns plain formatted string instead of malformed template text.

**Step 2: Add parse helper and wire it into input handling**

Parse `humanResourceHours` in one place and use in hook updates.

**Step 3: Run build**

Run: `npm run build`
Expected: build succeeds.

### Task 3: Correct Data Flow and Summary Usage

**Files:**
- Modify: `src/pages/detailed-order-analysis.tsx`
- Modify: `src/components/summary/OrderStatsSummary.tsx`

**Step 1: Ensure charts/cards only use committed data**

Remove draft entry from visualization datasets.

**Step 2: Make summary component consume precomputed summary props**

Avoid duplicate calculations inside presentation component.

**Step 3: Run build**

Run: `npm run build`
Expected: build succeeds.

### Task 4: Fix Staff Card Delete/Update Index Bug

**Files:**
- Modify: `src/components/cards/StaffAnalysisCard.tsx`

**Step 1: Preserve original index after filtering**

Map entries with original index, filter, then pass original index to callbacks.

**Step 2: Run build**

Run: `npm run build`
Expected: build succeeds.

### Task 5: Re-layout Page Structure

**Files:**
- Modify: `src/pages/detailed-order-analysis.tsx`
- Modify: `src/components/charts/OrderAnalysisChart.tsx`

**Step 1: Reorder into data input / core metrics / analysis sections**

Improve desktop and mobile readability with clear section boundaries.

**Step 2: Add chart empty-state fallback**

Prevent blank chart container when no data is available.

**Step 3: Run build**

Run: `npm run build`
Expected: build succeeds.
