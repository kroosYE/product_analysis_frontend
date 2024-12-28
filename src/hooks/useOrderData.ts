import { Entry } from '@/types/order';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'orderAnalysisData'

// 預設值
const DEFAULT_ENTRY: Entry = {
    category: "",
    session: 0,
    totalOrders: 0,
    totalProducts: 0,
    problemItems: 0,
    problemQuantity: 0,
    departmentHandled: 0,
    nonDepartmentHandled: 0,
    problemRatio: 0,
    refundAmount: 0,
    smsNotificationCost: 0,
    compensationAmount: 0,
    extraShippingCost: 0,
    humanResourceHours: 0,
    staffUsed: 0,
    cause: "",
};

export const useOrderData = () => {
    // 狀態管理
    const [data, setData] = useState<Entry[]>(() => {
        try {
            const savedData = localStorage.getItem(STORAGE_KEY);
            return savedData ? JSON.parse(savedData) : [];
        } catch (error) {
            console.error('Error loading data from localStorage:', error);
            return [];
        }
    });
    const [newEntry, setNewEntry] = useState<Entry>(DEFAULT_ENTRY);
    const [error, setError] = useState<string | null>(null);

    // 當資料變更時，同步到 localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
            setError('儲存資料時發生錯誤');
        }
    }, [data]);

    // 處理輸入變化
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

        try {
            setError(null);
            setNewEntry(prev => ({
                ...prev,
                [name]: type === 'number' ?
                    // 處理數字類型輸入
                    value === '' ? 0 : Number(value) :
                    // 處理文字類型輸入
                    value
            }));
        } catch (err) {
            setError(`輸入處理錯誤: ${(err as Error).message}`);
        }
    }, []);

    // 處理資料新增
    const handleAddEntry = useCallback(() => {
        try {
            // 驗證必填欄位
            if (!newEntry.category.trim()) {
                throw new Error('場次名稱為必填');
            }

            // 驗證數值合理性
            if (newEntry.problemQuantity > newEntry.totalProducts) {
                throw new Error('問題商品數量不能大於商品總數');
            }

            // 計算問題比例
            const problemRatio = newEntry.totalProducts > 0
                ? (newEntry.problemQuantity / newEntry.totalProducts) * 100
                : 0;

            // 新增資料
            const entryWithRatio = {
                ...newEntry,
                problemRatio
            };

            setData(prev => [...prev, entryWithRatio]);

            // 重置表單
            setNewEntry(DEFAULT_ENTRY);
            setError(null);

        } catch (err) {
            setError((err as Error).message);
        }
    }, [newEntry]);

    // 處理資料刪除
    const handleDeleteEntry = useCallback((index: number) => {
        setData(prev => prev.filter((_, i) => i !== index));
    }, []);

    // 處理資料更新
    const handleUpdateEntry = useCallback((index: number, updatedEntry: Entry) => {
        setData(prev => prev.map((entry, i) =>
            i === index ? updatedEntry : entry
        ));
    }, []);

    // 處理資料清空
    const handleClearAll = useCallback(() => {
        try {
            localStorage.removeItem(STORAGE_KEY);
            setData([]);
            setNewEntry(DEFAULT_ENTRY);
            setError(null);
        } catch (error) {
            console.error('Error clearing data:', error);
            setError('清除資料時發生錯誤');
        }
    }, []);

    // 計算摘要數據
    const summary = {
        totalSessions: data.length,
        totalOrders: data.reduce((sum, entry) => sum + entry.totalOrders, 0),
        totalProducts: data.reduce((sum, entry) => sum + entry.totalProducts, 0),
        totalProblemItems: data.reduce((sum, entry) => sum + entry.problemItems, 0),
        averageProblemRatio: data.length
            ? data.reduce((sum, entry) => sum + entry.problemRatio, 0) / data.length
            : 0
    };

    return {
        // 狀態
        data,
        newEntry,
        error,
        summary,

        // 處理函數
        handleInputChange,
        handleAddEntry,
        handleDeleteEntry,
        handleUpdateEntry,
        handleClearAll
    };
};

export default useOrderData;