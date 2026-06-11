import { Badge } from '@/components/ui/badge';

export type ValidationCounterSubscription = {
  plan: string;
  validationsUsed: number;
  validationsLimit: number;
};

export function getValidationCounterText(subscription: ValidationCounterSubscription): string {
  if (subscription.validationsLimit === -1) {
    return 'Unlimited validations';
  }

  if (subscription.plan === 'free') {
    return subscription.validationsUsed >= subscription.validationsLimit
      ? '1 of 1 validations used'
      : '1 free validation available';
  }

  return `${subscription.validationsUsed} of ${subscription.validationsLimit} validations used this month`;
}

type ValidationCounterProps = {
  subscription: ValidationCounterSubscription;
  className?: string;
};

export function ValidationCounter({ subscription, className }: ValidationCounterProps) {
  return (
    <Badge variant="secondary" className={className}>
      {getValidationCounterText(subscription)}
    </Badge>
  );
}
