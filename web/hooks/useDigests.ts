import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { DigestListItem } from '@/types/digest';

export function useDigests() {
  return useQuery<DigestListItem[]>({
    queryKey: ['digests'],
    queryFn: () => axios.get('/api/digests').then((r) => r.data),
  });
}
