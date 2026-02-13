import React, { useRef, useState } from 'react';
// 引入元件
import { StaffAnalysisCardList } from '@/components/cards/StaffAnalysisCard';
import { OrderAnalysisChart } from '@/components/charts/OrderAnalysisChart';
import { OrderEntryForm } from '@/components/forms/OrderEntryForm';
import { OrderStatsSummary } from '@/components/summary/OrderStatsSummary';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react"; // Import Plus icon

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
    humanResourceHoursInput,
    exportCsv,
    importCsv,
  } = useOrderData();

  const [csvImportMode, setCsvImportMode] = useState<'append' | 'replace'>('append');
  const [csvResultMessage, setCsvResultMessage] = useState<string | null>(null);
  const [csvImportErrors, setCsvImportErrors] = useState<{ row: number; message: string }[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false); // Controls Dialog visibility
  const csvFileInputRef = useRef<HTMLInputElement>(null);

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

  const handleExportCsvClick = () => {
    const csvText = exportCsv();
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];

    link.href = URL.createObjectURL(blob);
    link.download = `order-analysis-${date}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleImportCsvButtonClick = () => {
    csvFileInputRef.current?.click();
  };

  const handleImportCsvFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const result = importCsv(text, csvImportMode);
      const message = `CSV 匯入完成：成功 ${result.importedCount} 筆，失敗 ${result.errors.length} 筆`;

      setCsvResultMessage(message);
      setCsvImportErrors(result.errors);
    } catch (importError) {
      setCsvResultMessage('CSV 匯入失敗，請確認檔案格式是否正確');
      setCsvImportErrors([]);
      console.error(importError);
    } finally {
      event.target.value = '';
    }
  };

  const handleFormSubmit = () => {
    handleAddEntry();
    setIsFormOpen(false); // Close dialog on submit
  };

  return (
    <Card className="w-full p-4 md:p-6" ref={chartRef}>
      {/* 頁面標題和操作按鈕 */}
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-4 mb-6">
        <div>
          <CardTitle className="text-xl font-bold md:text-2xl">訂單問題詳細分析</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            架構優化版：資料輸入、摘要指標與圖表分析分區呈現
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Add Data Dialog */}
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                新增資料
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>新增訂單資料</DialogTitle>
                <DialogDescription>
                  請填寫以下欄位以新增一筆新的訂單分析資料。
                </DialogDescription>
              </DialogHeader>
              <OrderEntryForm
                entry={newEntry}
                onInputChange={handleInputChange}
                onSubmit={handleFormSubmit}
                error={error}
                humanResourceHoursInput={humanResourceHoursInput}
              />
            </DialogContent>
          </Dialog>

          <div className="h-9 w-px bg-gray-200 mx-2 hidden md:block"></div>

          <select
            value={csvImportMode}
            onChange={(event) => setCsvImportMode(event.target.value as 'append' | 'replace')}
            className="rounded border border-gray-300 bg-white px-2 text-sm h-9 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
          >
            <option value="append">CSV 追加</option>
            <option value="replace">CSV 覆蓋</option>
          </select>
          <input
            ref={csvFileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleImportCsvFileChange}
          />
          <Button onClick={handleImportCsvButtonClick} variant="outline">
            匯入 CSV
          </Button>
          <Button onClick={handleExportCsvClick} variant="outline">
            匯出 CSV
          </Button>
          <Button
            onClick={handleClearAll}
            variant="outline"
            className="text-red-500 hover:bg-red-50 border-red-200 hover:border-red-300"
          >
            清空資料
          </Button>
          <Button
            onClick={handleExportClick}
            disabled={isExporting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isExporting ? '匯出中...' : '匯出圖表'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* 錯誤訊息顯示 */}
        {(error || exportError || csvResultMessage) && (
          <div
            className={`p-4 rounded-md border ${error || exportError || csvImportErrors.length > 0
              ? 'bg-red-50 border-red-200 text-red-600'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}
          >
            {error || exportError || csvResultMessage}
            {csvImportErrors.length > 0 && (
              <ul className="mt-2 list-disc pl-5 text-sm">
                {csvImportErrors.slice(0, 5).map((item) => (
                  <li key={`${item.row}-${item.message}`}>
                    第 {item.row} 列：{item.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* 核心指標 - 獨立全寬區塊 */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-6 w-1 bg-blue-500 rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">核心指標摘要</h2>
          </div>
          <OrderStatsSummary summary={summary} />
        </section>

        <div className="border-t border-gray-100 my-6"></div>

        {/* 圖表分析區塊 */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-6 w-1 bg-purple-500 rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">趨勢與成本分析</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          </div>

          <div className="mt-8">
            <StaffAnalysisCardList
              entries={data}
              onDelete={handleDeleteEntry}
              onUpdate={handleUpdateEntry}
            />
          </div>
        </section>
      </CardContent>
    </Card>
  );
};

export default DetailedOrderAnalysis;
