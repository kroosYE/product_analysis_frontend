import React, { useRef } from 'react';
// 引入元件
import { StaffAnalysisCardList } from '@/components/cards/StaffAnalysisCard';
import { OrderAnalysisChart } from '@/components/charts/OrderAnalysisChart';
import { OrderEntryForm } from '@/components/forms/OrderEntryForm';
import { OrderStatsSummary } from '@/components/summary/OrderStatsSummary';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// 引入自定義 Hooks
import { useChartExport } from '@/hooks/useChartExport';
import { useOrderData } from '@/hooks/useOrderData';

// 引入常數和型別

const DetailedOrderAnalysis: React.FC = () => {
  // 使用 useOrderData hook 管理訂單資料和相關操作
  const {
    data,                  // 已儲存的訂單資料陣列
    newEntry,              // 當前正在輸入的訂單資料
    error,                 // 錯誤訊息
    summary,               // 訂單統計摘要
    handleInputChange,     // 處理輸入欄位變更
    handleAddEntry,        // 處理新增訂單
    handleDeleteEntry,     // 處理刪除訂單
    handleUpdateEntry,     // 處理更新訂單
    handleClearAll,        // 處理清空所有資料
    humanResourceHoursInput
  } = useOrderData();

  // 建立圖表容器的參考，用於匯出圖表
  const chartRef = useRef<HTMLDivElement>(null);

  // 使用 useChartExport hook 處理圖表匯出功能
  const {
    handleExport,         // 處理匯出操作
    isExporting,         // 匯出狀態
    exportError         // 匯出錯誤訊息
  } = useChartExport(chartRef);

  // 處理匯出按鈕點擊
  const handleExportClick = async () => {
    try {
      await handleExport({
        fileName: '訂單分析報表',
        scale: 2,  // 2倍解析度
        backgroundColor: '#ffffff'
      });
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <Card className="w-full p-4 md:p-6" ref={chartRef}>
      {/* 頁面標題和操作按鈕 */}
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-xl font-bold md:text-2xl">訂單問題詳細分析</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            架構優化版：資料輸入、摘要指標與圖表分析分區呈現
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleClearAll}
            variant="outline"
            className="hover:bg-red-50"
          >
            清空資料
          </Button>
          <Button
            onClick={handleExportClick}
            disabled={isExporting}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isExporting ? '匯出中...' : '匯出圖表'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 錯誤訊息顯示 */}
        {(error || exportError) && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-600">
            {error || exportError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          <section className="xl:col-span-3">
            <h2 className="mb-3 text-base font-semibold text-gray-700 dark:text-gray-200">資料輸入</h2>
            <OrderEntryForm
              entry={newEntry}
              onInputChange={handleInputChange}
              onSubmit={handleAddEntry}
              error={error}
              humanResourceHoursInput={humanResourceHoursInput}
            />
          </section>

          <section className="xl:col-span-2">
            <h2 className="mb-3 text-base font-semibold text-gray-700 dark:text-gray-200">核心指標</h2>
            <OrderStatsSummary summary={summary} />
          </section>
        </div>

        <section className="space-y-6">
          <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200">分析視圖</h2>

          <OrderAnalysisChart
            data={data}
            title="商品問題分析"
            type="problem"
          />

          <OrderAnalysisChart
            data={data}
            title="成本分析"
            type="cost"
          />

          <StaffAnalysisCardList
            entries={data}
            onDelete={handleDeleteEntry}
            onUpdate={handleUpdateEntry}
          />
        </section>
      </CardContent>
    </Card>
  );
};

export default DetailedOrderAnalysis;
