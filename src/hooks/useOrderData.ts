import { Entry } from '@/types/order';
import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_ORDER_ENTRY } from '@/entities/order-entry/model';
import { buildOrderSummary, withProblemRatio } from '@/entities/order-entry/selectors';
import { formatTotalHoursToDDHHMM, parseDDHHMMToTotalHours } from '@/utils/formatters';

const STORAGE_KEY = 'orderAnalysisData'

export const useOrderData = () => {
    // 狀態管理
    const [data, setData] = useState<Entry[]>(() => {
        try {
            const savedData = localStorage.getItem(STORAGE_KEY);
            const parsed = savedData ? (JSON.parse(savedData) as Entry[]) : [];
            return withProblemRatio(parsed);
        } catch (error) {
            console.error('Error loading data from localStorage:', error);
            return [];
        }
    });
    const [newEntry, setNewEntry] = useState<Entry>(DEFAULT_ORDER_ENTRY);
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
        setHumanResourceHoursInput(formatTotalHoursToDDHHMM(newEntry.humanResourceHours));
    }, [newEntry.humanResourceHours]); // 依賴 newEntry.humanResourceHours 的變化   

    // 處理輸入變化
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

        try {
            setError(null);

            if (name === "humanResourceHours") {
                // 更新 humanResourceHoursInput 狀態，以便輸入框實時顯示用戶輸入
                setHumanResourceHoursInput(value);

                const totalHours = parseDDHHMMToTotalHours(value);

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
            setNewEntry(DEFAULT_ORDER_ENTRY);
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
        const entryWithRatio = {
            ...updatedEntry,
            problemRatio:
                updatedEntry.totalProducts > 0
                    ? (updatedEntry.problemQuantity / updatedEntry.totalProducts) * 100
                    : 0,
        };

        setData(prev => prev.map((entry, i) =>
            i === index ? entryWithRatio : entry
        ));
    }, []);

    // 處理資料清空
    const handleClearAll = useCallback(() => {
        try {
            localStorage.removeItem(STORAGE_KEY);
            setData([]);
            setNewEntry(DEFAULT_ORDER_ENTRY);
            setError(null);
        } catch (error) {
            console.error('Error clearing data:', error);
            setError('清除資料時發生錯誤');
        }
    }, []);

    const summary = buildOrderSummary(data);

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
