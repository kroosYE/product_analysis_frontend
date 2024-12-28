import html2canvas from 'html2canvas';
import { useCallback, useState } from 'react';

interface ExportOptions {
    fileName?: string;
    quality?: number;
    backgroundColor?: string;
    scale?: number;
}

export const useChartExport = (ref: React.RefObject<HTMLDivElement | null>) => {
    // 匯出狀態管理
    const [isExporting, setIsExporting] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);

    // 匯出處理函數
    const handleExport = useCallback(async (options: ExportOptions = {}) => {
        const {
            fileName = '圖表',
            quality = 1,
            backgroundColor = '#FFFFFF',
            scale = 2
        } = options;

        if (!ref.current) {
            setExportError('找不到要匯出的元素');
            return;
        }

        try {
            setIsExporting(true);
            setExportError(null);

            // 使用 html2canvas 將元素轉換為 canvas
            const canvas = await html2canvas(ref.current, {
                backgroundColor,
                scale,
                logging: false,
                useCORS: true,
                allowTaint: true,
                onclone: (document, element) => {
                    // 處理克隆的元素，例如調整樣式
                    element.style.width = `${ref.current?.offsetWidth}px`;
                    element.style.height = `${ref.current?.offsetHeight}px`;
                }
            });

            // 將 canvas 轉換為 PNG 圖片
            const imageUrl = canvas.toDataURL('image/png', quality);

            // 創建下載連結
            const link = document.createElement('a');
            link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.png`;
            link.href = imageUrl;

            // 觸發下載
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            if (err instanceof Error) {
                setExportError(`匯出失敗: ${err.message}`);
            } else {
                setExportError('匯出過程中發生未知錯誤');
            }
            console.error('Export error:', err);
        } finally {
            setIsExporting(false);
        }
    }, [ref]);

    // 清除錯誤
    const clearError = useCallback(() => {
        setExportError(null);
    }, []);

    return {
        handleExport,
        isExporting,
        exportError,
        clearError
    };
};

// 使用範例
/*
const ChartComponent = () => {
    const chartRef = useRef<HTMLDivElement>(null);
    const { 
        handleExport, 
        isExporting, 
        exportError 
    } = useChartExport(chartRef);

    return (
        <div>
            {exportError && (
                <div className="text-red-500">{exportError}</div>
            )}
            
            <div ref={chartRef}>
                {/* 圖表內容 *\/}
            </div>

            <button 
                onClick={() => handleExport({ 
                    fileName: '銷售報表',
                    scale: 2 
                })}
                disabled={isExporting}
            >
                {isExporting ? '匯出中...' : '匯出圖表'}
            </button>
        </div>
    );
};
*/

export default useChartExport;