import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { DEFAULT_RESUME_MD as DEFAULT_MARKDOWN } from '../data/defaultResume';

export function useResume() {
  const [markdownContent, setMarkdownContent] = useLocalStorage('hf_resume_md', DEFAULT_MARKDOWN);

  const updateMarkdown = useCallback(
    val => {
      setMarkdownContent(val);
    },
    [setMarkdownContent]
  );

  const resetResume = useCallback(() => {
    setMarkdownContent(DEFAULT_MARKDOWN);
  }, [setMarkdownContent]);

  const exportPDF = useCallback(() => {
    window.print();
  }, []);

  return { markdownContent, updateMarkdown, resetResume, exportPDF };
}
