// 定義資料類型
export interface Entry {
    category: string;
    session: number;
    totalOrders: number;
    totalProducts: number;
    problemItems: number;
    problemQuantity: number;
    departmentHandled: number;
    nonDepartmentHandled: number;
    problemRatio: number;
    refundAmount: number;
    smsNotificationCost: number;
    compensationAmount: number;
    extraShippingCost: number;
    humanResourceHours: number;
    staffUsed: number;
    cause: string;
}
