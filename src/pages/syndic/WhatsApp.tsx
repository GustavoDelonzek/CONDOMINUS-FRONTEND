import { useEffect, useState } from 'react';
import { MessageCircle, Smartphone, RefreshCw, ArrowDownLeft, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useCondo } from '../../contexts/CondoContext';
import { ApiError } from '../../services/apiClient';
import * as whatsappService from '../../services/whatsappService';
import type { BackendMessageLog, WhatsAppInstanceStatus } from '../../services/whatsappService';
import { formatDate } from '../../lib/format';

const STATUS_LABELS: Record<WhatsAppInstanceStatus, string> = {
    not_configured: 'Não Configurado',
    connecting: 'Conectando',
    open: 'Conectado',
    close: 'Desconectado',
};

const STATUS_STYLES: Record<WhatsAppInstanceStatus, string> = {
    not_configured: 'text-muted-foreground border-border bg-accent',
    connecting: 'text-amber-600 border-amber-200 bg-amber-50',
    open: 'text-emerald-600 border-emerald-200 bg-emerald-50',
    close: 'text-destructive border-destructive/20 bg-destructive/10',
};

const STATUS_ICON_STYLES: Record<WhatsAppInstanceStatus, string> = {
    not_configured: 'bg-accent text-muted-foreground',
    connecting: 'bg-amber-50 text-amber-600',
    open: 'bg-emerald-50 text-emerald-600',
    close: 'bg-destructive/10 text-destructive',
};

const STATUS_DESCRIPTIONS: Record<WhatsAppInstanceStatus, string> = {
    not_configured: 'Conecte um número de WhatsApp para o bot atender os moradores deste condomínio.',
    connecting: 'Escaneie o QR Code para finalizar o pareamento.',
    open: 'O bot está ativo e respondendo os moradores por este número.',
    close: 'A conexão caiu. Conecte novamente para reativar o bot.',
};

