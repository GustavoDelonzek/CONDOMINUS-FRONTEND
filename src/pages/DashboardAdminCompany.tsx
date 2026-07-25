import { Building2, MessageSquare, DollarSign } from 'lucide-react';
import { MetricCard } from '../components/cards/MetricCard';

export function DashboardAdminCompany() {
    return (
        <div className="p-4 md:p-8 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <MetricCard
                    label="Total Condominiums"
                    value="1,248"
                    trend="12%"
                    trendLabel="vs last month"
                    iconBg="bg-brand/10"
                    icon={<Building2 className="w-6 h-6 text-brand" />}
                />
                <MetricCard
                    label="Active WhatsApp Channels"
                    value="892"
                    trend="99.8%"
                    trendLabel="Uptime"
                    iconBg="bg-success/10"
                    icon={<MessageSquare className="w-6 h-6 text-success" />}
                />
                <MetricCard
                    label="Total MRR"
                    value="$145.2k"
                    trend="8.5%"
                    trendLabel="growth"
                    iconBg="bg-warning/10"
                    icon={<DollarSign className="w-6 h-6 text-warning" />}
                />
            </div>
        </div>
    );
}
