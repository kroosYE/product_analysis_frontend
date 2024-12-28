import { Entry } from '@/types/order';
import React from 'react';

// 定義資訊項目的類型
interface InfoItem {
    label: string;
    value: number | string;
    unit: string;
}

// 定義元件的 props
interface StaffAnalysisCardProps {
    entry: Entry;
    onDelete: () => void;
    onUpdate: (updatedEntry: Entry) => void;
}

// 建立資訊項目元件
const InfoItem: React.FC<InfoItem> = ({ label, value, unit }) => (
    <p>
        <span className="font-semibold">{label}：</span>
        {value} {unit}
    </p>
);

export const StaffAnalysisCard: React.FC<StaffAnalysisCardProps> = ({ entry }) => {
    // 定義要顯示的資訊項目
    const infoItems: InfoItem[] = [
        {
            label: '總處理時間',
            value: entry.humanResourceHours,
            unit: '小時'
        },
        {
            label: '部門處理數量',
            value: entry.departmentHandled,
            unit: '件'
        },
        {
            label: '非部門處理數量',
            value: entry.nonDepartmentHandled,
            unit: '件'
        },
        {
            label: '耗費人力',
            value: entry.staffUsed,
            unit: '人'
        },
        {
            label: '主要原因',
            value: entry.cause,
            unit: ''
        }
    ];

    return (
        <div className="p-4 bg-gray-50 rounded shadow hover:shadow-md transition-shadow">
            <h4 className="font-bold text-lg mb-2 text-blue-800">
                {entry.category || '未命名場次'}
            </h4>
            <div className="space-y-2">
                {infoItems.map((item, index) => (
                    <InfoItem
                        key={index}
                        label={item.label}
                        value={item.value}
                        unit={item.unit}
                    />
                ))}
            </div>
        </div>
    );
};

// 卡片列表容器元件
interface StaffAnalysisCardListProps {
    entries: Entry[];
    onDelete: (index: number) => void;
    onUpdate: (index: number, updatedEntry: Entry) => void;
}

export const StaffAnalysisCardList: React.FC<StaffAnalysisCardListProps> = ({
    entries,
    onDelete,
    onUpdate
}) => {
    // 過濾掉沒有類別名稱的條目
    const validEntries = entries.filter(entry => entry.category.trim() !== '');

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {validEntries.map((entry, index) => (
                <StaffAnalysisCard
                    key={index}
                    entry={entry}
                    onDelete={() => onDelete(index)}
                    onUpdate={(updatedEntry) => onUpdate(index, updatedEntry)}
                />
            ))}
        </div>
    );
};
export default StaffAnalysisCardList;