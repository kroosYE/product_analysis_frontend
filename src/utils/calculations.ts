import { Entry } from '@/types/order';

/**
 * 計算問題比例
 * @param data - 訂單資料陣列
 * @returns 包含問題比例的新資料陣列
 */
export const calculateProblemRatio = (data: Entry[]) => {
    return data.map(item => ({
        ...item,
        problemRatio: item.totalProducts > 0
            ? (item.problemQuantity / item.totalProducts) * 100
            : 0
    }));
};

/**
 * 計算部門處理比例
 * @param data - 訂單資料
 * @returns 部門處理的百分比
 */
export const calculateDepartmentHandlingRatio = (entry: Entry) => {
    const totalHandled = entry.departmentHandled + entry.nonDepartmentHandled;
    if (totalHandled === 0) return 0;
    return (entry.departmentHandled / totalHandled) * 100;
};

/**
 * 計算成本分析
 * @param entry - 單筆訂單資料
 * @returns 成本分析結果
 */
export const calculateCosts = (entry: Entry) => {
    const totalCost = entry.refundAmount +
        entry.smsNotificationCost +
        entry.compensationAmount +
        entry.extraShippingCost;

    const avgCostPerProblem = entry.problemQuantity > 0
        ? totalCost / entry.problemQuantity
        : 0;

    return {
        totalCost,
        avgCostPerProblem,
        costBreakdown: {
            refund: (entry.refundAmount / totalCost) * 100,
            sms: (entry.smsNotificationCost / totalCost) * 100,
            compensation: (entry.compensationAmount / totalCost) * 100,
            shipping: (entry.extraShippingCost / totalCost) * 100
        }
    };
};

/**
 * 計算人力效率
 * @param entry - 單筆訂單資料
 * @returns 人力效率分析結果
 */
export const calculateStaffEfficiency = (entry: Entry) => {
    const casesPerHour = entry.humanResourceHours > 0
        ? (entry.problemItems / entry.humanResourceHours)
        : 0;

    const casesPerStaff = entry.staffUsed > 0
        ? (entry.problemItems / entry.staffUsed)
        : 0;

    return {
        casesPerHour,
        casesPerStaff,
        avgHoursPerCase: entry.problemItems > 0
            ? (entry.humanResourceHours / entry.problemItems)
            : 0
    };
};