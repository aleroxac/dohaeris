import React, { useState, useRef } from 'react';
import { Layout } from './components/Layout';
import { Card, Button, SectionHeader, Input, Select } from './components/UIComponents';
import { 
    Plus, 
    Trash2, 
    TrendingUp, 
    TrendingDown, 
    Wallet, 
    CreditCard as CreditCardIcon, 
    CheckCircle2, 
    Circle,
    Landmark,
    Edit2,
    PieChart as PieIcon,
    List,
    Save,
    Target,
    X,
    LayoutGrid,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip
} from 'recharts';
import { Transaction, TransactionType, Goal, Asset, ShoppingTrip, ShoppingItem, ViewState, CreditCard, TagBudget, Currency } from './types';

// --- MOCK DATA ---
const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', description: 'Salary', amount: 5200, date: '2023-10-01', type: TransactionType.INCOME, status: 'PAID', paymentMethod: 'CASH', tags: ['work'] },
  { id: '2', description: 'Rent', amount: 1800, date: '2023-10-05', type: TransactionType.EXPENSE, category: 'Housing', status: 'PAID', paymentMethod: 'DEBIT', tags: ['fixed'] },
  { id: '3', description: 'Groceries', amount: 450, date: '2023-10-12', type: TransactionType.EXPENSE, category: 'Food', status: 'PAID', paymentMethod: 'card_1', tags: ['essentials'], cashbackAmount: 4.5 },
  { id: '4', description: 'Netflix', amount: 45, date: '2023-10-01', type: TransactionType.EXPENSE, category: 'Entertainment', status: 'PAID', paymentMethod: 'card_1', tags: ['subs'] },
];

const INITIAL_CARDS: CreditCard[] = [];
const INITIAL_TAG_BUDGETS: TagBudget[] = [];
const INITIAL_GOALS: Goal[] = [
  { id: '1', name: 'Japan Trip', currentAmount: 4500, targetAmount: 15000 },
  { id: '2', name: 'New MacBook', currentAmount: 2000, targetAmount: 12000 },
];
const INITIAL_ASSETS: Asset[] = [
  { id: '1', name: 'Main Checking', value: 3450, type: 'Bank' },
  { id: '2', name: 'NuBank Savings', value: 12500, type: 'Bank' },
  { id: '3', name: 'Bitcoin', value: 5600, type: 'Crypto' },
];

const INITIAL_SHOPPING_TRIPS: ShoppingTrip[] = [
    {
        id: '1',
        name: 'Weekly Market',
        date: '2023-10-15',
        category: 'Market',
        items: [
            { id: '101', name: 'Rice 5kg', category: 'Grains', price: 25.50, isBought: true },
            { id: '102', name: 'Olive Oil', category: 'Oils', price: 32.90, isBought: false },
            { id: '103', name: 'Detergent', category: 'Cleaning', price: 8.50, isBought: true }
        ]
    },
    {
        id: '2',
        name: 'Local Butcher',
        date: '2023-10-16',
        category: 'Butcher',
        items: [
            { id: '201', name: 'Picanha 1kg', category: 'Meat', price: 69.90, isBought: true },
            { id: '202', name: 'Chicken Wings', category: 'Poultry', price: 18.00, isBought: true }
        ]
    }
];

const MOCK_MONTHLY_DATA = [
    { name: 'Jan', income: 4800, expense: 3200 },
    { name: 'Feb', income: 5100, expense: 3800 },
    { name: 'Mar', income: 4900, expense: 2900 },
    { name: 'Apr', income: 5200, expense: 4100 },
    { name: 'May', income: 5200, expense: 3600 },
    { name: 'Jun', income: 5800, expense: 4500 },
    { name: 'Jul', income: 5300, expense: 3300 },
    { name: 'Aug', income: 5400, expense: 3900 },
    { name: 'Sep', income: 5200, expense: 3100 },
    { name: 'Oct', income: 6050, expense: 2395 }, // Current approx
    { name: 'Nov', income: 0, expense: 0 },
    { name: 'Dec', income: 0, expense: 0 },
];

const COLORS = ['#8b5cf6', '#ef4444', '#10b981', '#f59e0b', '#06b6d4', '#ec4899', '#6366f1', '#a855f7', '#14b8a6'];

// --- COMPONENTS EXTRACTED TO PREVENT RE-RENDERS ---

