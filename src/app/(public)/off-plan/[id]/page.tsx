import { use } from 'react';
import OffPlanPropertyClient from './OffPlanPropertyClient';

interface PageParams {
  id: string;
}

export default function OffPlanPropertyPage({ params }: { params: PageParams }) {
  const unwrappedParams = use(Promise.resolve(params));
  return <OffPlanPropertyClient params={unwrappedParams} />;
} 