function StatusBadge({ status }: { status: WhatsAppInstanceStatus }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider border ${STATUS_STYLES[status]}`}
        >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {STATUS_LABELS[status]}
        </span>
    );
}

export function WhatsApp() {
    const { activeCondoId } = useCondo();
    const [status, setStatus] = useState<WhatsAppInstanceStatus>('not_configured');
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectError, setConnectError] = useState<string | null>(null);

    const [messages, setMessages] = useState<BackendMessageLog[]>([]);
    const [messagesLoading, setMessagesLoading] = useState(true);
    const [refreshToken, setRefreshToken] = useState(0);

    useEffect(() => {
        if (!activeCondoId) return;
        let cancelled = false;
        whatsappService
            .getInstanceStatus(activeCondoId)
            .then((res) => {
                if (cancelled) return;
                setStatus(res.status);
                setPhoneNumber(res.phone_number_connected);
                setLoadError(null);
            })
            .catch((err) => {
                if (cancelled) return;
                setLoadError(err instanceof ApiError ? err.message : 'Não foi possível carregar o status do WhatsApp.');
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [activeCondoId, refreshToken]);

    useEffect(() => {
        if (!activeCondoId) return;
        let cancelled = false;
        whatsappService
            .listMessages(activeCondoId)
            .then((result) => {
                if (!cancelled) setMessages(result.items);
            })
            .catch(() => {})
            .finally(() => {
                if (!cancelled) setMessagesLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [activeCondoId, refreshToken]);

    useEffect(() => {
        if (status !== 'connecting' || !activeCondoId) return;
        const interval = setInterval(() => {
            whatsappService
                .getInstanceStatus(activeCondoId)
                .then((res) => {
                    setStatus(res.status);
                    setPhoneNumber(res.phone_number_connected);
                    if (res.status === 'open') {
                        setQrCode(null);
                        setRefreshToken((t) => t + 1);
                    }
                })
                .catch(() => {});
        }, 3000);
        return () => clearInterval(interval);
    }, [status, activeCondoId]);

    const isAwaitingScan = status === 'connecting' && !!qrCode;

    useEffect(() => {
        if (!isAwaitingScan || !activeCondoId) return;
        const interval = setInterval(() => {
            whatsappService
                .connectInstance(activeCondoId)
                .then((res) => {
                    setStatus(res.status);
                    setQrCode(res.status === 'open' ? null : res.qrcode);
                })
                .catch(() => {});
        }, 20000);
        return () => clearInterval(interval);
    }, [isAwaitingScan, activeCondoId]);

    async function handleConnect() {
        if (!activeCondoId) return;
        setIsConnecting(true);
        setConnectError(null);
        try {
            const res = await whatsappService.connectInstance(activeCondoId);
            setStatus(res.status);
            setQrCode(res.qrcode);
        } catch (err) {
            setConnectError(err instanceof ApiError ? err.message : 'Não foi possível conectar o WhatsApp.');
        } finally {
            setIsConnecting(false);
        }
    }

    return (
        <div className="flex flex-col h-full bg-background overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-6 md:p-8 lg:p-12">
                <div className="w-full">
                    <h1 className="text-3xl font-black text-foreground mb-2 tracking-tight">WhatsApp</h1>
                    <p className="text-sm text-muted-foreground mb-8">
                        Conecte o número de WhatsApp deste condomínio para o bot atender os moradores.
                    </p>

                    {loadError && (
                        <div className="mb-6 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg px-4 py-3">
                            {loadError}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        <div className="order-2 lg:order-1 lg:col-span-2">
                            <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-4">
                                Histórico de Mensagens
                            </h2>

                            <div className="bg-background border-2 border-slate-100 rounded-2xl shadow-sm divide-y divide-border/50 overflow-hidden">
                                {messagesLoading ? (
                                    <p className="p-6 text-sm text-muted-foreground">Carregando...</p>
                                ) : messages.length === 0 ? (
                                    <div className="p-10 text-center">
                                        <MessageCircle size={32} className="mx-auto mb-3 text-muted-foreground opacity-50" />
                                        <p className="text-sm text-muted-foreground">Nenhuma mensagem registrada ainda.</p>
                                    </div>
                                ) : (
                                    messages.map((msg) => (
                                        <div key={msg.id} className="p-4 flex items-start gap-3">
                                            <div
                                                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                                                    msg.direction === 'inbound' ? 'bg-brand/10 text-brand' : 'bg-emerald-50 text-emerald-600'
                                                }`}
                                            >
                                                {msg.direction === 'inbound' ? (
                                                    <ArrowDownLeft size={14} strokeWidth={2.5} />
                                                ) : (
                                                    <ArrowUpRight size={14} strokeWidth={2.5} />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-4 mb-0.5">
                                                    <p className="text-xs font-bold text-foreground">
                                                        {msg.user?.full_name ?? msg.phone_number}
                                                    </p>
                                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                                        {formatDate(msg.created_at)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-foreground whitespace-pre-line break-words">{msg.content}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-4">
                                Conexão
                            </h2>

                            <div className="bg-background border-2 border-slate-100 rounded-2xl p-6 shadow-sm lg:sticky lg:top-0">
                                {isLoading ? (
                                    <p className="text-sm text-muted-foreground text-center py-6">Carregando...</p>
                                ) : (
                                    <div className="flex flex-col items-center text-center">
                                        <div
                                            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${STATUS_ICON_STYLES[status]}`}
                                        >
                                            {status === 'open' ? (
                                                <CheckCircle2 size={28} strokeWidth={1.5} />
                                            ) : (
                                                <MessageCircle size={28} strokeWidth={1.5} />
                                            )}
                                        </div>

                                        <StatusBadge status={status} />

                                        <p className="text-lg font-bold text-foreground mt-3 mb-1">
                                            {phoneNumber ?? 'Nenhum número conectado'}
                                        </p>
                                        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                                            {STATUS_DESCRIPTIONS[status]}
                                        </p>

                                        {connectError && <p className="text-sm text-destructive mb-4">{connectError}</p>}

                                        {status === 'connecting' && qrCode ? (
                                            <div className="w-full">
                                                <img
                                                    src={qrCode}
                                                    alt="QR Code para parear o WhatsApp"
                                                    className="w-full max-w-[220px] mx-auto border border-border rounded-xl mb-4"
                                                />
                                                <p className="text-xs text-foreground font-semibold mb-1">
                                                    WhatsApp → Aparelhos Conectados → Conectar um aparelho
                                                </p>
                                                <p className="text-[11px] text-muted-foreground">
                                                    Aguardando pareamento... o código se renova sozinho a cada 20s, não
                                                    precisa recarregar a página.
                                                </p>
                                                <button
                                                    onClick={handleConnect}
                                                    disabled={isConnecting}
                                                    className="mt-4 text-xs font-semibold text-brand hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-50"
                                                >
                                                    Gerar novo código
                                                </button>
                                            </div>
                                        ) : status === 'connecting' && !qrCode ? (
                                            <p className="text-xs text-muted-foreground">Gerando QR Code...</p>
                                        ) : (
                                            <button
                                                onClick={handleConnect}
                                                disabled={isConnecting}
                                                className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-brand text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer shadow-sm"
                                            >
                                                {status === 'open' ? (
                                                    <RefreshCw size={16} strokeWidth={2.5} />
                                                ) : (
                                                    <Smartphone size={16} strokeWidth={2.5} />
                                                )}
                                                {isConnecting ? 'Conectando...' : status === 'open' ? 'Reconectar' : 'Conectar'}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
