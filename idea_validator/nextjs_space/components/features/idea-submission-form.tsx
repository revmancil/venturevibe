'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface IdeaSubmissionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const categories = [
  'Technology',
  'E-commerce',
  'Healthcare',
  'Education',
  'Finance',
  'Food & Beverage',
  'SaaS',
  'Real Estate',
  'Entertainment',
  'Other',
];

export default function IdeaSubmissionForm({ onSuccess, onCancel }: IdeaSubmissionFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submittedIdea, setSubmittedIdea] = useState<{ id: string; title: string } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAudience: '',
    problemStatement: '',
    category: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || 'Failed to submit idea');
        return;
      }

      const result = await response.json();
      toast.success('Idea submitted successfully!');
      setSubmittedIdea({ id: result.id || result.idea?.id, title: formData.title });
      setFormData({ title: '', description: '', targetAudience: '', problemStatement: '', category: '' });
      router.refresh();
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('An error occurred while submitting your idea');
    } finally {
      setIsLoading(false);
    }
  };

  if (submittedIdea) {
    return (
      <Card className="p-8 border-2 border-emerald-300 bg-emerald-50 mb-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg shrink-0">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-2xl font-bold mb-1">Idea submitted successfully! 🎉</h2>
            <p className="text-muted-foreground mb-4">
              <span className="font-semibold text-foreground">"{submittedIdea.title}"</span> has been added to your dashboard. Next, run AI validations (surveys, competitors, market sizing) to start validating it.
            </p>
            <div className="flex flex-wrap gap-3">
              {submittedIdea.id && (
                <Link href={`/ideas/${submittedIdea.id}`}>
                  <Button className="bg-gradient-to-r from-violet-500 to-emerald-500 hover:from-blue-600 hover:to-purple-600">
                    Validate this idea
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  setSubmittedIdea(null);
                  onSuccess?.();
                }}
              >
                Submit another idea
              </Button>
              {onCancel && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSubmittedIdea(null);
                    onCancel();
                  }}
                >
                  Back to dashboard
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 border border-border/50 mb-8">
      <h2 className="font-display text-2xl font-bold mb-6">Submit your idea for validation</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Idea Title</Label>
          <Input
            id="title"
            placeholder="e.g., AI-powered fitness coach"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Detailed Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your idea in detail..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            disabled={isLoading}
            className="min-h-[120px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input
              id="targetAudience"
              placeholder="e.g., fitness enthusiasts aged 25-40"
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })} disabled={isLoading}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="problemStatement">Problem it solves</Label>
          <Textarea
            id="problemStatement"
            placeholder="What problem does your idea solve?"
            value={formData.problemStatement}
            onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
            required
            disabled={isLoading}
            className="min-h-[100px]"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isLoading} loading={isLoading} className="flex-1 bg-gradient-to-r from-violet-500 to-emerald-500 hover:from-blue-600 hover:to-purple-600">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit idea'
            )}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
