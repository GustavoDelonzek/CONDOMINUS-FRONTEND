import { useState } from 'react';
import { Building2, MessageSquare, DollarSign } from 'lucide-react';
import { MetricCard } from '../components/cards/MetricCard';
import { CondominiumTable } from '../components/cards/CondominiumTable';
import { AddCondominiumDrawer } from '../components/ui/AddCondominiumDrawer';


const MOCK_CONDOMINIUMS = [
    {
        id: 'ID: CD-2538', initials: 'OV', initialsColor: '#6366F1',
        name: 'Ocean View Towers', syndicateName: 'John Smith',
        planType: 'Premium' as const, apiStatus: 'Connected' as const,
    },
    {
        id: 'ID: CD-2539', initials: 'SV', initialsColor: '#F59E0B',
        name: 'Sunset Villas', syndicateName: 'Maria Garcia',
        planType: 'Basic' as const, apiStatus: 'Disconnected' as const,
    },
    {
        id: 'ID: CD-2540', initials: 'GP', initialsColor: '#10B981',
        name: 'Green Park Estate', syndicateName: 'David Johnson',
        planType: 'Premium' as const, apiStatus: 'Connected' as const,
    },
    {
        id: 'ID: CD-2541', initials: 'RH', initialsColor: '#EF4444',
        name: 'Royal Heights', syndicateName: 'Julian Ross',
        planType: 'Basic' as const, apiStatus: 'Connected' as const,
    },
    {
        id: 'ID: CD-2542', initials: 'MB', initialsColor: '#8B5CF6',
        name: 'Marina Bay', syndicateName: 'Elena Kim',
        planType: 'Premium' as const, apiStatus: 'Disconnected' as const,
    },
];

const TOTAL_RECORDS = 1248;
const PAGE_SIZE = 5;


export function DashboardAdminCompany() {
    const [page, setPage] = useState(1);
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <>
            <div className="p-4 md:p-8 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <MetricCard
                        label="Total Condominiums"
                        value="1,248"
                        trend="12%"
                        trendLabel="vs last month"
                        iconBg="bg-blue-50"
                        icon={<Building2 className="w-6 h-6 text-brand" />}
                    />
                    <MetricCard
                        label="Active WhatsApp Channels"
                        value="892"
                        trend="99.8%"
                        trendLabel="Uptime"
                        iconBg="bg-green-50"
                        icon={<MessageSquare className="w-6 h-6 text-green-500" />}
                    />
                    <MetricCard
                        label="Total MRR"
                        value="$145.2k"
                        trend="8.5%"
                        trendLabel="growth"
                        iconBg="bg-yellow-50"
                        icon={<DollarSign className="w-6 h-6 text-yellow-500" />}
                    />
                </div>

                <CondominiumTable
                    data={MOCK_CONDOMINIUMS}
                    total={TOTAL_RECORDS}
                    page={page}
                    pageSize={PAGE_SIZE}
                    onPrev={() => setPage((p) => Math.max(1, p - 1))}
                    onNext={() => setPage((p) => p + 1)}
                    onAddCondominium={() => setDrawerOpen(true)}
                />
            </div>

            <AddCondominiumDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onSubmit={(data) => console.log('New condominium:', data)}
            />
        </>
    );
}