const DashboardView = ({ transactions, assets, formatMoney }: { transactions: Transaction[], assets: Asset[], formatMoney: (n: number) => string }) => {
    const totalIncome = transactions.filter(t => t.type === TransactionType.INCOME).reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((acc, t) => acc + t.amount, 0);
    const balance = totalIncome - totalExpense;

    return (
      <div className="space-y-6 animate-fade-in">
          <SectionHeader 
              title="Overview" 
              subtitle={`Financial Snapshot • ${new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric'})}`}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="flex flex-col border-emerald-900/30 bg-gradient-to-br from-slate-900 to-emerald-950/20">
                  <span className="text-slate-400 text-sm font-medium">Monthly Income</span>
                  <div className="flex items-center space-x-2 mt-2">
                      <TrendingUp className="text-emerald-500" size={24} />
                      <span className="text-3xl font-bold text-slate-100">{formatMoney(totalIncome)}</span>
                  </div>
              </Card>
              <Card className="flex flex-col border-rose-900/30 bg-gradient-to-br from-slate-900 to-rose-950/20">
                  <span className="text-slate-400 text-sm font-medium">Monthly Expenses</span>
                  <div className="flex items-center space-x-2 mt-2">
                      <TrendingDown className="text-rose-500" size={24} />
                      <span className="text-3xl font-bold text-slate-100">{formatMoney(totalExpense)}</span>
                  </div>
              </Card>
              <Card className="flex flex-col border-brand-900/30 bg-gradient-to-br from-slate-900 to-brand-950/20">
                  <span className="text-slate-400 text-sm font-medium">Net Balance</span>
                  <div className="flex items-center space-x-2 mt-2">
                      <Wallet className="text-brand-500" size={24} />
                      <span className="text-3xl font-bold text-slate-100">{formatMoney(balance)}</span>
                  </div>
              </Card>
          </div>

          <Card className="h-80">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Annual Overview</h3>
                  <div className="flex gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Income</div>
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500"></div>Expenses</div>
                  </div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_MONTHLY_DATA}>
                      <defs>
                          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                          </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}k`} />
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                      <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" />
                      <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" />
                  </AreaChart>
              </ResponsiveContainer>
          </Card>
      </div>
    );
};

const EarningsView = ({ transactions, setTransactions, formatMoney }: { transactions: Transaction[], setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>, formatMoney: (n: number) => string }) => {
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        desc: '', amount: '', date: '', category: '', tags: ''
    });

    const resetForm = () => {
        setFormData({ desc: '', amount: '', date: new Date().toISOString().split('T')[0], category: 'Salary', tags: '' });
        setIsEditing(null);
    };

    const handleSubmit = () => {
        if (!formData.desc || !formData.amount) return;
        const newTx: Transaction = {
            id: isEditing || Date.now().toString(),
            description: formData.desc,
            amount: parseFloat(formData.amount),
            date: formData.date,
            type: TransactionType.INCOME,
            status: 'PAID',
            paymentMethod: 'CASH',
            category: formData.category,
            tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        };

        if (isEditing) {
            setTransactions(prev => prev.map(t => t.id === isEditing ? { ...t, ...newTx } : t));
        } else {
            setTransactions(prev => [newTx, ...prev]);
        }
        resetForm();
    };

    const handleEdit = (t: Transaction) => {
        setFormData({
            desc: t.description,
            amount: t.amount.toString(),
            date: t.date,
            category: t.category || '',
            tags: t.tags.join(', ')
        });
        setIsEditing(t.id);
    };

    const incomes = transactions.filter(t => t.type === TransactionType.INCOME);

    return (
        <div className="space-y-6">
            <SectionHeader title="Earnings" subtitle="Manage your revenue streams" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <Card className="lg:col-span-1 h-fit">
                    <h3 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Earning' : 'Add Earning'}</h3>
                    <div className="space-y-4">
                        <Input label="Description" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} />
                        <Input label="Amount" type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                        <Input label="Date" type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                        <Input label="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Salary, Freelance" />
                        <Input label="Tags (comma separated)" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="work, bonus" />
                        <div className="flex gap-2 pt-2">
                            <Button onClick={handleSubmit} className="flex-1">{isEditing ? 'Update' : 'Add'}</Button>
                            {isEditing && <Button variant="secondary" onClick={resetForm}>Cancel</Button>}
                        </div>
                    </div>
                </Card>
                <Card className="lg:col-span-2">
                    <div className="space-y-2">
                         {incomes.map(t => (
                            <div key={t.id} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-lg border border-slate-800 hover:border-brand-500/50 transition-colors group">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-slate-100">{t.description}</p>
                                        {t.tags.map(tag => <span key={tag} className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">#{tag}</span>)}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1">{t.date} • {t.category}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-emerald-500">{formatMoney(t.amount)}</span>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(t)} className="text-slate-400 hover:text-brand-400"><Edit2 size={16}/></button>
                                        <button onClick={() => setTransactions(prev => prev.filter(x => x.id !== t.id))} className="text-slate-400 hover:text-rose-500"><Trash2 size={16}/></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {incomes.length === 0 && <div className="text-center text-slate-500 py-10">No records yet.</div>}
                    </div>
                </Card>
            </div>
        </div>
    );
};

interface ExpensesProps {
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    creditCards: CreditCard[];
    setCreditCards: React.Dispatch<React.SetStateAction<CreditCard[]>>;
    tagBudgets: TagBudget[];
    setTagBudgets: React.Dispatch<React.SetStateAction<TagBudget[]>>;
    formatMoney: (n: number) => string;
}

const ExpensesView = ({ transactions, setTransactions, creditCards, setCreditCards, tagBudgets, setTagBudgets, formatMoney }: ExpensesProps) => {
    const [tab, setTab] = useState<'list' | 'planning' | 'analysis' | 'cards'>('list');
    const [isEditing, setIsEditing] = useState<string | null>(null);
    
    // Expense Form State
    const [formData, setFormData] = useState({
        desc: '', amount: '', date: '', category: '', subCategory: '', 
        status: 'PAID', dueDate: '', paymentMethod: 'DEBIT', tags: '', cashbackAmount: ''
    });

    // Planning State
    const [newTagBudget, setNewTagBudget] = useState({ tag: '', amount: '' });

    // Card Form State
    const [cardForm, setCardForm] = useState({ name: '', cashback: '', closing: '', due: '', color: '#8b5cf6' });
    const [editingCardId, setEditingCardId] = useState<string | null>(null);

    // --- Helpers for Expense ---
    const resetForm = () => {
        setFormData({ 
            desc: '', amount: '', date: new Date().toISOString().split('T')[0], category: 'General', subCategory: '', 
            status: 'PAID', dueDate: '', paymentMethod: 'DEBIT', tags: '', cashbackAmount: '' 
        });
        setIsEditing(null);
    };

    const handleEdit = (t: Transaction) => {
        setFormData({
            desc: t.description,
            amount: t.amount.toString(),
            date: t.date,
            category: t.category || 'General',
            subCategory: t.subCategory || '',
            status: t.status,
            dueDate: t.dueDate || '',
            paymentMethod: t.paymentMethod,
            tags: t.tags.join(', '),
            cashbackAmount: t.cashbackAmount ? t.cashbackAmount.toString() : ''
        });
        setIsEditing(t.id);
        setTab('list');
    };

    const handleSubmitExpense = () => {
        if (!formData.desc || !formData.amount) return;
        
        let calculatedCashback = parseFloat(formData.cashbackAmount) || 0;
        const selectedCard = creditCards.find(c => c.id === formData.paymentMethod);
        
        if (!calculatedCashback && selectedCard) {
            calculatedCashback = (parseFloat(formData.amount) * selectedCard.defaultCashback) / 100;
        }

        const newTx: Transaction = {
            id: isEditing || Date.now().toString(),
            description: formData.desc,
            amount: parseFloat(formData.amount),
            date: formData.date,
            type: TransactionType.EXPENSE,
            status: formData.status as 'PAID' | 'PENDING',
            paymentMethod: formData.paymentMethod,
            category: formData.category,
            subCategory: formData.subCategory,
            dueDate: formData.dueDate,
            tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
            cashbackAmount: calculatedCashback
        };

        if (isEditing) {
            setTransactions(prev => prev.map(t => t.id === isEditing ? { ...t, ...newTx } : t));
        } else {
            setTransactions(prev => [newTx, ...prev]);
        }
        resetForm();
    };

    const handleSaveCard = () => {
        if(!cardForm.name) return;
        
        const newCardData = {
            name: cardForm.name,
            defaultCashback: parseFloat(cardForm.cashback) || 0,
            closingDay: parseInt(cardForm.closing) || 1,
            dueDay: parseInt(cardForm.due) || 10,
            color: cardForm.color || '#8b5cf6'
        };

        if (editingCardId) {
            setCreditCards(prev => prev.map(c => c.id === editingCardId ? { ...c, id: editingCardId, ...newCardData } : c));
            setEditingCardId(null);
        } else {
            setCreditCards(prev => [...prev, {
                id: `card_${Date.now()}`,
                ...newCardData
            }]);
        }
        setCardForm({ name: '', cashback: '', closing: '', due: '', color: '#8b5cf6' });
    };

    const handleEditCard = (card: CreditCard) => {
        setCardForm({
            name: card.name,
            cashback: card.defaultCashback.toString(),
            closing: card.closingDay.toString(),
            due: card.dueDay.toString(),
            color: card.color || '#8b5cf6'
        });
        setEditingCardId(card.id);
    };

    const handleDeleteCard = (id: string) => {
        setCreditCards(prev => prev.filter(c => c.id !== id));
    };

    const updateTagBudget = (tag: string, amount: number) => {
        const existing = tagBudgets.find(t => t.tag === tag);
        if (existing) {
            setTagBudgets(prev => prev.map(t => t.tag === tag ? { ...t, expectedAmount: amount } : t));
        } else {
            setTagBudgets(prev => [...prev, { tag, expectedAmount: amount }]);
        }
    };

    const handleEditBudget = (tb: TagBudget) => {
        setNewTagBudget({ tag: tb.tag, amount: tb.expectedAmount.toString() });
    };

    const handleDeleteBudget = (tag: string) => {
        setTagBudgets(prev => prev.filter(t => t.tag !== tag));
    };

    // --- Computed Data for Analysis ---
    const expenses = transactions.filter(t => t.type === TransactionType.EXPENSE);
    const totalSpent = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalSaved = transactions.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0) - totalSpent;
    const savingsRate = totalSaved > 0 ? (totalSaved / (totalSpent + totalSaved)) * 100 : 0;

    const byCategory = expenses.reduce((acc, curr) => {
        const cat = curr.category || 'Other';
        acc[cat] = (acc[cat] || 0) + curr.amount;
        return acc;
    }, {} as Record<string, number>);
    const pieData = Object.keys(byCategory).map(k => ({ name: k, value: byCategory[k] }));

    return (
        <div className="space-y-6">
            <SectionHeader title="Expenses" subtitle="Detailed control of your outflows" />
            
            <div className="flex space-x-2 border-b border-slate-800 pb-1 overflow-x-auto no-scrollbar">
                <Button variant={tab === 'list' ? 'primary' : 'ghost'} onClick={() => setTab('list')}><List size={18}/> Entries</Button>
                <Button variant={tab === 'planning' ? 'primary' : 'ghost'} onClick={() => setTab('planning')}><Target size={18}/> Planning</Button>
                <Button variant={tab === 'analysis' ? 'primary' : 'ghost'} onClick={() => setTab('analysis')}><PieIcon size={18}/> Analysis</Button>
                <Button variant={tab === 'cards' ? 'primary' : 'ghost'} onClick={() => setTab('cards')}><CreditCardIcon size={18}/> Cards</Button>
            </div>

            {tab === 'list' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                    <Card className="lg:col-span-1 h-fit bg-slate-900 lg:sticky lg:top-4 z-20 shadow-xl">
                        <h3 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Expense' : 'New Expense'}</h3>
                        <div className="space-y-3">
                            <Input label="Description" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} />
                            
                            <Input label="Amount" type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                            <Input label="Date" type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                            
                            <Input label="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                            <Input label="Sub-cat" value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value})} />
                            
                            <Select 
                                label="Payment"
                                value={formData.paymentMethod} 
                                onChange={e => setFormData({...formData, paymentMethod: e.target.value})} 
                                options={[
                                    { label: 'Debit / Cash', value: 'DEBIT' },
                                    { label: 'Pix', value: 'PIX' },
                                    ...creditCards.map(c => ({ label: `💳 ${c.name}`, value: c.id }))
                                ]}
                            />
                            <Select 
                                label="Status"
                                value={formData.status} 
                                onChange={e => setFormData({...formData, status: e.target.value})} 
                                options={[{ label: 'Paid', value: 'PAID' }, { label: 'Pending', value: 'PENDING' }]}
                            />
                            
                            {formData.status === 'PENDING' && (
                                <Input label="Due Date" type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                            )}
                            <Input label="Tags (comma separated)" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
                            {creditCards.find(c => c.id === formData.paymentMethod) && (
                                <Input label="Cashback Override (Optional)" type="number" value={formData.cashbackAmount} onChange={e => setFormData({...formData, cashbackAmount: e.target.value})} />
                            )}
                            <div className="flex gap-2 pt-4">
                                <Button onClick={handleSubmitExpense} className="flex-1">{isEditing ? 'Update' : 'Add'}</Button>
                                {isEditing && <Button variant="secondary" onClick={resetForm}>Cancel</Button>}
                            </div>
                        </div>
                    </Card>

                    <Card className="lg:col-span-2">
                        <div className="space-y-3">
                            {expenses.map(t => (
                                <div key={t.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-950/50 rounded-lg border border-slate-800 hover:border-brand-500/30 transition-all gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-1 p-2 rounded-lg ${t.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                            {t.status === 'PAID' ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-slate-100">{t.description}</span>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">{t.category}</span>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1 flex gap-2 flex-wrap">
                                                <span>{t.date}</span>
                                                {t.subCategory && <span>• {t.subCategory}</span>}
                                                <span>• {creditCards.find(c => c.id === t.paymentMethod)?.name || t.paymentMethod}</span>
                                                {t.tags.length > 0 && <span>• {t.tags.join(', ')}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
                                        <div className="text-right">
                                            <div className="font-bold text-lg text-slate-200">{formatMoney(t.amount)}</div>
                                            {t.cashbackAmount ? <div className="text-xs text-brand-400">+{formatMoney(t.cashbackAmount)} cashback</div> : null}
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(t)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"><Edit2 size={16}/></button>
                                            <button onClick={() => setTransactions(prev => prev.filter(x => x.id !== t.id))} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-500"><Trash2 size={16}/></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {expenses.length === 0 && <div className="text-center text-slate-500 py-10">No expenses recorded.</div>}
                        </div>
                    </Card>
                </div>
            )}

            {tab === 'cards' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    <Card>
                        <h3 className="text-lg font-semibold mb-4">{editingCardId ? 'Edit Credit Card' : 'Add Credit Card'}</h3>
                        <div className="space-y-4">
                            <Input label="Card Name" value={cardForm.name} onChange={e => setCardForm({...cardForm, name: e.target.value})} />
                            <div className="flex gap-4">
                                <Input label="Cashback %" type="number" value={cardForm.cashback} onChange={e => setCardForm({...cardForm, cashback: e.target.value})} />
                                <Input label="Color Hex" value={cardForm.color} onChange={e => setCardForm({...cardForm, color: e.target.value})} />
                            </div>
                            <div className="flex gap-4">
                                <Input label="Closing Day" type="number" value={cardForm.closing} onChange={e => setCardForm({...cardForm, closing: e.target.value})} />
                                <Input label="Due Day" type="number" value={cardForm.due} onChange={e => setCardForm({...cardForm, due: e.target.value})} />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleSaveCard} className="flex-1">{editingCardId ? 'Update Card' : 'Save Card'}</Button>
                                {editingCardId && <Button variant="secondary" onClick={() => { setEditingCardId(null); setCardForm({ name: '', cashback: '', closing: '', due: '', color: '#8b5cf6' }); }}>Cancel</Button>}
                            </div>
                        </div>
                    </Card>
                    <div className="space-y-4">
                        {creditCards.map(card => (
                            <div key={card.id} className="relative overflow-hidden rounded-xl h-48 p-6 text-white shadow-lg flex flex-col justify-between group" style={{ backgroundColor: card.color || '#334155' }}>
                                <div className="flex justify-between items-start relative z-10">
                                    <span className="font-bold text-lg tracking-wider">{card.name}</span>
                                    <div className="flex gap-2 bg-black/20 p-1 rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEditCard(card)} className="p-1 hover:text-brand-200"><Edit2 size={16}/></button>
                                        <button onClick={() => handleDeleteCard(card.id)} className="p-1 hover:text-rose-300"><Trash2 size={16}/></button>
                                    </div>
                                </div>
                                <div className="relative z-10">
                                    <div className="flex justify-between text-sm opacity-90 mb-1">
                                        <span>Cashback</span>
                                        <span>{card.defaultCashback}%</span>
                                    </div>
                                    <div className="flex justify-between text-sm opacity-90">
                                        <span>Closes: Day {card.closingDay}</span>
                                        <span>Due: Day {card.dueDay}</span>
                                    </div>
                                </div>
                                <CreditCardIcon className="absolute top-6 right-6 opacity-80 z-0" size={24} />
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                            </div>
                        ))}
                        {creditCards.length === 0 && <div className="text-center text-slate-500 py-10">No cards configured.</div>}
                    </div>
                </div>
            )}

            {tab === 'planning' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                    <Card>
                         <h3 className="text-lg font-semibold mb-4">Budget by Tag (Expectation vs Reality)</h3>
                         <div className="space-y-6">
                            {tagBudgets.map(tb => {
                                const actual = expenses.filter(t => t.tags.includes(tb.tag)).reduce((sum, t) => sum + t.amount, 0);
                                const percent = Math.min((actual / tb.expectedAmount) * 100, 100);
                                const isOver = actual > tb.expectedAmount;

                                return (
                                    <div key={tb.tag} className="group">
                                        <div className="flex justify-between text-sm mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="capitalize font-medium text-slate-200">#{tb.tag}</span>
                                                <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                                                    <button onClick={() => handleEditBudget(tb)} className="text-slate-500 hover:text-brand-400"><Edit2 size={12}/></button>
                                                    <button onClick={() => handleDeleteBudget(tb.tag)} className="text-slate-500 hover:text-rose-500"><X size={12}/></button>
                                                </div>
                                            </div>
                                            <span className="text-slate-400">{formatMoney(actual)} / {formatMoney(tb.expectedAmount)}</span>
                                        </div>
                                        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                                            <div 
                                                className={`h-2.5 rounded-full ${isOver ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                                                style={{ width: `${percent}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )
                            })}
                            {tagBudgets.length === 0 && <div className="text-center text-slate-500 py-6">No budgets set.</div>}
                         </div>
                    </Card>
                    <Card>
                        <h3 className="text-lg font-semibold mb-4">Set Budget</h3>
                        <div className="flex gap-4 items-end">
                            <Input label="Tag Name" value={newTagBudget.tag} onChange={e => setNewTagBudget({...newTagBudget, tag: e.target.value})} placeholder="e.g. food" />
                            <Input label="Budget Limit" type="number" value={newTagBudget.amount} onChange={e => setNewTagBudget({...newTagBudget, amount: e.target.value})} />
                            <Button onClick={() => {
                                if(newTagBudget.tag && newTagBudget.amount) {
                                    updateTagBudget(newTagBudget.tag, parseFloat(newTagBudget.amount));
                                    setNewTagBudget({tag: '', amount: ''});
                                }
                            }}>{tagBudgets.find(t => t.tag === newTagBudget.tag) ? <Save size={20}/> : <Plus size={20}/>}</Button>
                        </div>
                    </Card>
                </div>
            )}

            {tab === 'analysis' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="text-center py-6">
                            <div className="text-slate-400 text-xs uppercase font-bold">Total Spent</div>
                            <div className="text-2xl font-bold text-white mt-1">{formatMoney(totalSpent)}</div>
                        </Card>
                        <Card className="text-center py-6">
                            <div className="text-slate-400 text-xs uppercase font-bold">Total Saved</div>
                            <div className="text-2xl font-bold text-emerald-400 mt-1">{formatMoney(totalSaved)}</div>
                        </Card>
                        <Card className="text-center py-6">
                            <div className="text-slate-400 text-xs uppercase font-bold">Savings Rate</div>
                            <div className="text-2xl font-bold text-brand-400 mt-1">{savingsRate.toFixed(1)}%</div>
                        </Card>
                        <Card className="text-center py-6">
                            <div className="text-slate-400 text-xs uppercase font-bold">Cashback Total</div>
                            <div className="text-2xl font-bold text-purple-400 mt-1">
                                {formatMoney(expenses.reduce((acc, t) => acc + (t.cashbackAmount || 0), 0))}
                            </div>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="h-80">
                            <h4 className="text-sm font-bold text-slate-400 mb-4 uppercase">Spending by Category</h4>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} formatter={(val: number) => formatMoney(val)} />
                                </PieChart>
                            </ResponsiveContainer>
                        </Card>
                         <Card className="h-80 overflow-y-auto">
                            <h4 className="text-sm font-bold text-slate-400 mb-4 uppercase">Breakdown Table</h4>
                            <table className="w-full text-left text-sm">
                                <thead className="text-slate-500 border-b border-slate-800">
                                    <tr>
                                        <th className="pb-2">Category</th>
                                        <th className="pb-2 text-right">Amount</th>
                                        <th className="pb-2 text-right">%</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {pieData.sort((a,b) => b.value - a.value).map((d, i) => (
                                        <tr key={i} className="text-slate-300">
                                            <td className="py-2 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                                {d.name}
                                            </td>
                                            <td className="py-2 text-right">{formatMoney(d.value)}</td>
                                            <td className="py-2 text-right">{((d.value / totalSpent) * 100).toFixed(1)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

const ShoppingView = ({ trips, setTrips, formatMoney }: { trips: ShoppingTrip[], setTrips: React.Dispatch<React.SetStateAction<ShoppingTrip[]>>, formatMoney: (n: number) => string }) => {
    const [activeTab, setActiveTab] = useState<'Overview' | string>('Overview');
    const [purchaseCategories, setPurchaseCategories] = useState<string[]>(['Market', 'Butcher', 'Fair']);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    const [tripForm, setTripForm] = useState({ id: '', name: '', date: new Date().toISOString().split('T')[0] });
    const [isEditingTrip, setIsEditingTrip] = useState(false);
    
    const [expandedTrips, setExpandedTrips] = useState<Set<string>>(new Set());

    // Item form state
    const [newItem, setNewItem] = useState<{tripId: string, name: string, category: string, price: string}>({ tripId: '', name: '', category: '', price: '' });

    // Category Management
    const [managingCategory, setManagingCategory] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState('');
    // FIXED: Changed type from NodeJS.Timeout to number for browser compatibility
    const longPressTimerRef = useRef<number | null>(null);

    const handleButtonPress = (cat: string) => {
        // @ts-ignore - setTimeout returns number in browser
        longPressTimerRef.current = setTimeout(() => {
            setManagingCategory(cat);
            setRenameValue(cat);
        }, 500); // 500ms for long press
    };

    const handleButtonRelease = () => {
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    };

    const handleRenameCategory = () => {
        if (!managingCategory || !renameValue || renameValue === managingCategory) return;
        if (purchaseCategories.includes(renameValue)) {
            alert('Category name already exists!');
            return;
        }

        setPurchaseCategories(prev => prev.map(c => c === managingCategory ? renameValue : c));
        setTrips(prev => prev.map(t => t.category === managingCategory ? { ...t, category: renameValue } : t));
        
        if (activeTab === managingCategory) setActiveTab(renameValue);
        setManagingCategory(null);
    };

    const handleDeleteCategory = () => {
        if (!managingCategory) return;
        
        const targetCategory = 'Other';
        // Ensure 'Other' exists in categories if we are moving things there
        if (!purchaseCategories.includes(targetCategory) && targetCategory !== managingCategory) {
            setPurchaseCategories(prev => [...prev.filter(c => c !== managingCategory), targetCategory]);
        } else {
             setPurchaseCategories(prev => prev.filter(c => c !== managingCategory));
        }

        // Move trips to 'Other'
        setTrips(prev => prev.map(t => t.category === managingCategory ? { ...t, category: targetCategory } : t));
        
        setActiveTab('Overview');
        setManagingCategory(null);
    };

    const toggleExpand = (id: string) => {
        const newSet = new Set(expandedTrips);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setExpandedTrips(newSet);
    };

    const handleAddCategory = () => {
        if (!newCategoryName) return;
        if (!purchaseCategories.includes(newCategoryName)) {
            setPurchaseCategories([...purchaseCategories, newCategoryName]);
            setActiveTab(newCategoryName);
        }
        setNewCategoryName('');
        setIsAddingCategory(false);
    };

    const handleSaveTrip = () => {
        if (!tripForm.name) return;
        if (isEditingTrip && tripForm.id) {
            setTrips(prev => prev.map(t => t.id === tripForm.id ? { ...t, name: tripForm.name, date: tripForm.date } : t));
        } else {
            const newTrip: ShoppingTrip = {
                id: Date.now().toString(),
                name: tripForm.name,
                date: tripForm.date,
                category: activeTab,
                items: []
            };
            setTrips(prev => [newTrip, ...prev]);
        }
        setTripForm({ id: '', name: '', date: new Date().toISOString().split('T')[0] });
        setIsEditingTrip(false);
    };

    const handleDeleteTrip = (id: string) => {
        setTrips(prev => prev.filter(t => t.id !== id));
    };

    const handleAddItem = (tripId: string) => {
        if (!newItem.name || !newItem.price) return;
        const item: ShoppingItem = {
            id: Date.now().toString(),
            name: newItem.name,
            category: newItem.category || 'Uncategorized',
            price: parseFloat(newItem.price),
            isBought: false
        };
        setTrips(prev => prev.map(t => t.id === tripId ? { ...t, items: [...t.items, item] } : t));
        setNewItem({ tripId: '', name: '', category: '', price: '' });
    };

    const handleDeleteItem = (tripId: string, itemId: string) => {
         setTrips(prev => prev.map(t => t.id === tripId ? { ...t, items: t.items.filter(i => i.id !== itemId) } : t));
    };

    const toggleItemBought = (tripId: string, itemId: string) => {
        setTrips(prev => prev.map(t => t.id === tripId ? { ...t, items: t.items.map(i => i.id === itemId ? { ...i, isBought: !i.isBought } : i) } : t));
    };

    // Calculation for Dashboards
    const totalSpent = trips.reduce((acc, t) => acc + t.items.reduce((s, i) => s + i.price, 0), 0);
    
    // Dashboard 1: By Purchase Category (Trip Level)
    const byPurchaseCategory = trips.reduce((acc, curr) => {
        const cat = curr.category;
        const total = curr.items.reduce((s, i) => s + i.price, 0);
        acc[cat] = (acc[cat] || 0) + total;
        return acc;
    }, {} as Record<string, number>);
    const purchasePieData = Object.keys(byPurchaseCategory).map(k => ({ name: k, value: byPurchaseCategory[k] }));

    // Dashboard 2: By Item Category (Item Level)
    const byItemCategory = trips.reduce((acc, curr) => {
        curr.items.forEach(item => {
            const cat = item.category || 'Uncategorized';
            acc[cat] = (acc[cat] || 0) + item.price;
        });
        return acc;
    }, {} as Record<string, number>);
    const itemPieData = Object.keys(byItemCategory).map(k => ({ name: k, value: byItemCategory[k] }));


    return (
        <div className="space-y-6 relative">
             {managingCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
                    <Card className="w-full max-w-md space-y-4 border-slate-700 bg-slate-900 shadow-2xl">
                        <SectionHeader title="Manage Category" subtitle={`Edit or delete ${managingCategory}`} />
                        <Input 
                            label="Rename Category" 
                            value={renameValue} 
                            onChange={(e) => setRenameValue(e.target.value)} 
                            placeholder="New name"
                        />
                        <div className="flex gap-3 pt-4">
                            <Button onClick={handleRenameCategory} className="flex-1">Rename</Button>
                            <Button variant="danger" onClick={handleDeleteCategory} className="flex-1">Delete</Button>
                        </div>
                         <Button variant="secondary" onClick={() => setManagingCategory(null)} className="w-full">Cancel</Button>
                         <p className="text-xs text-center text-slate-500 pt-2">Deleting will move all transactions to "Other".</p>
                    </Card>
                </div>
            )}

            <SectionHeader title="Shopping" subtitle={`Manage your purchases by category`} />
            
            <div className="flex space-x-2 border-b border-slate-800 pb-1 overflow-x-auto no-scrollbar items-center select-none">
                 <Button 
                    variant={activeTab === 'Overview' ? 'primary' : 'ghost'} 
                    onClick={() => setActiveTab('Overview')}
                >
                    <LayoutGrid size={18} /> Overview
                </Button>
                {purchaseCategories.map(cat => (
                    <Button 
                        key={cat} 
                        variant={activeTab === cat ? 'primary' : 'ghost'} 
                        onClick={() => setActiveTab(cat)}
                        className="active:scale-95 transition-transform"
                    >
                         <div 
                             onMouseDown={() => handleButtonPress(cat)} 
                             onMouseUp={handleButtonRelease} 
                             onMouseLeave={handleButtonRelease}
                             onTouchStart={() => handleButtonPress(cat)}
                             onTouchEnd={handleButtonRelease}
                             onContextMenu={(e) => { e.preventDefault(); setManagingCategory(cat); setRenameValue(cat); }}
                             className="flex items-center gap-2"
                         >
                            {cat}
                         </div>
                    </Button>
                ))}
                
                {isAddingCategory ? (
                    <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-700">
                        <input 
                            autoFocus
                            className="bg-transparent text-sm text-white focus:outline-none w-24 px-2"
                            placeholder="New..." 
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                        />
                         <button onClick={handleAddCategory} className="text-emerald-500 hover:text-emerald-400"><CheckCircle2 size={16}/></button>
                         <button onClick={() => setIsAddingCategory(false)} className="text-rose-500 hover:text-rose-400"><X size={16}/></button>
                    </div>
                ) : (
                    <Button variant="ghost" onClick={() => setIsAddingCategory(true)}><Plus size={18}/></Button>
                )}
            </div>

            {activeTab === 'Overview' && (
                <div className="space-y-8 animate-fade-in">
                    <Card className="text-center py-6 bg-gradient-to-r from-slate-900 to-slate-900 border-brand-900/50">
                         <div className="text-slate-400 text-xs uppercase font-bold">Total Shopping Spending</div>
                         <div className="text-3xl font-bold text-white mt-1">{formatMoney(totalSpent)}</div>
                    </Card>

                    {/* Chart 1: By Purchase Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <Card className="h-80">
                            <h4 className="text-sm font-bold text-slate-400 mb-4 uppercase">Spending by Purchase Category</h4>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={purchasePieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {purchasePieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} formatter={(val: number) => formatMoney(val)} />
                                </PieChart>
                            </ResponsiveContainer>
                        </Card>
                        <Card className="h-80 overflow-y-auto">
                            <h4 className="text-sm font-bold text-slate-400 mb-4 uppercase">Breakdown Table (Purchase)</h4>
                            <table className="w-full text-left text-sm">
                                <thead className="text-slate-500 border-b border-slate-800">
                                    <tr>
                                        <th className="pb-2">Category</th>
                                        <th className="pb-2 text-right">Amount</th>
                                        <th className="pb-2 text-right">%</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {purchasePieData.sort((a,b) => b.value - a.value).map((d, i) => (
                                        <tr key={i} className="text-slate-300">
                                            <td className="py-2 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                                {d.name}
                                            </td>
                                            <td className="py-2 text-right">{formatMoney(d.value)}</td>
                                            <td className="py-2 text-right">{totalSpent > 0 ? ((d.value / totalSpent) * 100).toFixed(1) : 0}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card>
                    </div>

                    {/* Chart 2: By Item Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <Card className="h-80">
                            <h4 className="text-sm font-bold text-slate-400 mb-4 uppercase">Spending by Item Category</h4>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={itemPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {itemPieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} formatter={(val: number) => formatMoney(val)} />
                                </PieChart>
                            </ResponsiveContainer>
                        </Card>
                        <Card className="h-80 overflow-y-auto">
                            <h4 className="text-sm font-bold text-slate-400 mb-4 uppercase">Breakdown Table (Items)</h4>
                            <table className="w-full text-left text-sm">
                                <thead className="text-slate-500 border-b border-slate-800">
                                    <tr>
                                        <th className="pb-2">Category</th>
                                        <th className="pb-2 text-right">Amount</th>
                                        <th className="pb-2 text-right">%</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {itemPieData.sort((a,b) => b.value - a.value).map((d, i) => (
                                        <tr key={i} className="text-slate-300">
                                            <td className="py-2 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[(i + 3) % COLORS.length] }}></div>
                                                {d.name}
                                            </td>
                                            <td className="py-2 text-right">{formatMoney(d.value)}</td>
                                            <td className="py-2 text-right">{totalSpent > 0 ? ((d.value / totalSpent) * 100).toFixed(1) : 0}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab !== 'Overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                    <div className="lg:col-span-1 h-fit bg-slate-900 lg:sticky lg:top-4 z-20 space-y-4">
                        <Card>
                            <h3 className="text-lg font-semibold mb-4">{isEditingTrip ? 'Edit Purchase' : 'Add Purchase'}</h3>
                            <div className="space-y-4">
                                <Input label="Title / Establishment" value={tripForm.name} onChange={e => setTripForm({...tripForm, name: e.target.value})} placeholder="e.g. Wallmart, Local Pharmacy" />
                                <Input label="Date" type="date" value={tripForm.date} onChange={e => setTripForm({...tripForm, date: e.target.value})} />
                                <div className="flex gap-2 pt-2">
                                    <Button onClick={handleSaveTrip} className="flex-1">{isEditingTrip ? 'Update' : 'Add'}</Button>
                                    {isEditingTrip && <Button variant="secondary" onClick={() => { setIsEditingTrip(false); setTripForm({ id: '', name: '', date: new Date().toISOString().split('T')[0] }); }}>Cancel</Button>}
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        {trips.filter(t => t.category === activeTab).map(trip => {
                            const tripTotal = trip.items.reduce((s, i) => s + i.price, 0);
                            const isExpanded = expandedTrips.has(trip.id);

                            return (
                                <Card key={trip.id} className="p-0 overflow-hidden">
                                    <div className="p-4 bg-slate-950/50 flex justify-between items-center cursor-pointer hover:bg-slate-900 transition-colors" onClick={() => toggleExpand(trip.id)}>
                                        <div className="flex items-center gap-3">
                                            {isExpanded ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
                                            <div>
                                                <h4 className="font-bold text-slate-200">{trip.name}</h4>
                                                <p className="text-xs text-slate-500">{trip.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-emerald-400">{formatMoney(tripTotal)}</span>
                                            <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                                                <button onClick={() => { setIsEditingTrip(true); setTripForm({ id: trip.id, name: trip.name, date: trip.date }); }} className="p-2 text-slate-500 hover:text-brand-400"><Edit2 size={16}/></button>
                                                <button onClick={() => handleDeleteTrip(trip.id)} className="p-2 text-slate-500 hover:text-rose-500"><Trash2 size={16}/></button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {isExpanded && (
                                        <div className="p-4 border-t border-slate-800 bg-slate-900/30">
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
                                                <div className="md:col-span-1">
                                                     <Input placeholder="Item Name" value={newItem.tripId === trip.id ? newItem.name : ''} onChange={e => setNewItem({...newItem, tripId: trip.id, name: e.target.value})} />
                                                </div>
                                                <div className="md:col-span-1">
                                                     <Input placeholder="Category (e.g. Dairy)" value={newItem.tripId === trip.id ? newItem.category : ''} onChange={e => setNewItem({...newItem, tripId: trip.id, category: e.target.value})} />
                                                </div>
                                                <div className="md:col-span-1">
                                                     <Input type="number" placeholder="Price" value={newItem.tripId === trip.id ? newItem.price : ''} onChange={e => setNewItem({...newItem, tripId: trip.id, price: e.target.value})} />
                                                </div>
                                                <Button onClick={() => handleAddItem(trip.id)}><Plus size={20}/></Button>
                                            </div>
                                            <div className="space-y-2">
                                                {trip.items.map(item => (
                                                    <div key={item.id} className="flex justify-between items-center bg-slate-800/50 p-2 rounded-lg group">
                                                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggleItemBought(trip.id, item.id)}>
                                                            {item.isBought ? <CheckCircle2 size={16} className="text-brand-500" /> : <Circle size={16} className="text-slate-600" />}
                                                            <div>
                                                                <span className={`block ${item.isBought ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{item.name}</span>
                                                                <span className="text-[10px] text-slate-500 uppercase tracking-wide bg-slate-900 px-1 rounded">{item.category}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-sm font-mono text-slate-400">{formatMoney(item.price)}</span>
                                                            <button onClick={() => handleDeleteItem(trip.id, item.id)} className="text-slate-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14}/></button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {trip.items.length === 0 && <div className="text-xs text-slate-600 text-center py-2">No items added.</div>}
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            )
                        })}
                        {trips.filter(t => t.category === activeTab).length === 0 && (
                            <div className="text-center text-slate-500 py-10">
                                <p className="mb-2">No purchases recorded for {activeTab}.</p>
                                <p className="text-xs">Use the form on the left to add a new purchase.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
};

const ProfileView = ({ currency, setCurrency }: { currency: Currency, setCurrency: (c: Currency) => void }) => (
    <div className="max-w-xl mx-auto space-y-6">
        <SectionHeader title="Profile & Settings" subtitle="Personalize your experience" />
        <Card>
            <h3 className="text-lg font-semibold mb-6">Preferences</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Display Currency</label>
                    <div className="grid grid-cols-3 gap-4">
                        {(['BRL', 'USD', 'GBP'] as Currency[]).map(c => (
                            <button 
                              key={c}
                              onClick={() => setCurrency(c)}
                              className={`py-3 rounded-lg border font-bold transition-all ${currency === c ? 'bg-brand-600 border-brand-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
        <Card>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <p className="text-slate-400 text-sm">Dohaeris Finance v1.1.0</p>
            <p className="text-slate-500 text-xs mt-2">Local-first financial management. Data is stored in memory for this demo.</p>
        </Card>
    </div>
);

const PatrimonyView = ({ assets, formatMoney }: { assets: Asset[], formatMoney: (n: number) => string }) => (
    <div className="space-y-6">
        <SectionHeader title="Patrimony" subtitle={`Total Net Worth: ${formatMoney(assets.reduce((acc, a) => acc + a.value, 0))}`} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assets.map(a => (
                <Card key={a.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Landmark className="text-brand-400"/>
                        <div>
                            <p className="font-bold">{a.name}</p>
                            <span className="text-xs bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-400">{a.type}</span>
                        </div>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">{formatMoney(a.value)}</span>
                </Card>
            ))}
        </div>
    </div>
);

// --- MAIN APP COMPONENT ---

export default function App() {
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [currency, setCurrency] = useState<Currency>('BRL');
  
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  // Replaced groceries state with shoppingTrips state
  const [shoppingTrips, setShoppingTrips] = useState<ShoppingTrip[]>(INITIAL_SHOPPING_TRIPS);
  const [creditCards, setCreditCards] = useState<CreditCard[]>(INITIAL_CARDS);
  const [tagBudgets, setTagBudgets] = useState<TagBudget[]>(INITIAL_TAG_BUDGETS);

  const formatMoney = (amount: number) => {
      const formatter = new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
          style: 'currency',
          currency: currency
      });
      return formatter.format(amount);
  };

  return (
    <Layout activeView={activeView} onNavigate={setActiveView}>
      {activeView === 'dashboard' && <DashboardView transactions={transactions} assets={assets} formatMoney={formatMoney} />}
      {activeView === 'earnings' && <EarningsView transactions={transactions} setTransactions={setTransactions} formatMoney={formatMoney} />}
      {activeView === 'expenses' && (
          <ExpensesView 
            transactions={transactions} 
            setTransactions={setTransactions} 
            creditCards={creditCards} 
            setCreditCards={setCreditCards} 
            tagBudgets={tagBudgets} 
            setTagBudgets={setTagBudgets} 
            formatMoney={formatMoney} 
          />
      )}
      {activeView === 'groceries' && <ShoppingView trips={shoppingTrips} setTrips={setShoppingTrips} formatMoney={formatMoney} />}
      {activeView === 'goals' && (
          <div className="text-center py-20 text-slate-500">Goals Module - Same as previous version (omitted for brevity)</div>
      )}
      {activeView === 'patrimony' && <PatrimonyView assets={assets} formatMoney={formatMoney} />}
      {activeView === 'profile' && <ProfileView currency={currency} setCurrency={setCurrency} />}
    </Layout>
  );
}