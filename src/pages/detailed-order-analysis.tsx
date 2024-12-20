import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import html2canvas from 'html2canvas';
import { useRef, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts';

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
  const [data, setData] = useState([
    {
      category: '11月第一場',
      session: 1,
      totalOrders: 1200,
      totalProducts: 3600,
      problemItems: 45,
      problemQuantity: 150,
      departmentHandled: 120,
      nonDepartmentHandled: 30,
      problemRatio: 4.17,
      refundAmount: 45000,
      smsNotificationCost: 1200,
      compensationAmount: 3000,
      extraShippingCost: 2000,
      humanResourceHours: 48,
      staffUsed: 3,
      cause: "海關延遲"
    },
    {
      category: '11月第二場',
      session: 2,
      totalOrders: 1500,
      totalProducts: 4500,
      problemItems: 60,
      problemQuantity: 200,
      departmentHandled: 150,
      nonDepartmentHandled: 50,
      problemRatio: 4.44,
      refundAmount: 60000,
      smsNotificationCost: 1500,
      compensationAmount: 4000,
      extraShippingCost: 2500,
      humanResourceHours: 60,
      staffUsed: 4,
      cause: "缺貨"
    },
    {
      category: '12月第一場',
      session: 3,
      totalOrders: 2000,
      totalProducts: 6000,
      problemItems: 75,
      problemQuantity: 250,
      departmentHandled: 180,
      nonDepartmentHandled: 70,
      problemRatio: 4.17,
      refundAmount: 75000,
      smsNotificationCost: 2000,
      compensationAmount: 5000,
      extraShippingCost: 3000,
      humanResourceHours: 72,
      staffUsed: 5,
      cause: "品質問題"
    }
  ]);

  const [newEntry, setNewEntry] = useState({
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

  // input update process
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEntry({
      ...newEntry,
      [name]: name === "session" ? Number(value) : value,
    })
  }

  // 新增資料項目
  const handleAddEntry = () => {
    setData((prevData) => [...prevData, newEntry]);
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
                entry.name.includes('金額') || entry.name.includes('費用') ? '元' :
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
          {/* 總體指標摘要 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-100 rounded">
              <h4 className="font-semibold text-blue-800">總場次</h4>
              <p className="text-2xl font-bold text-blue-900">
                {data.length} 場
              </p>
            </div>
            <div className="p-4 bg-green-100 rounded">
              <h4 className="font-semibold text-green-800">總訂單數</h4>
              <p className="text-2xl font-bold text-green-900">
                {data.reduce((sum, item) => sum + item.totalOrders, 0).toLocaleString()} 筆
              </p>
            </div>
            <div className="p-4 bg-purple-100 rounded">
              <h4 className="font-semibold text-purple-800">商品總數</h4>
              <p className="text-2xl font-bold text-purple-900">
                {data.reduce((sum, item) => sum + item.totalProducts, 0).toLocaleString()} 件
              </p>
            </div>
            <div className="p-4 bg-red-100 rounded">
              <h4 className="font-semibold text-red-800">問題商品比例</h4>
              <p className="text-2xl font-bold text-red-900">
                {(data.reduce((sum, item) => sum + item.problemQuantity, 0) /
                  data.reduce((sum, item) => sum + item.totalProducts, 0) * 100).toFixed(2)}%
              </p>
            </div>
          </div>

          {/* 商品問題分析 */}
          <div className="h-80">
            <h3 className="text-lg font-semibold mb-2">商品問題分析</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
            {data.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded shadow">
                <h4 className="font-bold text-lg mb-2">{item.category}</h4>
                <div className="space-y-2">
                  <p><span className="font-semibold">總處理時間：</span>{item.humanResourceHours} 小時</p>
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