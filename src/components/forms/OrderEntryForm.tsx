import { Button } from "@/components/ui/button";
import { Entry } from '@/types/order';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import * as React from 'react'

// 定義元件的 props 介面
interface OrderEntryFormProps {
    // entry: 當前的表單數據
    entry: Entry;
    // onInputChange: 處理輸入變化的函數
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    // onSubmit: 處理表單提交的函數
    onSubmit: () => void;
    error?: string | null;
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
    { name: 'humanResourceHours', label: '人力工時', type: 'number' },
    { name: 'staffUsed', label: '使用人力', type: 'number' },
    { name: 'cause', label: '問題原因', type: 'text' },
];

export const OrderEntryForm: React.FC<OrderEntryFormProps> = ({
    entry,
    onInputChange,
    onSubmit,
    error
}) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const handleSubmit = () => {
        onSubmit();
        setIsExpanded(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            {/* 展開/收合按鈕 */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
            >
                <div className="flex items-center space-x-2">
                    <Plus className="h-5 w-5 text-gray-500" />
                    <span className="font-medium text-gray-700">新增資料</span>
                </div>
                {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
            </button>

            {/* 表單內容 */}
            {isExpanded && (
                <div className="p-4 space-y-4">
                    {/* 錯誤訊息 */}
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-md">
                            {error}
                        </div>
                    )}

                    {/* 表單欄位 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formFields.map((field) => (
                            <div key={field.name} className="space-y-1">
                                <label
                                    htmlFor={field.name}
                                    className="text-sm font-medium text-gray-700"
                                >
                                    {field.label}
                                </label>
                                <input
                                    id={field.name}
                                    type={field.type}
                                    name={field.name}
                                    value={entry[field.name as keyof Entry] || ''}
                                    onChange={onInputChange}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                                />
                            </div>
                        ))}
                    </div>

                    {/* 提交按鈕 */}
                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSubmit}
                            className="bg-green-500 hover:bg-green-600 text-white"
                        >
                            新增資料
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderEntryForm;