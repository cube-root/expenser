'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, Loader2, Plus, RefreshCw, Unlink, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiSend } from '@/lib/client/fetcher';
import { useSettings, useSheetInfo } from '@/lib/client/hooks';
import { CURRENCIES, type Settings } from '@/lib/types';

function TokenListEditor({
  label,
  description,
  values,
  onChange,
  minimum,
}: {
  label: string;
  description: string;
  values: string[];
  onChange: (values: string[]) => void;
  minimum: number;
}) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const value = draft.trim();
    if (!value) return;
    if (values.some((existing) => existing.toLowerCase() === value.toLowerCase())) {
      toast.error(`“${value}” already exists`);
      return;
    }
    onChange([...values, value]);
    setDraft('');
  };
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <p className="text-xs text-muted-foreground">{description}</p>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <span
            key={value}
            className="flex items-center gap-1 rounded-full border px-3 py-1 text-sm"
          >
            {value}
            <button
              type="button"
              aria-label={`Remove ${value}`}
              className="text-muted-foreground hover:text-foreground"
              onClick={() => {
                if (values.length <= minimum) {
                  toast.error(`Keep at least ${minimum}`);
                  return;
                }
                onChange(values.filter((existing) => existing !== value));
              }}
            >
              <X className="size-3.5" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={draft}
          placeholder={`New ${label.toLowerCase().replace(/s$/, '')}…`}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              add();
            }
          }}
        />
        <Button type="button" variant="secondary" onClick={add}>
          <Plus className="size-4" /> Add
        </Button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { settings, isLoading, mutate } = useSettings();
  const { sheet } = useSheetInfo();
  const [edits, setEdits] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [resyncing, setResyncing] = useState(false);

  // Server settings until the user edits something — no effect needed.
  const draft = edits ?? settings ?? null;
  const setDraft = setEdits;

  if (isLoading || !draft) {
    return (
      <div className="space-y-4 max-w-xl mx-auto">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  const save = async () => {
    setSaving(true);
    try {
      await apiSend('/api/settings', 'PUT', draft);
      mutate({ settings: draft }, { revalidate: false });
      toast.success('Settings saved to your sheet');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const resync = async () => {
    setResyncing(true);
    try {
      await apiSend('/api/sheets/resync', 'POST');
      toast.success('Sheet structure resynced — headers and tabs are up to date');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to resync structure');
    } finally {
      setResyncing(false);
    }
  };

  const disconnect = async () => {
    setDisconnecting(true);
    try {
      await apiSend('/api/sheets/current', 'DELETE');
      toast.success('Sheet disconnected');
      router.replace('/setup');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to disconnect');
      setDisconnecting(false);
    }
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <h1 className="text-xl font-semibold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preferences</CardTitle>
          <CardDescription>Stored in the hidden Config tab of your sheet.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Default currency</Label>
              <Select
                value={draft.defaultCurrency}
                onValueChange={(value) =>
                  setDraft({ ...draft, defaultCurrency: value ?? draft.defaultCurrency })
                }
              >
                <SelectTrigger aria-label="Default currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(CURRENCIES.includes(draft.defaultCurrency)
                    ? CURRENCIES
                    : [draft.defaultCurrency, ...CURRENCIES]
                  ).map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="budget">Monthly budget</Label>
              <Input
                id="budget"
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={draft.monthlyBudget || ''}
                placeholder="0 = no budget"
                onChange={(event) =>
                  setDraft({ ...draft, monthlyBudget: Number(event.target.value) || 0 })
                }
              />
            </div>
          </div>

          <Separator />

          <TokenListEditor
            label="Categories"
            description="Shown as one-tap chips when adding an expense."
            values={draft.categories}
            onChange={(categories) => setDraft({ ...draft, categories })}
            minimum={1}
          />

          <Separator />

          <TokenListEditor
            label="Payment modes"
            description="How you paid — UPI, card, cash…"
            values={draft.paymentModes}
            onChange={(paymentModes) => setDraft({ ...draft, paymentModes })}
            minimum={1}
          />

          <Button className="w-full" onClick={save} disabled={saving}>
            {saving && <Loader2 className="size-4 animate-spin" />}
            Save settings
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Connected store</CardTitle>
          <CardDescription>
            {sheet ? sheet.title : 'Loading…'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            {sheet && (
              <Button
                variant="outline"
                className="flex-1"
                render={<a href={sheet.url} target="_blank" rel="noreferrer" />}
              >
                <ExternalLink className="size-4" /> Open the data
              </Button>
            )}
            <Button
              variant="outline"
              className="flex-1"
              onClick={resync}
              disabled={resyncing}
            >
              {resyncing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RefreshCw className="size-4" />
              )}
              Resync structure
            </Button>
            <Button
              variant="outline"
              className="flex-1 text-red-600 hover:text-red-700"
              onClick={disconnect}
              disabled={disconnecting}
            >
              {disconnecting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Unlink className="size-4" />
              )}
              Disconnect sheet
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Resync brings the structure (headers, tabs/tables, fields) up to the app’s current
            schema — run it after app updates add new columns. Your data rows are never touched.
          </p>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center pb-4">
        Disconnecting only unlinks the app — your data stays untouched in your Google Drive or
        Airtable workspace.
      </p>
    </div>
  );
}
