import { Entry } from '@/types/order';
import React from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    TooltipProps,
    XAxis,
    YAxis
} from 'recharts';

// 基礎圖表配置類型
interface BaseChartConfig {
    dataKey: string;
    name: string;
    fill: string;
}

// 問題分析圖表配置類型
interface ProblemChartConfig extends BaseChartConfig {
    yAxisId: 'left' | 'right';
}

// 成本分析圖表配置類型
interface CostChartConfig extends BaseChartConfig {
    yAxisId: 'left';
}

// 定義不同類型圖表的配置
const CHART_CONFIGS: Record<'problem' | 'cost', ProblemChartConfig[] | CostChartConfig[]> = {
    problem: [
        { dataKey: 'problemItems', name: '問題品項數', fill: '#ff7300', yAxisId: 'left' },
        { dataKey: 'problemQuantity', name: '問題商品數量', fill: '#ff0000', yAxisId: 'left' },
        { dataKey: 'departmentHandled', name: '部門處理數量', fill: '#82ca9d', yAxisId: 'left' },
        { dataKey: 'nonDepartmentHandled', name: '非部門處理數量', fill: '#ffc658', yAxisId: 'left' },
        { dataKey: 'problemRatio', name: '問題比例', fill: '#8884d8', yAxisId: 'right' }
    ] as ProblemChartConfig[],
    cost: [
        { dataKey: 'refundAmount', name: '退款金額', fill: '#8884d8' },
        { dataKey: 'smsNotificationCost', name: '簡訊費用', fill: '#82ca9d' },
        { dataKey: 'compensationAmount', name: '補償金額', fill: '#ffc658' },
        { dataKey: 'extraShippingCost', name: '額外運費', fill: '#ff7300' }
    ] as CostChartConfig[]
} as const;

// 自定義提示框元件的 props
interface CustomTooltipProps extends TooltipProps<any, any> {
    active?: boolean;
    payload?: any[];
    label?: string;
}

// 自定義提示框元件
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 border rounded shadow">
                <p className="font-bold">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} style={{ color: entry.color }}>
                        {entry.name}: {entry.value.toLocaleString()}
                        {entry.name.includes('比例') ? '%' :
                            entry.name.includes('金額') || entry.name.includes('費用') || entry.name.includes('運費') ? '元' :
                                entry.name.includes('時間') ? '小時' : '件'}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// 圖表元件的 props
interface OrderAnalysisChartProps {
    data: Entry[];                  // 圖表數據
    title: string;                  // 圖表標題
    type: keyof typeof CHART_CONFIGS; // 圖表類型：'problem' 或 'cost'
}

export const OrderAnalysisChart: React.FC<OrderAnalysisChartProps> = ({
    data,
    title,
    type
}) => {
    const chartConfig = CHART_CONFIGS[type];
    // 判斷是否需要雙軸（只有問題分析圖表需要）
    const needsDualAxis = type === 'problem' && chartConfig.some((config) =>
        'yAxisId' in config && config.yAxisId === 'right'
    );

    return (
        <div className="h-80">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis yAxisId="left" orientation="left" />
                    {needsDualAxis && (
                        <YAxis yAxisId="right" orientation="right" />
                    )}
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />

                    {chartConfig.map((config, index) => (
                        <Bar
                            key={index}
                            dataKey={config.dataKey}
                            name={config.name}
                            fill={config.fill}
                            yAxisId={config.yAxisId || 'left'}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default OrderAnalysisChart;