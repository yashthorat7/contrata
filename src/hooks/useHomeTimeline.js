import { useLocalStorage } from './useLocalStorage';

export function useHomeTimeline() {
  const [prefTab, setPrefTab] = useLocalStorage('hf_home_pref_tab', 'search');

  return { prefTab, setPrefTab };
}
