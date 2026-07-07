export function extractJsonArray(llmResponse: string): Array<Record<string, unknown>> {
  if (!llmResponse || typeof llmResponse !== "string") return [];
  const markdownRegex = /```(?:json)?\s*([\s\S]*?)\s*```/ig;
  let match;
  while ((match = markdownRegex.exec(llmResponse)) !== null) {
    const content = match[1].trim();
    if (content.startsWith("[") && content.endsWith("]")) {
      try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) return parsed;
      } catch { }
    }
  }
  const lastIndex = llmResponse.lastIndexOf("]");
  if (lastIndex === -1) return [];
  let startIndex = llmResponse.indexOf("[");
  while (startIndex !== -1 && startIndex < lastIndex) {
    try {
      const jsonString = llmResponse.substring(startIndex, lastIndex + 1);
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) return parsed;
    } catch { }
    startIndex = llmResponse.indexOf("[", startIndex + 1);
  }
  return [];
}

export function extractRssItems(xml: string, limit: number = 3): string[] {
  const items: string[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  const titleRegex = /<title>(.*?)<\/title>/i;
  
  let match;
  let count = 0;
  
  while ((match = itemRegex.exec(xml)) !== null && count < limit) {
    const itemContent = match[1];
    const titleMatch = titleRegex.exec(itemContent);
    
    if (titleMatch) {
      const cleanTitle = titleMatch[1]
        .replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
        .replace(/<[^>]+>/g, '')
        .trim();
        
      items.push(`Title: ${cleanTitle}`);
      count++;
    }
  }
  return items;
}
