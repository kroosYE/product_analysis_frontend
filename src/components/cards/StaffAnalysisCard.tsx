import { Button } from '@/components/ui/button';
import { Entry } from '@/types/order';
import { formatTotalHoursToChinese } from '@/utils/formatters';
import { Pencil, Save, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';

// 定義資訊項目的類型
interface InfoItem {
    label: string;
    value: number | string;
    unit: string;
}

// 定義元件的 props
interface StaffAnalysisCardProps {
    entry: Entry;
    onDelete: (index: number) => void;
    onUpdate: (index: number, updatedEntry: Entry) => void;
    index: number; // 為了 onDelete 和 onUpdate 傳遞索引
}

// 建立資訊項目元件
const InfoItem: React.FC<InfoItem> = ({ label, value, unit }) => (
    <p>
        <span className="font-semibold">{label}：</span>
        {value} {unit}
    </p>
);

export const StaffAnalysisCard: React.FC<StaffAnalysisCardProps> = ({ entry, onDelete, onUpdate, index }) => {
    const [isEditing, setIsEditing] = useState(false);
    // 保存正在編輯的 data 副本
    const [editedEntry, setEditedEntry] = useState<Entry>(entry);

    // 當 prop.entry 改變時（例如資料更新），同步到 editedEntry
    React.useEffect(() => {
        setEditedEntry(entry);
    }, [entry]);

    // 處理輸入框變化 (簡化起見，暫時只處理文字和數字，更複雜的 humanResourceHours 留給下一步)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setEditedEntry(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleSave = () => {
        // 在這裡可以添加更多驗證邏輯 before saving
        onUpdate(index, editedEntry); // 將更新後的數據傳回父組件
        setIsEditing(false); // 退出編輯模式
    };

    const handleCancel = () => {
        setEditedEntry(entry); // 取消時，恢復到原始數據
        setIsEditing(false); // 退出編輯模式
    };

    // 處理刪除時彈出確認提示
    const handleDeleteClick = () => {
        const isConfirmed = window.confirm(`確定要刪除「${entry.category || '未命名場次'}」這筆資料嗎？`);

        if (isConfirmed) {
            onDelete(index);
        }
    }

    // 定義表單欄位
    const formFields = [
        { name: 'category', label: '類別', type: 'text' },
        { name: 'session', label: '場次', type: 'number' },
        { name: 'totalOrders', label: '總訂單數', type: 'number' },
        { name: 'totalProducts', label: '總商品數', type: 'number' },
        { name: 'problemItems', label: '問題單品數', type: 'number' },
        { name: 'problemQuantity', label: '問題品項總數', type: 'number' },
        { name: 'departmentHandled', label: '部門處理數量', type: 'number' },
        { name: 'nonDepartmentHandled', label: '非部門處理數量', type: 'number' },
        { name: 'refundAmount', label: '退款金額', type: 'number' },
        { name: 'smsNotificationCost', label: '簡訊通知成本', type: 'number' },
        { name: 'compensationAmount', label: '賠償金額', type: 'number' },
        { name: 'extraShippingCost', label: '額外運費', type: 'number' },
        { name: 'staffUsed', label: '耗費人力', type: 'number' },
        { name: 'cause', label: '主要原因', type: 'text' }
    ];

    // 定義要顯示的資訊項目
    const infoItems: InfoItem[] = [
        {
            label: '總處理時間',
            value: formatTotalHoursToChinese(entry.humanResourceHours),
            unit: ''
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
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded shadow hover:shadow-md transition-shadow">
            {/* 卡片標題和操作按鈕 */}
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-lg text-blue-800 dark:text-blue-300">
                    {entry.category || '未命名場次'}
                </h4>
                <div className="flex space-x-2">
                    {isEditing ? (
                        <>
                            <Button size="sm" variant="outline" onClick={handleSave} className="bg-green-500 text-white hover:bg-green-600">
                                <Save className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleCancel} className="bg-red-500 text-white hover:bg-red-600">
                                <X className="h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button size="sm" variant="destructive" onClick={() => setIsEditing(true)} title='編輯資料'>
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={handleDeleteClick} title='刪除資料'>
                                <Trash2 className='h-4 w-4' />
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {isEditing ? (
                // 編輯模式：這裡將會是您的編輯表單
                <div className="space-y-2">
                    {/* 這裡暫時使用簡單的輸入框，下一步會建立專門的編輯表單組件 */}
                    {Object.keys(editedEntry).map((key) => {
                        // 過濾掉 humanResourceHours 和 problemRatio，因為他們有特殊處理
                        if (key === 'humanResourceHours' || key === 'problemRatio') return null;

                        const field = formFields.find(f => f.name === key);
                        if (!field) return null; // 如果沒有在 formFields 找到對應的定義則跳過

                        return (
                            <div key={key}>
                                <label htmlFor={`${field.name}-${index}`} className="text-sm font-medium dark:text-gray-300">{field.label}:</label>
                                <input
                                    id={`${field.name}-${index}`}
                                    type={field.type}
                                    name={field.name}
                                    value={editedEntry[key as keyof Entry] as string | number}
                                    onChange={handleInputChange}
                                    className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                        );
                    })}
                    {/* humanResourceHours 的特殊處理，先用一個簡單的文本框，下一步會詳細處理 */}
                    <div key="humanResourceHours">
                        <label htmlFor={`humanResourceHours-${index}`} className="text-sm font-medium dark:text-gray-300">總處理時間:</label>
                        <input
                            id={`humanResourceHours-${index}`}
                            type="text"
                            name="humanResourceHours"
                            value={formatTotalHoursToChinese(editedEntry.humanResourceHours)} // 暫時顯示為中文
                            onChange={handleInputChange} // 這裡還需要更複雜的解析
                            placeholder="DD:HH:MM"
                            className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                </div>
            ) : (
                // 顯示模式：顯示靜態資訊
                <div className="space-y-2 dark:text-gray-300">
                    {infoItems.map((item) => (
                        <InfoItem
                            key={item.label}
                            label={item.label}
                            value={item.value}
                            unit={item.unit}
                        />
                    ))}
                </div>
            )}
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
    const validEntries = entries
        .map((entry, originalIndex) => ({ entry, originalIndex }))
        .filter(({ entry }) => entry.category.trim() !== '');

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {validEntries.map(({ entry, originalIndex }) => (
                <StaffAnalysisCard
                    key={`${entry.category || 'entry'}-${originalIndex}`}
                    entry={entry}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                    index={originalIndex}
                />
            ))}
        </div>
    );
};
export default StaffAnalysisCard;
