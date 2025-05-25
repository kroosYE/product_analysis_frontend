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

    // 用於 humanResourceHours 輸入框顯示的字串狀態
    const [humanResourceHoursInput, setHumanResourceHoursInput] = useState<string>('00:00:00');

    // 當資料變更時，同步到 localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
            setError('儲存資料時發生錯誤');
        }
    }, [data]);

    // useEffect 用於將 newEntry.humanResourceHours (數字) 轉換為 DD:HH:MM 字串
    useEffect(() => {
        if (newEntry.humanResourceHours !== undefined && newEntry.humanResourceHours >= 0) {
            const totalMinutes = Math.round(newEntry.humanResourceHours * 60);
            const days = Math.floor(totalMinutes / (24 * 60));
            const remainingMinutesAfterDays = totalMinutes % (24 * 60);
            const hours = Math.floor(remainingMinutesAfterDays / 60);
            const minutes = remainingMinutesAfterDays % 60;

            setHumanResourceHoursInput(
                `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
            );
        } else {
            setHumanResourceHoursInput('00:00:00'); // 確保輸入框在清空或無效時顯示預設
        }
    }, [newEntry.humanResourceHours]); // 依賴 newEntry.humanResourceHours 的變化   

    // 處理輸入變化
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

        try {
            setError(null);

            if (name === "humanResourceHours") {
                // 更新 humanResourceHoursInput 狀態，以便輸入框實時顯示用戶輸入
                setHumanResourceHoursInput(value);

                // 解析 DD:HH:MM 格式的字串
                const parts = value.split(':');
                let days = 0;
                let hours = 0;
                let minutes = 0;

                if (parts.length === 3) {
                    const parsedDays = parseInt(parts[0], 10);
                    const parsedHours = parseInt(parts[1], 10);
                    const parsedMinutes = parseInt(parts[2], 10);

                    // 基礎驗證並賦值，確保為有效數字且在範圍內
                    days = !isNaN(parsedDays) && parsedDays >= 0 ? parsedDays : 0;
                    hours = !isNaN(parsedHours) && parsedHours >= 0 && parsedHours <= 23 ? parsedHours : 0;
                    minutes = !isNaN(parsedMinutes) && parsedMinutes >= 0 && parsedMinutes <= 59 ? parsedMinutes : 0;

                } else {
                    // 如果格式不符預期，或只有 HH:MM，可自行決定如何處理
                    // 這裡我們預設為 0
                    days = 0;
                    hours = 0;
                    minutes = 0;
                }

                // 將解析後的天、時、分轉換為總小時數
                const totalHours = days * 24 + hours + minutes / 60;

                // 更新 newEntry 中的 humanResourceHours (數字型態)
                setNewEntry(prev => ({
                    ...prev,
                    humanResourceHours: totalHours,
                }));
            } else {
                setNewEntry(prev => ({
                    ...prev,
                    [name]: type === 'number' ?
                        // 處理數字類型輸入
                        value === '' ? 0 : Number(value) :
                        // 處理文字類型輸入
                        value
                }));
            }
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
            setHumanResourceHoursInput('00:00:00');
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
        humanResourceHoursInput,

        // 處理函數
        handleInputChange,
        handleAddEntry,
        handleDeleteEntry,
        handleUpdateEntry,
        handleClearAll
    };
};

export default useOrderData;