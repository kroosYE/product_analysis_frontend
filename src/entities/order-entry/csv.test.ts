import { describe, expect, it } from "vitest";
import { Entry } from "@/types/order";
import { parseCsvToEntries, serializeEntriesToCsv } from "./csv";

const sampleEntry: Entry = {
  category: "11月第一場",
  session: 1,
  totalOrders: 1200,
  totalProducts: 3600,
  problemItems: 45,
  problemQuantity: 150,
  departmentHandled: 120,
  nonDepartmentHandled: 30,
  problemRatio: 4.17,
  refundAmount: 45000,
  smsNotificationCost: 1200,
  compensationAmount: 3000,
  extraShippingCost: 2000,
  humanResourceHours: 49.5,
  staffUsed: 3,
  cause: "海關延遲",
};

describe("order-entry csv", () => {
  it("exports csv with stable header and dd:hh:mm hours", () => {
    const csv = serializeEntriesToCsv([sampleEntry]);
    const lines = csv.split("\n");

    expect(lines[0]).toContain("category,session,totalOrders");
    expect(lines[1]).toContain("11月第一場");
    expect(lines[1]).toContain("02:01:30");
  });

  it("escapes quoted and comma fields", () => {
    const csv = serializeEntriesToCsv([
      {
        ...sampleEntry,
        category: '11月, "特殊場次"',
        cause: "品質問題, 客訴",
      },
    ]);

    expect(csv).toContain('"11月, ""特殊場次"""');
    expect(csv).toContain('"品質問題, 客訴"');
  });

  it("imports valid rows and reports row level errors", () => {
    const csv = [
      "category,session,totalOrders,totalProducts,problemItems,problemQuantity,departmentHandled,nonDepartmentHandled,refundAmount,smsNotificationCost,compensationAmount,extraShippingCost,humanResourceHours,staffUsed,cause",
      "11月第一場,1,1200,3600,45,150,120,30,45000,1200,3000,2000,02:01:30,3,海關延遲",
      ",2,1000,2000,20,30,15,15,1000,100,200,50,00:12:00,2,缺貨",
    ].join("\n");

    const result = parseCsvToEntries(csv);

    expect(result.entries).toHaveLength(1);
    expect(result.entries[0].category).toBe("11月第一場");
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].row).toBe(3);
  });
});
