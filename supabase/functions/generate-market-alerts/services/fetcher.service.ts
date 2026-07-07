import { RSS_FEEDS, GDELT_URL } from '../config/index.ts';
import { extractRssItems } from '../utils/parsers.ts';

export async function fetchWithTimeout(url: string, timeout = 10000): Promise<Response> {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    throw new Error('Invalid URL protocol');
  }
  const controller = new AbortController();
  const id = setTimeout(() => { controller.abort(); }, timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

export async function fetchNewsData(logger: unknown): Promise<string> {
  const [gdeltRes, ...rssRes] = await Promise.all([
    fetchWithTimeout(GDELT_URL).catch(() => null),
    ...RSS_FEEDS.map(url => fetchWithTimeout(url).catch(() => null))
  ]);
  
  let gdeltData: { articles?: { title?: string, domain?: string, url?: string }[] } | null = null;
  if (gdeltRes) {
    if (!gdeltRes.ok) {
      (logger as { warn: (msg: string) => void }).warn(`GDELT returned status ${gdeltRes.status}. Skipping.`);
    } else {
      const contentType = gdeltRes.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const textError = await gdeltRes.text();
        logger.warn("GDELT returned plain text instead of JSON.", { textError: textError.substring(0, 100) });
      } else {
        try {
           gdeltData = await gdeltRes.json();
        } catch (e) {
          (logger as { error: (msg: string, err: unknown) => void }).error("Failed to parse GDELT JSON", e);
        }
      }
    }
  }

  const items: string[] = [];
  if (gdeltData?.articles) {
    for (const article of gdeltData.articles) {
      if (article.title) {
        items.push(`Title: ${article.title}\nSource: ${article.domain}\nURL: ${article.url}`);
      }
    }
  }
  
  let i = 0;
  for (const res of rssRes) {
    if (res?.ok) {
       try {
         const xml = await res.text();
         const rssTitles = extractRssItems(xml, 3);
         rssTitles.forEach(title => items.push(`Source: RSS Feed ${i+1}\n${title}`));
       } catch (e) {
         (logger as { warn: (msg: string, err: unknown) => void }).warn(`Failed to process RSS feed ${i}`, e);
       }
    }
    i++;
  }

  return items.join('\n\n');
}
