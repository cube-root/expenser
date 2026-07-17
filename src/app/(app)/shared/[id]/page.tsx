'use client';

import { use, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BarChart3, ExternalLink, Loader2, MoreHorizontal, Plus, ReceiptText, RefreshCw, Unlink, UserPlus, UserRound, WalletCards } from 'lucide-react';
import { toast } from 'sonner';
import { apiSend } from '@/lib/client/fetcher';
import { removePersistentApiCache, usePersistentApi } from '@/lib/client/persistent-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatAmount, formatDate, todayISO } from '@/lib/format';
import type { SharedLedgerDetail } from '@/lib/shared/types';

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className="h-10 w-full rounded-md border bg-background px-3 text-sm" />;
}

export default function SharedLedgerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const detailUrl = `/api/shared-ledgers/${id}`;
  const { data, isLoading, refresh } = usePersistentApi<SharedLedgerDetail>(detailUrl);
  const [busy, setBusy] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [settleOpen, setSettleOpen] = useState(false);
  const [memberOpen, setMemberOpen] = useState(false);
  const [bill, setBill] = useState({ date: todayISO(), description: '', amount: '', payerId: '' });
  const [included, setIncluded] = useState<string[]>([]);
  const [settlement, setSettlement] = useState({ personId: '', date: todayISO(), amount: '', method: '' });
  const [member, setMember] = useState({ name: '', email: '' });
  const [anonymous, setAnonymous] = useState({ date: todayISO(), amount: '', note: '', receivedBy: '' });

  const monthly = useMemo(() => {
    const rows = new Map<string, { month:string; expenses:number; income:number }>();
    for (const expense of data?.expenses ?? []) { const month=expense.date.slice(0,7); const row=rows.get(month)??{month,expenses:0,income:0}; row.expenses+=expense.amount; rows.set(month,row); }
    for (const payment of data?.payments ?? []) if (payment.personId.startsWith('anonymous:')) { const month=payment.date.slice(0,7); const row=rows.get(month)??{month,expenses:0,income:0}; row.income+=payment.amount; rows.set(month,row); }
    return [...rows.values()].sort((a,b)=>b.month.localeCompare(a.month));
  }, [data]);

  const balances = useMemo(() => (data?.people ?? []).map((person) => {
    const charged = (data?.charges ?? []).filter((row) => row.personId === person.id).reduce((sum, row) => { const activity=data?.activities.find(item=>item.id===row.activityId); const period=monthly.find(item=>item.month===activity?.date.slice(0,7)); const factor=period?.expenses?Math.max(0,period.expenses-period.income)/period.expenses:1; return sum+row.amount*factor; }, 0);
    const paid = (data?.payments ?? []).filter((row) => row.personId === person.id).reduce((sum, row) => sum + row.amount, 0);
    const advanced = (data?.expenses ?? []).filter((row) => row.paidBy === person.id).reduce((sum, row) => sum + row.amount, 0);
    const namedPayments = (data?.payments ?? []).filter((row) => !row.personId.startsWith('anonymous:')).reduce((sum,row)=>sum+row.amount,0);
    const reimbursements = advanced > 0 ? Math.min(namedPayments, advanced) : 0;
    const anonymousCashHeld = (data?.payments ?? []).filter((row) => row.personId.startsWith('anonymous:') && row.receivedBy === person.id).reduce((sum,row)=>sum+row.amount,0);
    return { ...person, balance: charged - paid - advanced + reimbursements + anonymousCashHeld, anonymousCashHeld };
  }), [data, monthly]);

  async function send(body: unknown) {
    setBusy(true);
    try { await apiSend(`/api/shared-ledgers/${id}`, 'POST', body); await refresh(); removePersistentApiCache('/api/shared-ledgers'); return true; }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Could not save'); return false; }
    finally { setBusy(false); }
  }

  async function addExpense(event: React.FormEvent) {
    event.preventDefault();
    if (!included.length) return toast.error('Choose who shares this expense');
    const saved = await send({ action: 'activity', date: bill.date, name: bill.description, note: '', totalAmount: Number(bill.amount), payerId: bill.payerId, participantIds: included, anonymousAmount: 0 });
    if (saved) { setExpenseOpen(false); setBill({ date: todayISO(), description: '', amount: '', payerId: '' }); setIncluded([]); toast.success('Expense added'); }
  }

  async function settle(event: React.FormEvent) {
    event.preventDefault();
    const saved = await send({ action: 'payment', ...settlement, amount: Number(settlement.amount), note: 'Settlement' });
    if (saved) { setSettleOpen(false); setSettlement({ personId: '', date: todayISO(), amount: '', method: '' }); toast.success('Payment recorded'); }
  }

  async function addMember(event: React.FormEvent) {
    event.preventDefault();
    const saved = await send({ action: 'person', ...member, contributionType: 'per-activity', recurringAmount: 0 });
    if (saved) { setMemberOpen(false); setMember({ name: '', email: '' }); toast.success('Person added'); }
  }

  async function addAnonymous(event: React.FormEvent) {
    event.preventDefault();
    const saved=await send({action:'anonymous-payment',date:anonymous.date,amount:Number(anonymous.amount),note:anonymous.note,receivedBy:anonymous.receivedBy});
    if(saved){setAnonymous({date:todayISO(),amount:'',note:'',receivedBy:''});toast.success('Anonymous contribution added');}
  }

  async function restructure() {
    setBusy(true);
    try { await apiSend(`/api/shared-ledgers/${id}`, 'PUT'); await refresh(); toast.success('Sheet structure restored'); }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Could not restructure sheet'); }
    finally { setBusy(false); }
  }

  async function disconnect() {
    if (!window.confirm('Disconnect this group? The Google Sheet will not be deleted.')) return;
    try { await apiSend(`/api/shared-ledgers/${id}`, 'DELETE'); removePersistentApiCache(detailUrl); removePersistentApiCache('/api/shared-ledgers'); router.replace('/shared'); toast.success('Group disconnected'); }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Could not disconnect'); }
  }

  if (isLoading || !data) return <p className="text-sm text-muted-foreground">Loading group…</p>;
  const share = included.length ? Number(bill.amount) / included.length : 0;

  return <div className="mx-auto max-w-2xl space-y-4">
    <header className="flex items-center gap-2 border-b pb-4">
      <Button variant="ghost" size="icon" render={<Link href="/shared"/>}><ArrowLeft/></Button>
      <div className="min-w-0 flex-1"><h1 className="truncate text-xl font-semibold">{data.title}</h1><p className="text-xs text-muted-foreground">{data.peopleCount} people</p></div>
      <Popover><PopoverTrigger render={<Button variant="ghost" size="icon" aria-label="Group options"/>}><MoreHorizontal/></PopoverTrigger><PopoverContent align="end" className="w-52 p-1">
        <Button variant="ghost" className="w-full justify-start" onClick={()=>setMemberOpen(true)}><UserPlus/> Add person</Button>
        <Button variant="ghost" className="w-full justify-start" onClick={()=>refresh().catch(error=>toast.error(error instanceof Error?error.message:'Could not refresh'))}><RefreshCw/> Refresh data</Button>
        <Button variant="ghost" className="w-full justify-start" onClick={restructure}><RefreshCw/> Restructure sheet</Button>
        <Button variant="ghost" className="w-full justify-start" render={<a href={data.url} target="_blank" rel="noreferrer"/>}><ExternalLink/> Open Google Sheet</Button>
        <Button variant="ghost" className="w-full justify-start text-destructive" onClick={disconnect}><Unlink/> Disconnect</Button>
      </PopoverContent></Popover>
    </header>

    <div className="grid grid-cols-2 gap-3">
      <Button size="lg" className="h-11" onClick={()=>{setIncluded(data.people.filter(p=>p.status==='active').map(p=>p.id));setExpenseOpen(true);}} disabled={!data.people.length}><Plus/> Add expense</Button>
      <Button size="lg" variant="outline" className="h-11" onClick={()=>setSettleOpen(true)} disabled={!data.people.length}><WalletCards/> Settle up</Button>
    </div>

    {!data.people.length && <Card><CardContent className="py-10 text-center"><UserPlus className="mx-auto mb-2 size-8 text-muted-foreground"/><p className="font-medium">Add people to this group</p><p className="mb-4 text-sm text-muted-foreground">Then you can add an expense and split it.</p><Button onClick={()=>setMemberOpen(true)}>Add first person</Button></CardContent></Card>}

    {data.people.length>0 && <Tabs defaultValue="expenses">
      <TabsList className="grid w-full grid-cols-4"><TabsTrigger value="expenses">Expenses</TabsTrigger><TabsTrigger value="balances">Balances</TabsTrigger><TabsTrigger value="anonymous">Anonymous</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger></TabsList>
      <TabsContent value="expenses" className="space-y-2 pt-2">
        {!data.activities.length ? <div className="py-14 text-center text-muted-foreground"><ReceiptText className="mx-auto mb-2 size-9"/><p>No expenses yet</p><p className="text-xs">Tap Add expense to split your first bill.</p></div> : data.activities.slice().reverse().map((activity)=>{
          const expense=data.expenses.find(row=>row.activityId===activity.id); const payer=data.people.find(person=>person.id===expense?.paidBy); const activityCharges=data.charges.filter(row=>row.activityId===activity.id);
          const namedCount=activityCharges.filter(row=>!row.personId.startsWith('anonymous:')).length; const hasAnonymousCharge=activityCharges.some(row=>row.personId.startsWith('anonymous:'));
          return <Card key={activity.id} size="sm"><CardContent className="flex items-center gap-3"><div className="w-10 text-center text-xs text-muted-foreground"><span className="block uppercase">{new Date(`${activity.date}T00:00:00`).toLocaleDateString(undefined,{month:'short'})}</span><strong className="text-lg text-foreground">{activity.date.slice(-2)}</strong></div><div className="min-w-0 flex-1"><p className="truncate font-medium">{activity.name}</p><p className="text-xs text-muted-foreground">{payer?.name||'Someone'} paid {formatAmount(expense?.amount||0,data.currency)}</p><p className="text-xs text-muted-foreground">Split between {namedCount} named {namedCount===1?'person':'people'}{hasAnonymousCharge?' + anonymous players':''}</p></div><strong>{formatAmount(expense?.amount||0,data.currency)}</strong></CardContent></Card>;
        })}
      </TabsContent>
      <TabsContent value="balances" className="space-y-2 pt-2">
        {balances.map(person=><Card key={person.id} size="sm"><CardContent className="flex items-center justify-between"><span className="font-medium">{person.name}</span>{person.balance>0?<span className="text-sm text-orange-700">owes <strong>{formatAmount(person.balance,data.currency)}</strong></span>:person.balance<0?<span className="text-sm text-green-700">is owed <strong>{formatAmount(-person.balance,data.currency)}</strong></span>:<span className="text-sm text-muted-foreground">settled up</span>}</CardContent></Card>)}
      </TabsContent>
      <TabsContent value="anonymous" className="space-y-3 pt-2">
        <Card><CardContent><div className="mb-4 flex gap-3"><UserRound className="size-6 text-green-700"/><div><p className="font-medium">Add anonymous contribution</p><p className="text-xs text-muted-foreground">For daily or guest payments where you do not need a name. This is group income, not personal revenue.</p></div></div><form className="space-y-3" onSubmit={addAnonymous}><div className="grid grid-cols-2 gap-3"><div><Label>Amount received</Label><Input type="number" min="0" step="any" value={anonymous.amount} onChange={e=>setAnonymous({...anonymous,amount:e.target.value})} required/></div><div><Label>Date</Label><Input type="date" value={anonymous.date} onChange={e=>setAnonymous({...anonymous,date:e.target.value})} required/></div></div><div><Label>Who keeps this money?</Label><Select value={anonymous.receivedBy} onChange={e=>setAnonymous({...anonymous,receivedBy:e.target.value})} required><option value="">Select host</option>{data.people.map(person=><option key={person.id} value={person.id}>{person.name}</option>)}</Select><p className="mt-1 text-xs text-muted-foreground">This person will be shown as holding the group cash until month end.</p></div><div><Label>Note (optional)</Label><Input value={anonymous.note} onChange={e=>setAnonymous({...anonymous,note:e.target.value})} placeholder="Daily guest collection"/></div><Button type="submit" disabled={busy}>Add contribution</Button></form></CardContent></Card>
        {data.payments.filter(row=>row.personId.startsWith('anonymous:')).slice().reverse().map(row=>{const holder=data.people.find(person=>person.id===row.receivedBy);return <Card key={row.id} size="sm"><CardContent className="flex justify-between"><span>Anonymous contribution<small className="block text-muted-foreground">{formatDate(row.date)} · held by {holder?.name||'Not assigned'}{row.note&&` · ${row.note}`}</small></span><strong className="text-green-700">+{formatAmount(row.amount,data.currency)}</strong></CardContent></Card>})}
      </TabsContent>
      <TabsContent value="analytics" className="space-y-3 pt-2">
        <Card><CardContent><div className="mb-3 flex items-center gap-2 font-medium"><BarChart3 className="size-5"/> Monthly summary</div>{!monthly.length?<p className="text-muted-foreground">No data yet.</p>:<div className="space-y-3">{monthly.map(row=><div key={row.month} className="rounded-lg border p-3"><p className="mb-2 font-medium">{new Date(`${row.month}-01T00:00:00`).toLocaleDateString(undefined,{month:'long',year:'numeric'})}</p><div className="grid grid-cols-3 gap-2 text-sm"><div><span className="block text-xs text-muted-foreground">Expenses</span><strong>{formatAmount(row.expenses,data.currency)}</strong></div><div><span className="block text-xs text-muted-foreground">Anonymous income</span><strong className="text-green-700">{formatAmount(row.income,data.currency)}</strong></div><div><span className="block text-xs text-muted-foreground">Net cost</span><strong>{formatAmount(Math.max(0,row.expenses-row.income),data.currency)}</strong></div></div></div>)}</div>}</CardContent></Card>
        <Card><CardContent><p className="mb-3 font-medium">Cash held at month end</p>{balances.filter(person=>person.anonymousCashHeld>0).length===0?<p className="text-sm text-muted-foreground">No anonymous cash is being held.</p>:balances.filter(person=>person.anonymousCashHeld>0).map(person=><div key={person.id} className="flex justify-between border-t py-2 first:border-0"><span>{person.name} holds</span><strong>{formatAmount(person.anonymousCashHeld,data.currency)}</strong></div>)}</CardContent></Card>
        <Card><CardContent><p className="mb-3 font-medium">Who owes whom</p>{balances.filter(person=>person.balance!==0).map(person=><div key={person.id} className="flex justify-between border-t py-2 first:border-0">{person.balance>0?<><span>{person.name} owes</span><strong className="text-orange-700">{formatAmount(person.balance,data.currency)}</strong></>:<><span>{person.name} should receive</span><strong className="text-green-700">{formatAmount(-person.balance,data.currency)}</strong></>}</div>)}</CardContent></Card>
      </TabsContent>
    </Tabs>}

    <Dialog open={expenseOpen} onOpenChange={setExpenseOpen}><DialogContent className="max-h-[90dvh] overflow-y-auto"><DialogHeader><DialogTitle>Add an expense</DialogTitle><DialogDescription>Enter the bill, who paid, and who shares it.</DialogDescription></DialogHeader><form className="space-y-4" onSubmit={addExpense}>
      <div><Label>Description</Label><Input value={bill.description} onChange={e=>setBill({...bill,description:e.target.value})} placeholder="Monthly court fee" autoFocus required/></div>
      <div className="grid grid-cols-2 gap-3"><div><Label>Amount</Label><Input type="number" min="0" step="any" value={bill.amount} onChange={e=>setBill({...bill,amount:e.target.value})} placeholder="0.00" required/></div><div><Label>Date</Label><Input type="date" value={bill.date} onChange={e=>setBill({...bill,date:e.target.value})} required/></div></div>
      <div><Label>Paid by</Label><Select value={bill.payerId} onChange={e=>setBill({...bill,payerId:e.target.value})} required><option value="">Choose person</option>{data.people.map(person=><option key={person.id} value={person.id}>{person.name}</option>)}</Select></div>
      <div><Label>Split between</Label><div className="mt-1 grid grid-cols-2 gap-2">{data.people.map(person=><label key={person.id} className="flex items-center gap-2 rounded-lg border p-3"><input type="checkbox" checked={included.includes(person.id)} onChange={e=>setIncluded(e.target.checked?[...included,person.id]:included.filter(id=>id!==person.id))}/><span className="truncate">{person.name}</span></label>)}</div></div>
      {included.length>0&&Number(bill.amount)>0&&<div className="rounded-lg bg-muted p-3 text-sm"><div className="flex justify-between"><span>Paid by {data.people.find(person=>person.id===bill.payerId)?.name||'—'}</span><strong>{formatAmount(Number(bill.amount),data.currency)}</strong></div><div className="mt-2 flex justify-between border-t pt-2"><span>Split equally between {included.length}</span><strong>{formatAmount(share,data.currency)} each</strong></div></div>}
      <DialogFooter><Button type="submit" disabled={busy||!included.length}>{busy?<Loader2 className="animate-spin"/>:'Save expense'}</Button></DialogFooter>
    </form></DialogContent></Dialog>

    <Dialog open={settleOpen} onOpenChange={setSettleOpen}><DialogContent><DialogHeader><DialogTitle>Settle up</DialogTitle><DialogDescription>Record money paid back to the person who covered the bill.</DialogDescription></DialogHeader><form className="space-y-4" onSubmit={settle}>
      <div><Label>Who paid back?</Label><Select value={settlement.personId} onChange={e=>setSettlement({...settlement,personId:e.target.value})} required><option value="">Choose person</option>{balances.filter(p=>p.balance>0).map(person=><option key={person.id} value={person.id}>{person.name} · owes {formatAmount(person.balance,data.currency)}</option>)}</Select></div>
      <div className="grid grid-cols-2 gap-3"><div><Label>Amount</Label><Input type="number" min="0" step="any" value={settlement.amount} onChange={e=>setSettlement({...settlement,amount:e.target.value})} required/></div><div><Label>Date</Label><Input type="date" value={settlement.date} onChange={e=>setSettlement({...settlement,date:e.target.value})}/></div></div>
      <div><Label>Payment method (optional)</Label><Input value={settlement.method} onChange={e=>setSettlement({...settlement,method:e.target.value})} placeholder="UPI, cash…"/></div><DialogFooter><Button type="submit" disabled={busy}>Save payment</Button></DialogFooter>
    </form></DialogContent></Dialog>

    <Dialog open={memberOpen} onOpenChange={setMemberOpen}><DialogContent><DialogHeader><DialogTitle>Add a person</DialogTitle><DialogDescription>Add someone who shares expenses in this group.</DialogDescription></DialogHeader><form className="space-y-4" onSubmit={addMember}><div><Label>Name</Label><Input value={member.name} onChange={e=>setMember({...member,name:e.target.value})} autoFocus required/></div><div><Label>Email (optional)</Label><Input type="email" value={member.email} onChange={e=>setMember({...member,email:e.target.value})}/></div><DialogFooter><Button type="submit" disabled={busy}>Add person</Button></DialogFooter></form></DialogContent></Dialog>
  </div>;
}
