import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { DigestDetail } from '@/types/digest';

export function useDigest(date: string) {
  return useQuery<DigestDetail>({
    queryKey: ['digest', date],
    queryFn: () => axios.get(`/api/digests/${date}`).then((r) => r.data),
    enabled: !!date,
  });
}
