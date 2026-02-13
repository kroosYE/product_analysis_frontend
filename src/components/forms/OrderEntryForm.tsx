import { Button } from "@/components/ui/button";
import { Entry } from '@/types/order';
import * as React from 'react';

// 定義元件的 props 介面
interface OrderEntryFormProps {
    // entry: 當前的表單數據
    entry: Entry;
    // onInputChange: 處理輸入變化的函數
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    // onSubmit: 處理表單提交的函數
    onSubmit: () => void;
    error?: string | null;
    humanResourceHoursInput: string;
}

// 定義表單欄位配置
const formFields = [
    { name: 'category', label: '場次名稱', type: 'text' },
    { name: 'totalOrders', label: '總訂單數', type: 'number' },
    { name: 'totalProducts', label: '商品總數', type: 'number' },
    { name: 'problemItems', label: '問題品項數', type: 'number' },
    { name: 'problemQuantity', label: '問題商品數量', type: 'number' },
    { name: 'departmentHandled', label: '部門處理數量', type: 'number' },
    { name: 'nonDepartmentHandled', label: '非部門處理數量', type: 'number' },
    { name: 'refundAmount', label: '退款金額', type: 'number' },
    { name: 'smsNotificationCost', label: '簡訊費用', type: 'number' },
    { name: 'compensationAmount', label: '補償金額', type: 'number' },
    { name: 'extraShippingCost', label: '額外運費', type: 'number' },
    { name: 'humanResourceHours', label: '人力工時', type: 'text', placeholder: 'DD:HH:MM' },
    { name: 'staffUsed', label: '使用人力', type: 'number' },
    { name: 'cause', label: '問題原因', type: 'text' },
];

export const OrderEntryForm: React.FC<OrderEntryFormProps> = ({
    entry,
    onInputChange,
    onSubmit,
    error,
    humanResourceHoursInput
}) => {
    // 定義欄位介面
    interface Field {
        name: string;
        label: string;
        type: string;
        placeholder?: string;
        className?: string; // Optional className
    }

    // 分組定義
    const sections: { title: string; fields: Field[] }[] = [
        {
            title: "基本資訊",
            fields: [
                { name: 'category', label: '場次名稱', type: 'text' },
                { name: 'totalOrders', label: '總訂單數', type: 'number' },
                { name: 'totalProducts', label: '商品總數', type: 'number' },
            ]
        },
        {
            title: "問題統計",
            fields: [
                { name: 'problemItems', label: '問題品項數', type: 'number' },
                { name: 'problemQuantity', label: '問題商品數量', type: 'number' },
            ]
        },
        {
            title: "處理情形",
            fields: [
                { name: 'departmentHandled', label: '部門處理數量', type: 'number' },
                { name: 'nonDepartmentHandled', label: '非部門處理數量', type: 'number' },
            ]
        },
        {
            title: "成本分析",
            fields: [
                { name: 'refundAmount', label: '退款金額', type: 'number' },
                { name: 'smsNotificationCost', label: '簡訊費用', type: 'number' },
                { name: 'compensationAmount', label: '補償金額', type: 'number' },
                { name: 'extraShippingCost', label: '額外運費', type: 'number' },
            ]
        },
        {
            title: "人力資源",
            fields: [
                { name: 'humanResourceHours', label: '人力工時', type: 'text', placeholder: 'DD:HH:MM' },
                { name: 'staffUsed', label: '使用人力', type: 'number' },
            ]
        },
        {
            title: "其他",
            fields: [
                { name: 'cause', label: '問題原因', type: 'text', className: 'md:col-span-2' },
            ]
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg">
            <div className="space-y-6">
                {/* 錯誤訊息 */}
                {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-md">
                        {error}
                    </div>
                )}

                {/* 分區顯示欄位 */}
                {sections.map((section) => (
                    <div key={section.title} className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 border-b pb-1 dark:border-gray-600">
                            {section.title}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {section.fields.map((field) => (
                                <div key={field.name} className={`space-y-1 ${field.className || ''}`}>
                                    <label
                                        htmlFor={field.name}
                                        className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                                    >
                                        {field.label}
                                    </label>
                                    <input
                                        id={field.name}
                                        type={field.type}
                                        name={field.name}
                                        value={field.name === 'humanResourceHours' ? humanResourceHoursInput : entry[field.name as keyof Entry] || ''}
                                        onChange={onInputChange}
                                        placeholder={field.placeholder || ''}
                                        className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* 提交按鈕 */}
                <div className="flex justify-end pt-4 border-t dark:border-gray-600">
                    <Button
                        onClick={onSubmit}
                        className="bg-green-600 hover:bg-green-700 text-white min-w-[120px]"
                    >
                        確認新增
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default OrderEntryForm;