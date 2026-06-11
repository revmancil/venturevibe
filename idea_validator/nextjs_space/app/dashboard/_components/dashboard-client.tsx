'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ChevronRight, LogOut, Plus, Crown, Zap, CreditCard, Trash2, Loader2 } from 'lucide-react';
import { VentureVibeLogo } from '@/components/brand/venturevibe-logo';
import IdeaSubmissionForm from '@/components/features/idea-submission-form';
import { ValidationCounter, getValidationCounterText } from '@/components/dashboard/validation-counter';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  createdAt: Date;
  validationReport: any | null;
}

interface SubscriptionInfo {
  plan: string;
  planName: string;
  validationsUsed: number;
  validationsLimit: number;
  hasStripeSubscription: boolean;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
}

interface DashboardClientProps {
  ideas: Idea[];
}

export default function DashboardClient({ ideas: initialIdeas }: DashboardClientProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [showForm, setShowForm] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Idea | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/ideas/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete');
      }
      setIdeas((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      toast.success(`"${deleteTarget.title}" deleted`);
      setDeleteTarget(null);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete idea');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetch('/api/subscription')
      .then(res => res.json())
      .then(data => { if (!data.error) setSubscription(data); })
      .catch(() => {});
  }, []);

  const handleManageBilling = async () => {
    setLoadingPortal(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || 'Failed to open billing portal');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoadingPortal(false);
    }
  };

  const handleIdeaSubmitted = () => {
    toast.success('Idea submitted successfully!');
    setShowForm(false);
    router.refresh();
  };

  const getStatusColor = (status: string) => {
    if (status === 'completed') return 'bg-emerald-100 text-emerald-700';
    if (status === 'in_progress') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (status: string) => {
    if (status === 'completed') return 'Validated';
    if (status === 'in_progress') return 'Validating';
    return 'Pending Validation';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <VentureVibeLogo size="md" href="/dashboard" />
          <div className="flex items-center gap-4">
            {subscription && <ValidationCounter subscription={subscription} />}
            <span className="text-sm text-muted-foreground">{session?.user?.name}</span>
            <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl font-bold mb-2">Your Ideas</h1>
            <p className="text-muted-foreground">Validate your business ideas in 48 hours</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-violet-500 to-emerald-500 hover:from-blue-600 hover:to-purple-600">
            <Plus className="w-4 h-4 mr-2" />
            New idea
          </Button>
        </div>

        {subscription && (
          <Card className="p-6 border border-border/50 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${subscription.plan === 'free' ? 'bg-gray-100' : subscription.plan === 'pro' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                  {subscription.plan === 'free' ? <Zap className="w-5 h-5 text-gray-600" /> : <Crown className={`w-5 h-5 ${subscription.plan === 'pro' ? 'text-purple-600' : 'text-blue-600'}`} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{subscription.planName} Plan</h3>
                    {subscription.cancelAtPeriodEnd && (
                      <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700">Cancels soon</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getValidationCounterText(subscription)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {subscription.plan === 'free' ? (
                  <Link href="/pricing">
                    <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                      <Crown className="w-3 h-3 mr-2" />
                      Upgrade
                    </Button>
                  </Link>
                ) : (
                  <Button size="sm" variant="outline" onClick={handleManageBilling} disabled={loadingPortal}>
                    <CreditCard className="w-3 h-3 mr-2" />
                    {loadingPortal ? 'Loading...' : 'Manage Billing'}
                  </Button>
                )}
              </div>
            </div>
            {subscription.validationsLimit > 0 && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-violet-500 to-emerald-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (subscription.validationsUsed / subscription.validationsLimit) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </Card>
        )}

        {showForm && <IdeaSubmissionForm onSuccess={handleIdeaSubmitted} onCancel={() => setShowForm(false)} />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas?.length > 0 ? (
            ideas.map((idea) => (
              <Card
                key={idea.id}
                className="p-6 h-full border border-border/50 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group relative"
                onClick={() => router.push(`/ideas/${idea.id}`)}
              >
                <button
                  type="button"
                  aria-label="Delete idea"
                  className="absolute top-3 right-3 p-1.5 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTarget(idea);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-start justify-between mb-3 pr-8">
                  <Badge variant="secondary" className="text-xs">{idea.category}</Badge>
                  <Badge className={`text-xs ${getStatusColor(idea.status)}`}>{getStatusLabel(idea.status)}</Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{idea.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{idea.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border/30">
                  <span className="text-xs text-muted-foreground">{new Date(idea.createdAt).toLocaleDateString()}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            ))
          ) : (
            <Card className="col-span-full p-12 text-center border border-dashed border-border/50">
              <VentureVibeLogo size="md" href={null} className="mx-auto mb-4 opacity-40" />
              <h3 className="font-semibold text-lg mb-2">No ideas yet</h3>
              <p className="text-muted-foreground mb-6">Start by submitting your first business idea for validation</p>
              <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-violet-500 to-emerald-500">
                <Plus className="w-4 h-4 mr-2" />
                Submit your idea
              </Button>
            </Card>
          )}
        </div>
      </main>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && !isDeleting && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this idea?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget && (
                <>
                  This will permanently delete <span className="font-semibold text-foreground">"{deleteTarget.title}"</span> and all its validation data (surveys, competitor analysis, market sizing). This action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); handleDelete(); }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Deleting...</>) : 'Delete idea'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
