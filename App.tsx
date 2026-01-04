import React, { useState, useMemo } from 'react';
import { Layout } from './components/Layout';
import { Card, SectionHeader, Button, Input, Select } from './components/UIComponents';
import { 
    TrendingUp, 
    TrendingDown, 
    Wallet, 
    LayoutGrid,
    ShoppingCart,
    Plus,
    Trash2,
    Edit2,
    CheckCircle2,
    Circle,
    CreditCard as CardIcon,
    Target,
    PieChart as PieIcon,
    ChevronRight,
    Landmark,
    Save,
    X,
    Sparkles,
    Calendar
} from 'lucide-react';
import { 
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { Transaction, TransactionType, Asset, ViewState, Currency, Goal, ShoppingTrip, CreditCard, TagBudget } from './types';
import { analyzeFinances } from './services/geminiService';

// --- CONSTANTS & MOCKS ---
const COLORS = ['#8b5cf6', '#10b981', '#ef4444', '#f59e0b', '#06b6d4', '#ec4899'];

const INITIAL_TRANSACTIONS: Transaction[] = [
    { id: 't1', description: 'Salário Principal', amount: 5000, date: '2023-10-01', type: TransactionType.INCOME, status: 'PAID', paymentMethod: 'CASH', tags: ['salario'] },
    { id: 't2', description: 'Aluguel Mensal', amount: 1500, date: '2023-10-05', type: TransactionType.EXPENSE, category: 'Moradia', status: 'PAID', paymentMethod: 'DEBIT', tags: ['fixo'] },
    { id: 't3', description: 'Mercado Semanal', amount: 450, date: '2023-10-08', type: TransactionType.EXPENSE, category: 'Alimentação', status: 'PAID', paymentMethod: 'DEBIT', tags: ['variavel'] },
];

const INITIAL_GOALS: Goal[] = [
    { id: 'g1', name: 'Reserva de Emergência', currentAmount: 5000, targetAmount: 15000 },
    { id: 'g2', name: 'Viagem Japão', currentAmount: 2000, targetAmount: 12000 },
];

const INITIAL_ASSETS: Asset[] = [
    { id: 'a1', name: 'Nubank (Reserva)', value: 5000, type: 'Bank' },
    { id: 'a2', name: 'Bitcoin', value: 3500, type: 'Crypto' },
    { id: 'a3', name: 'Tesouro Direto', value: 8000, type: 'Investment' },
];

const INITIAL_SHOPPING: ShoppingTrip[] = [
    {
        id: 's1', name: 'Mercado Mensal', date: '2023-10-20', category: 'Mercado',
        items: [
            { id: 'i1', name: 'Arroz 5kg', category: 'Grãos', price: 25.90, isBought: true },
            { id: 'i2', name: 'Leite 12un', category: 'Laticínios', price: 58.00, isBought: false },
        ]
    }
];

// --- SUB-COMPONENTS ---

const DashboardView = ({ transactions, assets, goals, shopping, formatMoney }: any) => {
    const [insight, setInsight] = useState<string>('');
    const [loadingAI, setLoadingAI] = useState(false);

    const totalIncome = transactions.filter((t: any) => t.type === TransactionType.INCOME).reduce((acc: number, t: any) => acc + t.amount, 0);
    const totalExpense = transactions.filter((t: any) => t.type === TransactionType.EXPENSE).reduce((acc: number, t: any) => acc + t.amount, 0);
    const balance = totalIncome - totalExpense;

    const handleAIAnalysis = async () => {
        setLoadingAI(true);
        const result = await analyzeFinances(transactions, goals, assets, shopping);
        setInsight(result);
        setLoadingAI(false);
    };

    return (
      <div className="space-y-6 animate-fade-in">
          <SectionHeader 
            title="Overview" 
            subtitle="Resumo da sua saúde financeira" 
            action={
                <Button onClick={handleAIAnalysis} disabled={loadingAI} variant="secondary" className="border-brand-500/30 text-brand-400">
                    <Sparkles size={18} className={loadingAI ? 'animate-pulse' : ''} />
                    {loadingAI ? 'Analisando...' : 'AI Insights'}
                </Button>
            }
          />

          {insight && (
              <Card className="bg-brand-950/20 border-brand-500/30 animate-fade-in">
                  <div className="flex gap-3">
                      <Sparkles className="text-brand-400 shrink-0" size={24} />
                      <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed italic">
                          {insight}
                      </div>
                  </div>
              </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="flex flex-col border-emerald-900/30 bg-gradient-to-br from-slate-900 to-emerald-950/10">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Entradas</span>
                  <div className="flex items-center space-x-2 mt-2">
                      <TrendingUp className="text-emerald-500" size={20} />
                      <span className="text-2xl font-bold">{formatMoney(totalIncome)}</span>
                  </div>
              </Card>
              <Card className="flex flex-col border-rose-900/30 bg-gradient-to-br from-slate-900 to-rose-950/10">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Saídas</span>
                  <div className="flex items-center space-x-2 mt-2">
                      <TrendingDown className="text-rose-500" size={20} />
                      <span className="text-2xl font-bold">{formatMoney(totalExpense)}</span>
                  </div>
              </Card>
              <Card className="flex flex-col border-brand-900/30 bg-gradient-to-br from-slate-900 to-brand-950/10">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Saldo</span>
                  <div className="flex items-center space-x-2 mt-2">
                      <Wallet className="text-brand-500" size={20} />
                      <span className="text-2xl font-bold">{formatMoney(balance)}</span>
                  </div>
              </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="h-80">
                  <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase">Fluxo Mensal</h3>
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                          { name: 'Set', income: 4500, expense: 3800 },
                          { name: 'Out', income: totalIncome, expense: totalExpense }
                      ]}>
                          <XAxis dataKey="name" stroke="#475569" fontSize={12} />
                          <YAxis stroke="#475569" fontSize={12} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                          <Area type="monotone" dataKey="income" stroke="#10b981" fill="#10b98122" />
                          <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="#ef444422" />
                      </AreaChart>
                  </ResponsiveContainer>
              </Card>
              
              <Card className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase">Metas Próximas</h3>
                  {goals.map((g: Goal) => (
                      <div key={g.id} className="space-y-1">
                          <div className="flex justify-between text-xs">
                              <span>{g.name}</span>
                              <span className="font-bold">{Math.round((g.currentAmount/g.targetAmount)*100)}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div 
                                className="bg-brand-500 h-full rounded-full transition-all duration-1000" 
                                style={{ width: `${(g.currentAmount/g.targetAmount)*100}%` }}
                              />
                          </div>
                      </div>
                  ))}
              </Card>
          </div>
      </div>
    );
};

const EarningsView = ({ transactions, setTransactions, formatMoney }: any) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ description: '', amount: '', date: new Date().toISOString().split('T')[0] });

    const earnings = transactions.filter((t: any) => t.type === TransactionType.INCOME);

    const resetForm = () => {
        setForm({ description: '', amount: '', date: new Date().toISOString().split('T')[0] });
        setIsEditing(false);
        setEditId(null);
    };

    const handleSave = () => {
        if (!form.description || !form.amount) return;
        
        if (editId) {
            setTransactions(transactions.map((t: Transaction) => t.id === editId ? { 
                ...t, 
                description: form.description, 
                amount: parseFloat(form.amount),
                date: form.date
            } : t));
        } else {
            const newTx: Transaction = {
                id: Date.now().toString(),
                description: form.description,
                amount: parseFloat(form.amount),
                date: form.date,
                type: TransactionType.INCOME,
                status: 'PAID',
                paymentMethod: 'CASH',
                tags: ['extra']
            };
            setTransactions([newTx, ...transactions]);
        }
        resetForm();
    };

    const handleEdit = (tx: Transaction) => {
        setForm({ description: tx.description, amount: tx.amount.toString(), date: tx.date });
        setEditId(tx.id);
        setIsEditing(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Deseja realmente excluir este lançamento de ganho?')) {
            setTransactions(transactions.filter((t: Transaction) => t.id !== id));
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <SectionHeader 
                title="Ganhos" 
                subtitle="Gerencie suas fontes de receita" 
                action={
                    !isEditing && (
                        <Button onClick={() => setIsEditing(true)}>
                            <Plus size={18} /> Novo Ganho
                        </Button>
                    )
                }
            />

            {isEditing && (
                <Card className="border-brand-500/30 animate-fade-in bg-slate-900/50">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">{editId ? 'Editar Ganho' : 'Novo Ganho'}</h3>
                        <Button variant="ghost" onClick={resetForm}><X size={20} /></Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input label="Descrição" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Ex: Salário" />
                        <Input label="Valor" type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="0,00" />
                        <Input label="Data" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                    </div>
                    <div className="flex justify-end mt-4 gap-3">
                        <Button variant="secondary" onClick={resetForm}>Cancelar</Button>
                        <Button onClick={handleSave} className="min-w-[120px]">
                            <Save size={18} /> {editId ? 'Atualizar' : 'Salvar'}
                        </Button>
                    </div>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 h-fit bg-gradient-to-br from-slate-900 to-emerald-950/10 border-emerald-900/30">
                    <h3 className="text-lg font-bold mb-1">Total de Entradas</h3>
                    <p className="text-slate-400 text-sm mb-4">Consolidado do mês</p>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                            <TrendingUp size={24} />
                        </div>
                        <span className="text-3xl font-bold text-emerald-500">
                            {formatMoney(earnings.reduce((acc: number, t: any) => acc + t.amount, 0))}
                        </span>
                    </div>
                </Card>

                <Card className="md:col-span-2 space-y-3">
                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Histórico de Recebimentos</h3>
                    <div className="space-y-2">
                        {earnings.length > 0 ? earnings.map((t: Transaction) => (
                            <div key={t.id} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800 hover:border-brand-500/30 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-900 rounded-lg text-emerald-500">
                                        <Calendar size={16} />
                                    </div>
                                    <div>
                                        <p className="font-medium">{t.description}</p>
                                        <p className="text-[10px] text-slate-500 font-mono">{t.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-emerald-500 font-bold">{formatMoney(t.amount)}</span>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" className="p-2 h-auto" onClick={() => handleEdit(t)}>
                                            <Edit2 size={16} className="text-slate-400" />
                                        </Button>
                                        <Button variant="ghost" className="p-2 h-auto hover:bg-rose-500/10" onClick={() => handleDelete(t.id)}>
                                            <Trash2 size={16} className="text-rose-500" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="py-10 text-center text-slate-500 italic">Nenhum ganho registrado.</div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

const ExpensesView = ({ transactions, setTransactions, formatMoney }: any) => {
    const [desc, setDesc] = useState('');
    const [val, setVal] = useState('');
    const [cat, setCat] = useState('Geral');

    const handleAdd = () => {
        if (!desc || !val) return;
        const newTx: Transaction = {
            id: Date.now().toString(),
            description: desc,
            amount: parseFloat(val),
            date: new Date().toISOString().split('T')[0],
            type: TransactionType.EXPENSE,
            status: 'PAID',
            paymentMethod: 'DEBIT',
            category: cat,
            tags: [cat.toLowerCase()]
        };
        setTransactions([newTx, ...transactions]);
        setDesc(''); setVal('');
    };

    const expenses = transactions.filter((t: any) => t.type === TransactionType.EXPENSE);

    return (
        <div className="space-y-6 animate-fade-in">
            <SectionHeader title="Despesas" subtitle="Controle seus gastos detalhadamente" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 h-fit">
                    <h3 className="text-lg font-bold mb-4">Novo Gasto</h3>
                    <div className="space-y-4">
                        <Input label="O que comprou?" value={desc} onChange={e => setDesc(e.target.value)} />
                        <Input label="Quanto custou?" type="number" value={val} onChange={e => setVal(e.target.value)} />
                        <Select 
                            label="Categoria" 
                            value={cat} 
                            onChange={e => setCat(e.target.value)}
                            options={[
                                {label: 'Lazer', value: 'Lazer'},
                                {label: 'Alimentação', value: 'Alimentação'},
                                {label: 'Saúde', value: 'Saúde'},
                                {label: 'Transporte', value: 'Transporte'},
                                {label: 'Assinaturas', value: 'Assinaturas'}
                            ]}
                        />
                        <Button onClick={handleAdd} className="w-full"><Plus size={18} /> Lançar</Button>
                    </div>
                </Card>
                <Card className="md:col-span-2 space-y-3">
                    {expenses.map((t: any) => (
                        <div key={t.id} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800 hover:border-brand-500/30 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg">
                                    <TrendingDown size={18} />
                                </div>
                                <div>
                                    <p className="font-medium">{t.description}</p>
                                    <span className="text-[10px] uppercase text-slate-500 font-bold">{t.category}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-rose-500 font-bold">{formatMoney(t.amount)}</p>
                                <p className="text-[10px] text-slate-500">{t.date}</p>
                            </div>
                        </div>
                    ))}
                </Card>
            </div>
        </div>
    );
};

const ShoppingView = ({ shopping, setShopping, formatMoney }: any) => {
    const [activeTrip, setActiveTrip] = useState<string | null>(shopping[0]?.id || null);
    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');

    const currentTrip = shopping.find((s: any) => s.id === activeTrip);

    const handleAddItem = () => {
        if (!newItemName || !newItemPrice || !activeTrip) return;
        const newItem = {
            id: Date.now().toString(),
            name: newItemName,
            category: 'Geral',
            price: parseFloat(newItemPrice),
            isBought: false
        };
        setShopping(shopping.map((s: any) => s.id === activeTrip ? { ...s, items: [...s.items, newItem] } : s));
        setNewItemName(''); setNewItemPrice('');
    };

    const toggleItem = (itemId: string) => {
        setShopping(shopping.map((s: any) => ({
            ...s,
            items: s.items.map((i: any) => i.id === itemId ? { ...i, isBought: !i.isBought } : i)
        })));
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <SectionHeader title="Lista de Compras" subtitle="Organize suas idas ao mercado" />
            
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {shopping.map((s: any) => (
                    <Button 
                        key={s.id} 
                        variant={activeTrip === s.id ? 'primary' : 'secondary'}
                        onClick={() => setActiveTrip(s.id)}
                        className="whitespace-nowrap"
                    >
                        {s.name}
                    </Button>
                ))}
                <Button variant="ghost"><Plus size={18} /></Button>
            </div>

            {currentTrip ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                            <h3 className="font-bold">{currentTrip.name} - {currentTrip.date}</h3>
                            <span className="text-emerald-400 font-mono font-bold">
                                Total: {formatMoney(currentTrip.items.reduce((acc: number, i: any) => acc + i.price, 0))}
                            </span>
                        </div>
                        <div className="space-y-2">
                            {currentTrip.items.map((item: any) => (
                                <div 
                                    key={item.id} 
                                    onClick={() => toggleItem(item.id)}
                                    className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${item.isBought ? 'bg-slate-900/50 border-slate-800 opacity-50' : 'bg-slate-950 border-slate-800'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        {item.isBought ? <CheckCircle2 size={18} className="text-brand-500" /> : <Circle size={18} className="text-slate-600" />}
                                        <span className={item.isBought ? 'line-through' : ''}>{item.name}</span>
                                    </div>
                                    <span className="font-mono text-sm">{formatMoney(item.price)}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                    <Card className="h-fit">
                        <h3 className="font-bold mb-4">Adicionar Item</h3>
                        <div className="space-y-4">
                            <Input label="Produto" value={newItemName} onChange={e => setNewItemName(e.target.value)} />
                            <Input label="Preço Est." type="number" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} />
                            <Button onClick={handleAddItem} className="w-full">Adicionar</Button>
                        </div>
                    </Card>
                </div>
            ) : (
                <div className="text-center py-20 text-slate-500">Nenhuma lista selecionada.</div>
            )}
        </div>
    );
};

const GoalsView = ({ goals, setGoals, formatMoney }: any) => {
    return (
        <div className="space-y-6 animate-fade-in">
            <SectionHeader title="Metas" subtitle="Foco no que realmente importa" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {goals.map((g: Goal) => {
                    const percent = (g.currentAmount / g.targetAmount) * 100;
                    return (
                        <Card key={g.id} className="relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold">{g.name}</h3>
                                    <p className="text-sm text-slate-400">Progresso: {formatMoney(g.currentAmount)} de {formatMoney(g.targetAmount)}</p>
                                </div>
                                <Target className="text-brand-500" size={24} />
                            </div>
                            <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden mb-2">
                                <div className="bg-brand-500 h-full transition-all duration-1000" style={{ width: `${percent}%` }} />
                            </div>
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                                <span>{Math.round(percent)}% concluído</span>
                                <span>Faltam {formatMoney(g.targetAmount - g.currentAmount)}</span>
                            </div>
                        </Card>
                    );
                })}
                <Card className="flex flex-col items-center justify-center border-dashed border-2 border-slate-800 hover:border-brand-500/50 transition-colors cursor-pointer min-h-[160px]">
                    <Plus size={32} className="text-slate-600 mb-2" />
                    <span className="text-slate-500 font-bold">Nova Meta</span>
                </Card>
            </div>
        </div>
    );
};

const PatrimonyView = ({ assets, setAssets, formatMoney }: any) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ name: '', value: '', type: 'Bank' as Asset['type'] });

    const total = assets.reduce((acc: number, a: any) => acc + a.value, 0);
    const pieData = assets.map((a: any) => ({ name: a.name, value: a.value }));

    const assetTypes: { label: string; value: Asset['type'] }[] = [
        { label: 'Banco', value: 'Bank' },
        { label: 'Investimento', value: 'Investment' },
        { label: 'Cripto', value: 'Crypto' },
        { label: 'FGTS', value: 'FGTS' },
        { label: 'Imóvel', value: 'RealEstate' },
        { label: 'Outro', value: 'Other' },
    ];

    const resetForm = () => {
        setForm({ name: '', value: '', type: 'Bank' });
        setIsEditing(false);
        setEditId(null);
    };

    const handleSave = () => {
        if (!form.name || !form.value) return;
        
        if (editId) {
            setAssets(assets.map((a: Asset) => a.id === editId ? { ...a, ...form, value: parseFloat(form.value) } : a));
        } else {
            const newAsset: Asset = {
                id: Date.now().toString(),
                name: form.name,
                value: parseFloat(form.value),
                type: form.type
            };
            setAssets([...assets, newAsset]);
        }
        resetForm();
    };

    const handleEdit = (asset: Asset) => {
        setForm({ name: asset.name, value: asset.value.toString(), type: asset.type });
        setEditId(asset.id);
        setIsEditing(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Deseja realmente excluir este ativo?')) {
            setAssets(assets.filter((a: Asset) => a.id !== id));
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <SectionHeader 
                title="Patrimônio" 
                subtitle={`Patrimônio Líquido Total: ${formatMoney(total)}`} 
                action={
                    !isEditing && (
                        <Button onClick={() => setIsEditing(true)}>
                            <Plus size={18} /> Novo Ativo
                        </Button>
                    )
                }
            />

            {isEditing && (
                <Card className="border-brand-500/30 animate-fade-in bg-slate-900/50">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">{editId ? 'Editar Ativo' : 'Novo Ativo'}</h3>
                        <Button variant="ghost" onClick={resetForm}><X size={20} /></Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input label="Nome do Ativo" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ex: Investimento X" />
                        <Input label="Valor" type="number" value={form.value} onChange={e => setForm({...form, value: e.target.value})} placeholder="0.00" />
                        <Select label="Tipo" value={form.type} onChange={e => setForm({...form, type: e.target.value as Asset['type']})} options={assetTypes} />
                    </div>
                    <div className="flex justify-end mt-4 gap-3">
                        <Button variant="secondary" onClick={resetForm}>Cancelar</Button>
                        <Button onClick={handleSave} className="min-w-[120px]">
                            <Save size={18} /> {editId ? 'Atualizar' : 'Salvar'}
                        </Button>
                    </div>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 h-80 flex flex-col items-center justify-center">
                    <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase self-start">Alocação</h3>
                    {assets.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {pieData.map((_: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-slate-600 italic text-sm">Nenhum dado para exibir</div>
                    )}
                </Card>
                
                <Card className="lg:col-span-2 space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase">Lista de Ativos</h3>
                    <div className="divide-y divide-slate-800">
                        {assets.length > 0 ? assets.map((a: Asset) => (
                            <div key={a.id} className="py-4 flex justify-between items-center group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-brand-400">
                                        <Landmark size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold">{a.name}</p>
                                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 uppercase tracking-tighter">{a.type}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="font-mono font-bold text-emerald-400">{formatMoney(a.value)}</p>
                                        <p className="text-[10px] text-slate-500">{((a.value/total)*100).toFixed(1)}%</p>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" className="p-2 h-auto" onClick={() => handleEdit(a)}>
                                            <Edit2 size={16} className="text-slate-400" />
                                        </Button>
                                        <Button variant="ghost" className="p-2 h-auto hover:bg-rose-500/10" onClick={() => handleDelete(a.id)}>
                                            <Trash2 size={16} className="text-rose-500" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="py-10 text-center text-slate-500">
                                <Landmark size={48} className="mx-auto mb-2 opacity-10" />
                                <p>Você ainda não cadastrou nenhum ativo.</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

// --- MAIN APP ---

export default function App() {
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [currency] = useState<Currency>('BRL');
  
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [shopping, setShopping] = useState<ShoppingTrip[]>(INITIAL_SHOPPING);

  const formatMoney = (amount: number) => {
      return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
          style: 'currency',
          currency: currency
      }).format(amount);
  };

  const renderContent = () => {
      switch (activeView) {
          case 'dashboard':
              return <DashboardView transactions={transactions} assets={assets} goals={goals} shopping={shopping} formatMoney={formatMoney} />;
          case 'earnings':
              return <EarningsView transactions={transactions} setTransactions={setTransactions} formatMoney={formatMoney} />;
          case 'expenses':
              return <ExpensesView transactions={transactions} setTransactions={setTransactions} formatMoney={formatMoney} />;
          case 'groceries':
              return <ShoppingView shopping={shopping} setShopping={setShopping} formatMoney={formatMoney} />;
          case 'goals':
              return <GoalsView goals={goals} setGoals={setGoals} formatMoney={formatMoney} />;
          case 'patrimony':
              return <PatrimonyView assets={assets} setAssets={setAssets} formatMoney={formatMoney} />;
          default:
              return (
                  <div className="py-20 text-center text-slate-500 animate-fade-in">
                      <LayoutGrid className="mx-auto mb-4 opacity-10" size={64} />
                      <p>View em construção...</p>
                      <Button onClick={() => setActiveView('dashboard')} className="mt-4" variant="secondary">Voltar ao Dashboard</Button>
                  </div>
              );
      }
  };

  return (
    <Layout activeView={activeView} onNavigate={setActiveView}>
      {renderContent()}
    </Layout>
  );
}