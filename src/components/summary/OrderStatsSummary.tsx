import { OrderSummary } from '@/entities/order-entry/selectors';
import React from 'react';

// 定義統計卡片的 props
interface StatCardProps {
    title: string;
    value: string;
    bgColor: string;
    textColor: string;
}

// 統計卡片子元件
const StatCard: React.FC<StatCardProps> = ({ title, value, bgColor, textColor }) => (
    <div className={`p-4 ${bgColor} rounded`}>
        <h4 className={`font-semibold ${textColor}`}>{title}</h4>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
);

// 定義摘要元件的 props
interface OrderStatsSummaryProps {
    summary: OrderSummary;
}

export const OrderStatsSummary: React.FC<OrderStatsSummaryProps> = ({ summary }) => {

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
                title="總場次"
                value={`${summary.totalSessions} 場`}
                bgColor="bg-blue-100"
                textColor="text-blue-800"
            />

            <StatCard
                title="總訂單數"
                value={`${summary.totalOrders.toLocaleString()} 筆`}
                bgColor="bg-green-100"
                textColor="text-green-800"
            />

            <StatCard
                title="商品總數"
                value={`${summary.totalProducts.toLocaleString()} 件`}
                bgColor="bg-amber-100"
                textColor="text-amber-800"
            />

            <StatCard
                title="問題商品比例"
                value={`${summary.problemRatio.toFixed(2)}%`}
                bgColor="bg-red-100"
                textColor="text-red-800"
            />
        </div>
    );
};

export default OrderStatsSummary;
