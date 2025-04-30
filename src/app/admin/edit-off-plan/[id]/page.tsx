import { Suspense } from 'react';
import EditOffPlanForm from './EditOffPlanForm';

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditOffPlanPage({ params }: PageProps) {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    }>
      <EditOffPlanForm id={params.id} />
    </Suspense>
  );
} 