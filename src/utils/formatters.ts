/**
 * 格式化百分比
 * @param value - 數值
 * @param decimals - 小數位數（預設 2）
 * @returns 格式化後的百分比字串
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
    return `${value.toFixed(decimals)}%`;
};

/**
 * 格式化金額
 * @param value - 金額
 * @param currency - 貨幣單位（預設 'NT$'）
 * @returns 格式化後的金額字串
 */
export const formatCurrency = (value: number, currency: string = 'NT$'): string => {
    return `${currency}${value.toLocaleString()}`;
};

/**
 * 格式化時間
 * @param hours - 小時數
 * @returns 格式化後的時間字串
 */
export const formatTime = (hours: number): string => {
    if (hours < 1) {
        const minutes = Math.round(hours * 60);
        return `${minutes} 分鐘`;
    }
    return `${hours.toFixed(1)} 小時`;
};

/**
 * 格式化比率
 * @param numerator - 分子
 * @param denominator - 分母
 * @returns 格式化後的比率字串
 */
export const formatRatio = (numerator: number, denominator: number): string => {
    if (denominator === 0) return '0:0';
    return `${numerator}:${denominator}`;
};