import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Entry } from "@/types/order";
import html2canvas from 'html2canvas';
import { useEffect, useRef, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts';
import { formatTotalHoursToDDHHMM } from "@/utils/formatters";


const DetailedOrderAnalysis = () => {
    const chartRef = useRef(null);

    const handleExport = async () => {
        if (chartRef.current) {
            try {
                const canvas = await html2canvas(chartRef.current);
                const url = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = '訂單分析圖表.png';
                link.href = url;
                link.click();
            } catch (error) {
                console.error('Export failed:', error);
            }
        }
    };
    const [data, setData] = useState<Entry[]>([]);

    const [newEntry, setNewEntry] = useState<Entry>({
        category: "",
        session: 0, // 預設為 0
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
    })

    // 用於 humanResourceHours 輸入框顯示的字串狀態
    const [humanResourceHoursInput, setHumanResourceHoursInput] = useState<string>('00:00:00');

    // 將數字工時轉換成 DD:HH:MM 字串以顯示在輸入框
    useEffect(() => {
        if (newEntry.humanResourceHours !== undefined && newEntry.humanResourceHours >= 0) {
            const totalMinutes = Math.round(newEntry.humanResourceHours * 60);
            const days = Math.floor(totalMinutes / (24 * 60));
            const remainingMinutesAfterDays = totalMinutes % (24 * 60);
            const hours = Math.floor(remainingMinutesAfterDays / 60);
            const minutes = remainingMinutesAfterDays % 60;

            setHumanResourceHoursInput(
                `<span class="math-inline">\{String\(days\)\.padStart\(2, '0'\)\}\:</span>{String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
            );
        } else {
            setHumanResourceHoursInput('00:00:00'); // 確保輸入框在清空或無效時顯示預設
        }
    }, [newEntry.humanResourceHours]);

    // input update process
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "humanResourceHours") {
            // 更新輸入框的顯示字串狀態
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
                // 如果格式不符預期，可以設為 0 或處理錯誤
                // 這裡我們直接設為 0
                days = 0;
                hours = 0;
                minutes = 0;
            }

            // 將解析後的天、時、分轉換為總小時數
            const totalHours = days * 24 + hours + minutes / 60;

            // 更新 newEntry 中的 humanResourceHours (數字型態)
            setNewEntry(prevEntry => ({
                ...prevEntry,
                humanResourceHours: totalHours,
            }));

        } else {
            setNewEntry({
                ...newEntry,
                [name]: name === "session" ? Number(value) : value,
            })
        }
    }

    // 計算問題比例的函數
    const calculateProblemRatio = (data: Entry[]) => {
        return data.map(item => ({
            ...item,
            problemRatio: (item.problemQuantity / item.totalProducts) * 100 || 0, // 避免除以 0 的情況
        }));
    };

    const processedData = calculateProblemRatio([...data, newEntry]);

    // 新增資料項目
    const handleAddEntry = () => {
        setData(prevData => [...prevData, newEntry]);
        setNewEntry({
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
        }); // 清空表單
        setHumanResourceHoursInput('00:00:00');
    };

    // 定義 CustomTooltip 的 props 型別
    type CustomTooltipProps = {
        active?: boolean;
        payload?: any[];
        label?: string;
    } & TooltipProps<any, any>;

    // 自定義 Tooltip
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

    return (
        <Card className="w-full p-4" ref={chartRef}>
            <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold">訂單問題詳細分析</CardTitle>
                <Button
                    onClick={handleExport}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                    匯出圖表
                </Button>
            </CardHeader>

            <CardContent>
                <div className="space-y-8">
                    {/* 新增資料的輸入表單 */}
                    <div className="p-4 bg-gray-100 rounded space-y-4">
                        <h3 className="text-lg font-bold">新增資料</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="category"
                                value={newEntry.category}
                                onChange={handleInputChange}
                                placeholder="場次名稱"
                                className="p-2 border rounded"
                            />
                            <input
                                type="number"
                                name="totalOrders"
                                value={newEntry.totalOrders || ""}
                                onChange={handleInputChange}
                                placeholder="請輸入總訂單數"
                                className="p-2 border rounded"
                            />
                            <input
                                type="number"
                                name="totalProducts"
                                value={newEntry.totalProducts || ""}
                                onChange={handleInputChange}
                                placeholder="商品總數"
                                className="p-2 border rounded"
                            />
                            <input
                                type="number"
                                name="problemItems"
                                value={newEntry.problemItems || ""}
                                onChange={handleInputChange}
                                placeholder="問題品項數"
                                className="p-2 border rounded"
                            />
                            <input
                                type="number"
                                name="problemQuantity"
                                value={newEntry.problemQuantity || ""}
                                onChange={handleInputChange}
                                placeholder="問題商品數量"
                                className="p-2 border rounded"
                            />
                            <input
                                type="number"
                                name="departmentHandled"
                                value={newEntry.departmentHandled || ""}
                                onChange={handleInputChange}
                                placeholder="部門處理數量"
                                className="p-2 border rounded"
                            />
                            <input
                                type="number"
                                name="nonDepartmentHandled"
                                value={newEntry.nonDepartmentHandled || ""}
                                onChange={handleInputChange}
                                placeholder="非部門處理數量"
                                className="p-2 border rounded"
                            />
                            <input
                                type="number"
                                name="refundAmount"
                                value={newEntry.refundAmount || ""}
                                onChange={handleInputChange}
                                placeholder="退款金額"
                                className="p-2 border rounded"
                            />
                            <input
                                type="number"
                                name="smsNotificationCost"
                                value={newEntry.smsNotificationCost || ""}
                                onChange={handleInputChange}
                                placeholder="簡訊費用"
                                className="p-2 border rounded"
                            />
                            <input
                                type="number"
                                name="compensationAmount"
                                value={newEntry.compensationAmount || ""}
                                onChange={handleInputChange}
                                placeholder="補償金額"
                                className="p-2 border rounded"
                            />
                            <input
                                type="number"
                                name="extraShippingCost"
                                value={newEntry.extraShippingCost || ""}
                                onChange={handleInputChange}
                                placeholder="額外運費"
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="humanResourceHours"
                                value={humanResourceHoursInput}
                                onChange={handleInputChange}
                                placeholder="人力工時 (DD:HH:MM)"
                                className="p-2 border rounded"
                            />
                            <input
                                type="number"
                                name="staffUsed"
                                value={newEntry.staffUsed || ""}
                                onChange={handleInputChange}
                                placeholder="使用人力"
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="cause"
                                value={newEntry.cause}
                                onChange={handleInputChange || ""}
                                placeholder="問題原因"
                                className="p-2 border rounded"
                            />

                        </div>
                        <Button onClick={handleAddEntry} className="bg-green-500 hover:bg-green-600 text-white">
                            新增資料
                        </Button>
                    </div>

                    {/* 總體指標摘要 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-blue-100 rounded">
                            <h4 className="font-semibold text-blue-800">總場次</h4>
                            <p className="text-2xl font-bold text-blue-900">
                                {[...data, newEntry].filter(item => item.category).length} 場
                            </p>
                        </div>
                        <div className="p-4 bg-green-100 rounded">
                            <h4 className="font-semibold text-green-800">總訂單數</h4>
                            <p className="text-2xl font-bold text-green-900">
                                {[...data, newEntry].reduce((sum, item) => sum + Number(item.totalOrders || 0), 0).toLocaleString()} 筆
                            </p>
                        </div>
                        <div className="p-4 bg-purple-100 rounded">
                            <h4 className="font-semibold text-purple-800">商品總數</h4>
                            <p className="text-2xl font-bold text-purple-900">
                                {[...data, newEntry].reduce((sum, item) => sum + Number(item.totalProducts || 0), 0).toLocaleString()} 件
                            </p>
                        </div>
                        <div className="p-4 bg-red-100 rounded">
                            <h4 className="font-semibold text-red-800">問題商品比例</h4>
                            <p className="text-2xl font-bold text-red-900">
                                {(() => {
                                    const totalProblemQuantity = [...data, newEntry].reduce((sum, item) => sum + Number(item.problemQuantity || 0), 0);
                                    const totalProducts = [...data, newEntry].reduce((sum, item) => sum + Number(item.totalProducts || 0), 0);

                                    // 確保分母不為零，避免 NaN 或 Infinity
                                    if (totalProducts === 0) {
                                        return "0.00%";
                                    }

                                    const problemRatio = (totalProblemQuantity / totalProducts) * 100;
                                    return `${problemRatio.toFixed(2)}%`;
                                })()}
                            </p>
                        </div>
                    </div>

                    {/* 商品問題分析 */}
                    <div className="h-80">
                        <h3 className="text-lg font-semibold mb-2">商品問題分析</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" />
                                <YAxis yAxisId="left" orientation="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar yAxisId="left" dataKey="problemItems" fill="#ff7300" name="問題品項數" />
                                <Bar yAxisId="left" dataKey="problemQuantity" fill="#ff0000" name="問題商品數量" />
                                <Bar yAxisId="left" dataKey="departmentHandled" fill="#82ca9d" name="部門處理數量" />
                                <Bar yAxisId="left" dataKey="nonDepartmentHandled" fill="#ffc658" name="非部門處理數量" />
                                <Bar yAxisId="right" dataKey="problemRatio" fill="#8884d8" name="問題比例" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* 成本分析 */}
                    <div className="h-80">
                        <h3 className="text-lg font-semibold mb-2">成本分析</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[...data, newEntry]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="refundAmount" fill="#8884d8" name="退款金額" />
                                <Bar dataKey="smsNotificationCost" fill="#82ca9d" name="簡訊費用" />
                                <Bar dataKey="compensationAmount" fill="#ffc658" name="補償金額" />
                                <Bar dataKey="extraShippingCost" fill="#ff7300" name="額外運費" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* 人力分析卡片 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[...data, newEntry].map((item, index) => (
                            <div key={index} className="p-4 bg-gray-50 rounded shadow">
                                <h4 className="font-bold text-lg mb-2">{item.category}</h4>
                                <div className="space-y-2">
                                    <p><span className="font-semibold">總處理時間：</span>{formatTotalHoursToDDHHMM(item.humanResourceHours)} 小時</p>
                                    <p><span className="font-semibold">部門處理數量：</span>{item.departmentHandled} 件</p>
                                    <p><span className="font-semibold">非部門處理數量：</span>{item.nonDepartmentHandled} 件</p>
                                    <p><span className="font-semibold">耗費人力：</span>{item.staffUsed} 人</p>
                                    <p><span className="font-semibold">主要原因：</span>{item.cause}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
export default DetailedOrderAnalysis;