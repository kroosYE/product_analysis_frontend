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

/**
 * 
 * 格式化人力工時
 * 
 * @param totalHours 
 * @returns 
 */
export const formatTotalHoursToDDHHMM = (totalHours: number): string => {
    if (isNaN(totalHours) || totalHours < 0) return '00:00:00';

    const totalMinutes = Math.round(totalHours * 60);
    const days = Math.floor(totalMinutes / (24 * 60));
    const remainingMinutesAfterDays = totalMinutes % (24 * 60);
    const hours = Math.floor(remainingMinutesAfterDays / 60);
    const minutes = remainingMinutesAfterDays % 60;

    return `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

export const parseDDHHMMToTotalHours = (value: string): number => {
    const parts = value.split(':');

    if (parts.length !== 3) {
        return 0;
    }

    const [daysPart, hoursPart, minutesPart] = parts;
    const days = Number(daysPart);
    const hours = Number(hoursPart);
    const minutes = Number(minutesPart);

    if (
        Number.isNaN(days) ||
        Number.isNaN(hours) ||
        Number.isNaN(minutes) ||
        days < 0 ||
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59
    ) {
        return 0;
    }

    return days * 24 + hours + minutes / 60;
};

/**
 * 
 * 將總小時數轉換為「X日Y小時Z分」格式
 * 
 * @param totalHours 
 * @returns 
 */
export const formatTotalHoursToChinese = (totalHours: number): string => {
    if (isNaN(totalHours) || totalHours < 0) return '0分'; // 如果無效或負數，預設為0分

    const totalMinutes = Math.round(totalHours * 60);

    const days = Math.floor(totalMinutes / (24 * 60));
    const remainingMinutesAfterDays = totalMinutes % (24 * 60);
    const hours = Math.floor(remainingMinutesAfterDays / 60);
    const minutes = remainingMinutesAfterDays % 60;

    let result = '';
    if (days > 0) {
        result += `${days}日`;
    }
    if (hours > 0) {
        result += `${hours}小時`;
    }
    if (minutes > 0 || (days === 0 && hours === 0)) { // 如果天和小時都是0，分鐘必須顯示
        result += `${minutes}分`;
    }

    return result.trim() || '0分'; // 確保至少返回「0分」
};
