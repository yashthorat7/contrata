export const parseUrlsFromText = (text, existingLinks = []) => {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/gi;
  const matches = text.match(urlRegex);

  if (matches && matches.length > 0) {
    return [...new Set([...matches, ...existingLinks])];
  }

  return null;
};
