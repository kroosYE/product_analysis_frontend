import { Entry } from "@/types/order";
import { DEFAULT_ORDER_ENTRY } from "@/entities/order-entry/model";
import { formatTotalHoursToDDHHMM, parseDDHHMMToTotalHours } from "@/utils/formatters";

export interface CsvRowError {
  row: number;
  message: string;
}

export interface CsvParseResult {
  entries: Entry[];
  errors: CsvRowError[];
}

const CSV_HEADERS = [
  "category",
  "session",
  "totalOrders",
  "totalProducts",
  "problemItems",
  "problemQuantity",
  "departmentHandled",
  "nonDepartmentHandled",
  "refundAmount",
  "smsNotificationCost",
  "compensationAmount",
  "extraShippingCost",
  "humanResourceHours",
  "staffUsed",
  "cause",
] as const;

type CsvHeader = (typeof CSV_HEADERS)[number];

const NUMERIC_FIELDS: CsvHeader[] = [
  "session",
  "totalOrders",
  "totalProducts",
  "problemItems",
  "problemQuantity",
  "departmentHandled",
  "nonDepartmentHandled",
  "refundAmount",
  "smsNotificationCost",
  "compensationAmount",
  "extraShippingCost",
  "staffUsed",
];

const escapeCsvValue = (value: string) => {
  if (!/[",\n]/.test(value)) {
    return value;
  }

  return `"${value.replace(/"/g, '""')}"`;
};

const splitCsvLine = (line: string) => {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
};

const parseNonNegativeNumber = (value: string) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 0) {
    return 0;
  }
  return parsed;
};

const validateEntry = (entry: Entry): string | null => {
  if (!entry.category.trim()) {
    return "場次名稱為必填";
  }

  if (entry.problemQuantity > entry.totalProducts) {
    return "問題商品數量不能大於商品總數";
  }

  return null;
};

const buildEntryWithRatio = (entry: Entry): Entry => ({
  ...entry,
  problemRatio:
    entry.totalProducts > 0 ? (entry.problemQuantity / entry.totalProducts) * 100 : 0,
});

export const serializeEntriesToCsv = (entries: Entry[]) => {
  const header = CSV_HEADERS.join(",");
  const rows = entries.map((entry) =>
    CSV_HEADERS.map((field) => {
      if (field === "humanResourceHours") {
        return escapeCsvValue(formatTotalHoursToDDHHMM(entry.humanResourceHours));
      }

      const value = String(entry[field] ?? "");
      return escapeCsvValue(value);
    }).join(","),
  );

  return [header, ...rows].join("\n");
};

export const parseCsvToEntries = (csvText: string): CsvParseResult => {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    return { entries: [], errors: [] };
  }

  const sourceHeaders = splitCsvLine(lines[0]);
  const headerIndexMap: Partial<Record<CsvHeader, number>> = {};

  CSV_HEADERS.forEach((header) => {
    headerIndexMap[header] = sourceHeaders.findIndex((source) => source === header);
  });

  const entries: Entry[] = [];
  const errors: CsvRowError[] = [];

  for (let lineIndex = 1; lineIndex < lines.length; lineIndex += 1) {
    const rowValues = splitCsvLine(lines[lineIndex]);
    const rowNumber = lineIndex + 1;

    const entry: Entry = {
      ...DEFAULT_ORDER_ENTRY,
      category: "",
      cause: "",
    };

    for (const field of CSV_HEADERS) {
      const fieldIndex = headerIndexMap[field];
      if (fieldIndex === undefined || fieldIndex < 0) {
        continue;
      }

      const rawValue = rowValues[fieldIndex] ?? "";

      if (field === "humanResourceHours") {
        const parsedByPattern = parseDDHHMMToTotalHours(rawValue);
        entry.humanResourceHours =
          rawValue.includes(":") || parsedByPattern > 0
            ? parsedByPattern
            : parseNonNegativeNumber(rawValue);
        continue;
      }

      if (field === "category" || field === "cause") {
        entry[field] = rawValue;
        continue;
      }

      if (NUMERIC_FIELDS.includes(field)) {
        entry[field] = parseNonNegativeNumber(rawValue) as never;
      }
    }

    const error = validateEntry(entry);
    if (error) {
      errors.push({ row: rowNumber, message: error });
      continue;
    }

    entries.push(buildEntryWithRatio(entry));
  }

  return { entries, errors };
};
