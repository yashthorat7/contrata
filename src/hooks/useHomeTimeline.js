import { useState } from 'react';

export function useHomeTimeline() {
  const [prefTab, setPrefTab] = useState('search');

  return { prefTab, setPrefTab };
}
