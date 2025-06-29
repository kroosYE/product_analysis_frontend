import DetailedOrderAnalysis from '@/pages/detailed-order-analysis';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <main className="p-4">
                <div className="flex justify-end mb-4">
                    <ThemeToggle />
                </div>
                <DetailedOrderAnalysis />
            </main >
        </div>
    );
}