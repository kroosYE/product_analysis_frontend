import { Entry } from '@/types/order';
import React from 'react';

// 定義統計卡片的 props
interface StatCardProps {
    title: string;
    value: string;
    bgColor: string;
    textColor: string;
}

interface Summary {
    totalSessions: number;
    totalOrders: number;
    totalProducts: number;
    totalProblemItems: number;
    averageProblemRatio: number;
}

// 統計卡片子元件
const StatCard: React.FC<StatCardProps> = ({ title, value, bgColor, textColor }) => (
    <div className={`p-4 ${bgColor} rounded`}>
        <h4 className={`font-semibold ${textColor}`}>{title}</h4>
        <p className="text-2xl font-bold text-blue-900">{value}</p>
    </div>
);

// 定義摘要元件的 props
interface OrderStatsSummaryProps {
    data: Entry[];              // 已存在的資料
    currentEntry: Entry;        // 當前輸入的資料
    summary: Summary;
}

// 計算函數
const calculateStats = (data: Entry[], currentEntry: Entry) => {
    const allEntries = [...data, currentEntry];

    return {
        totalSessions: allEntries.filter(item => item.category).length,

        totalOrders: allEntries.reduce(
            (sum, item) => sum + Number(item.totalOrders || 0),
            0
        ),

        totalProducts: allEntries.reduce(
            (sum, item) => sum + Number(item.totalProducts || 0),
            0
        ),

        problemRatio: (() => {
            const totalProblemQuantity = allEntries.reduce(
                (sum, item) => sum + Number(item.problemQuantity || 0),
                0
            );
            const totalProducts = allEntries.reduce(
                (sum, item) => sum + Number(item.totalProducts || 0),
                0
            );
            return totalProducts === 0 ? 0 : (totalProblemQuantity / totalProducts) * 100;
        })()
    };
};

export const OrderStatsSummary: React.FC<OrderStatsSummaryProps> = ({ data, currentEntry }) => {
    const stats = calculateStats(data, currentEntry);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
                title="總場次"
                value={`${stats.totalSessions} 場`}
                bgColor="bg-blue-100"
                textColor="text-blue-800"
            />

            <StatCard
                title="總訂單數"
                value={`${stats.totalOrders.toLocaleString()} 筆`}
                bgColor="bg-green-100"
                textColor="text-green-800"
            />

            <StatCard
                title="商品總數"
                value={`${stats.totalProducts.toLocaleString()} 件`}
                bgColor="bg-purple-100"
                textColor="text-purple-800"
            />

            <StatCard
                title="問題商品比例"
                value={`${stats.problemRatio.toFixed(2)}%`}
                bgColor="bg-red-100"
                textColor="text-red-800"
            />
        </div>
    );
};

export default OrderStatsSummary;