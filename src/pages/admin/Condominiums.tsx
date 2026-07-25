import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CondominiumTable } from '../../components/cards/CondominiumTable';
import { AddCondominiumDrawer, type CondominiumFormData } from '../../components/ui/AddCondominiumDrawer';
import { useAuth } from '../../contexts/AuthContext';
import { ApiError } from '../../services/apiClient';
import * as condominiumService from '../../services/condominiumService';
import type { BackendCondominium } from '../../services/condominiumService';

const EMPTY_META = { current_page: 1, last_page: 1, total: 0 };

export function Condominiums() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [items, setItems] = useState<BackendCondominium[]>([]);
    const [meta, setMeta] = useState(EMPTY_META);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [refreshToken, setRefreshToken] = useState(0);

    useEffect(() => {
        let cancelled = false;
        condominiumService
            .listCondominiums({ name: search || undefined, page })
            .then((result) => {
                if (cancelled) return;
                setItems(result.items);
                setMeta(result.meta);
                setError(null);
            })
            .catch((err) => {
                if (cancelled) return;
                setError(err instanceof ApiError ? err.message : 'Não foi possível carregar os condomínios.');
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [search, page, refreshToken]);

    async function handleCreate(data: CondominiumFormData) {
        await condominiumService.createCondominium({
            name: data.name,
            address_full: [data.logradouro, data.numero, data.bairro, data.cidade, data.estado]
                .filter(Boolean)
                .join(', '),
        });
        if (page === 1) {
            setRefreshToken((t) => t + 1);
        } else {
            setPage(1);
        }
    }

    return (
        <div className="p-4 md:p-8 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar">
            {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg px-4 py-3">
                    {error}
                </div>
            )}

            {isLoading && items.length === 0 ? (
                <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
                    Carregando condomínios...
                </div>
            ) : (
                <CondominiumTable
                    data={items}
                    currentPage={meta.current_page}
                    lastPage={meta.last_page}
                    total={meta.total}
                    onPrev={() => setPage((p) => Math.max(1, p - 1))}
                    onNext={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                    onView={(id) => navigate(`/admin/condos/${id}`)}
                    onAddCondominium={() => setDrawerOpen(true)}
                    canCreate={!!user?.isSuperAdmin}
                    search={search}
                    onSearchChange={(value) => {
                        setSearch(value);
                        setPage(1);
                    }}
                />
            )}

            <AddCondominiumDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onSubmit={handleCreate} />
        </div>
    );
}
