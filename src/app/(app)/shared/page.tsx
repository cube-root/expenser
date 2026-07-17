'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Link2, Loader2, Plus, RefreshCw, Users } from 'lucide-react';
import { toast } from 'sonner';
import { apiSend } from '@/lib/client/fetcher';
import { usePersistentApi } from '@/lib/client/persistent-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatAmount } from '@/lib/format';
import type { SharedLedgerSummary } from '@/lib/shared/types';

export default function SharedPage() {
  const { data, isLoading, refresh } = usePersistentApi<{ ledgers: SharedLedgerSummary[] }>('/api/shared-ledgers');
  const [createOpen, setCreateOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('₹');
  const [link, setLink] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(body: unknown) {
    setBusy(true);
    try { await apiSend('/api/shared-ledgers', 'POST', body); await refresh(); setCreateOpen(false); setConnectOpen(false); setName(''); setLink(''); toast.success('Group added'); }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Could not add group'); }
    finally { setBusy(false); }
  }

  return <div className="mx-auto max-w-2xl space-y-5">
    <header className="flex items-center justify-between border-b pb-4"><div><h1 className="text-xl font-semibold">Groups</h1><p className="text-sm text-muted-foreground">Share expenses and settle up.</p></div><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={()=>refresh().catch(error=>toast.error(error instanceof Error?error.message:'Could not refresh'))} aria-label="Refresh groups"><RefreshCw/></Button><Button onClick={()=>setCreateOpen(true)}><Plus/> Create group</Button></div></header>

    {isLoading ? <p className="text-sm text-muted-foreground">Loading groups…</p> : !data?.ledgers.length ? <Card><CardContent className="py-14 text-center"><Users className="mx-auto mb-3 size-10 text-muted-foreground"/><h2 className="font-medium">No groups yet</h2><p className="mb-4 text-sm text-muted-foreground">Create a group, add people, and start splitting expenses.</p><Button onClick={()=>setCreateOpen(true)}><Plus/> Create your first group</Button></CardContent></Card> : <div className="space-y-2">{data.ledgers.map(group=><Link key={group.id} href={`/shared/${group.id}`}><Card size="sm" className="transition-colors hover:bg-accent"><CardContent className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-950"><Users className="size-5"/></div><div className="min-w-0 flex-1"><p className="truncate font-medium">{group.title}</p><p className="text-xs text-muted-foreground">{group.peopleCount} people · {group.totalExpenses?`${formatAmount(group.totalExpenses,group.currency)} total expenses`:'no expenses yet'}</p></div><ChevronRight className="size-4 text-muted-foreground"/></CardContent></Card></Link>)}</div>}

    <Button variant="ghost" className="text-muted-foreground" onClick={()=>setConnectOpen(true)}><Link2/> Connect an existing shared sheet</Button>

    <Dialog open={createOpen} onOpenChange={setCreateOpen}><DialogContent><DialogHeader><DialogTitle>Create a group</DialogTitle><DialogDescription>For a trip, home, activity, or anything you share.</DialogDescription></DialogHeader><form className="space-y-4" onSubmit={e=>{e.preventDefault();submit({mode:'create',name,currency});}}><div><Label>Group name</Label><Input value={name} onChange={e=>setName(e.target.value)} placeholder="Weekend trip" autoFocus required/></div><div><Label>Currency</Label><Input value={currency} onChange={e=>setCurrency(e.target.value)} className="w-24" required/></div><DialogFooter><Button type="submit" disabled={busy}>{busy?<Loader2 className="animate-spin"/>:'Create group'}</Button></DialogFooter></form></DialogContent></Dialog>

    <Dialog open={connectOpen} onOpenChange={setConnectOpen}><DialogContent><DialogHeader><DialogTitle>Connect existing sheet</DialogTitle><DialogDescription>Paste a shared-ledger Google Sheet URL.</DialogDescription></DialogHeader><form className="space-y-4" onSubmit={e=>{e.preventDefault();submit({mode:'connect',link});}}><Input value={link} onChange={e=>setLink(e.target.value)} placeholder="Google Sheet URL" autoFocus required/><DialogFooter><Button type="submit" disabled={busy}>Connect</Button></DialogFooter></form></DialogContent></Dialog>
  </div>;
}
