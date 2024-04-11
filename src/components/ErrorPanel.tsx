import { FallbackProps } from 'react-error-boundary';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import RenderTextWithBoundaries from './RenderTextWithBoundaries';
import { Transition } from '@headlessui/react';
import { transitions } from '../utils/TransitionHelpers';

function ErrorPanel({ error }: FallbackProps) {
  return <ErrorCard error={error} />;
}

export type AnyError = Error | UnknownError | NamedError;

export interface UnknownError {
  message: string;
}

export interface NamedError extends UnknownError {
  name: string;
}

export function ErrorCard({ error, children }: { error?: Partial<AnyError>; children?: React.ReactNode }) {
  const fallbackMessage = 'An error occurred. Please try again.';
  const errorName = error && 'name' in error ? error.name ?? 'Error' : 'Error';

  return (
    <Transition show={true} appear={true} {...transitions.basic}>
      <div className="rounded-lg border-4 border-red-600 bg-red-800/25 p-5">
        <div className="flex items-center gap-2 text-red-600">
          <ExclamationTriangleIcon className="h-6 w-6 shrink-0" />
          <h1 className="text-xl font-bold">{errorName}</h1>
        </div>
        <p className="text-gray-400">
          <RenderTextWithBoundaries
            text={error?.message ?? fallbackMessage}
            boundaries={['"', '`', "'"]}
            DefaultText={({ children }) => <span>{children}</span>}
          />
        </p>
        {children}
      </div>
    </Transition>
  );
}

export default ErrorPanel;
