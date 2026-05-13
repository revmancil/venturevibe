'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

interface SurveyQuestion {
  question: string;
  type: string;
  options?: string[];
  insight?: string;
}

interface SurveyData {
  questions?: SurveyQuestion[];
  totalQuestions?: number;
  estimatedTime?: number;
  description?: string;
}

interface SurveyResultsProps {
  data: SurveyData;
}

export default function SurveyResults({ data }: SurveyResultsProps) {
  const questions = data?.questions || [];

  return (
    <Card className="p-8 border border-border/50 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-lg">
          <CheckCircle className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="font-display text-2xl font-bold">Validation Surveys</h2>
      </div>

      <p className="text-muted-foreground mb-6">{data?.description || 'AI-generated micro-survey questions designed to validate your idea with your target audience.'}</p>

      {questions?.length > 0 ? (
        <div className="space-y-4">
          {questions.map((q: SurveyQuestion, idx: number) => (
            <div key={idx} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-lg">{q.question}</h4>
                <Badge variant="secondary" className="ml-2">{q.type}</Badge>
              </div>
              {q.options && q.options.length > 0 && (
                <div className="mt-3 space-y-2">
                  {q.options.map((option: string, optIdx: number) => (
                    <div key={optIdx} className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 rounded border-2 border-blue-300" />
                      {option}
                    </div>
                  ))}
                </div>
              )}
              {q.insight && (
                <p className="mt-3 text-sm text-blue-700 bg-white p-2 rounded border-l-2 border-blue-500">
                  💡 <strong>Insight:</strong> {q.insight}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground italic">Survey questions will be generated when you click "Generate Survey"</p>
      )}
    </Card>
  );
}
