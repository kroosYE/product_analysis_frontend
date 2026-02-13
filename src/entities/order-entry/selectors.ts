import { Entry } from "@/types/order";

export interface OrderSummary {
  totalSessions: number;
  totalOrders: number;
  totalProducts: number;
  totalProblemItems: number;
  problemRatio: number;
}

export const isValidEntry = (entry: Entry) => entry.category.trim().length > 0;

export const getValidEntries = (entries: Entry[]) => entries.filter(isValidEntry);

export const withProblemRatio = (entries: Entry[]) =>
  entries.map((entry) => ({
    ...entry,
    problemRatio:
      entry.totalProducts > 0
        ? (entry.problemQuantity / entry.totalProducts) * 100
        : 0,
  }));

export const buildOrderSummary = (entries: Entry[]): OrderSummary => {
  const validEntries = getValidEntries(entries);
  const totalOrders = validEntries.reduce((sum, entry) => sum + entry.totalOrders, 0);
  const totalProducts = validEntries.reduce((sum, entry) => sum + entry.totalProducts, 0);
  const totalProblemItems = validEntries.reduce((sum, entry) => sum + entry.problemItems, 0);
  const totalProblemQuantity = validEntries.reduce(
    (sum, entry) => sum + entry.problemQuantity,
    0,
  );

  return {
    totalSessions: validEntries.length,
    totalOrders,
    totalProducts,
    totalProblemItems,
    problemRatio: totalProducts > 0 ? (totalProblemQuantity / totalProducts) * 100 : 0,
  };
};
