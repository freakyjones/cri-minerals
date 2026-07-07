import { RSS_FEEDS, GDELT_URL } from '../config/index.ts';
import { extractRssItems } from '../utils/parsers.ts';

interface FetcherLogger {
  warn: (message: string, context?: Record<string, unknown>) => void;
  error: (message: string, error?: unknown) => void;
}

export async function fetchWithTimeout(url: string, timeout = 10000): Promise<Response> {
  const allowedDomains = ['api.gdeltproject.org', 'www.mining.com'];
  const parsedUrl = new URL(url);
  if (!allowedDomains.includes(parsedUrl.hostname)) {
    throw new Error("Disallowed target URL");
  }
  if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
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

export async function fetchNewsData(logger: FetcherLogger): Promise<string> {
  const [gdeltRes, ...rssRes] = await Promise.all([
    fetchWithTimeout(GDELT_URL).catch(() => null),
    ...RSS_FEEDS.map(url => fetchWithTimeout(url).catch(() => null))
  ]);
  
  let gdeltData: { articles?: { title?: string, domain?: string, url?: string }[] } | null = null;
  if (gdeltRes) {
    if (!gdeltRes.ok) {
      logger.warn(`GDELT returned status ${gdeltRes.status}. Skipping.`);
    } else {
      const contentType = gdeltRes.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const textError = await gdeltRes.text();
        logger.warn("GDELT returned plain text instead of JSON.", { textError: textError.substring(0, 100) });
      } else {
        try {
           gdeltData = await gdeltRes.json();
        } catch (e) {
          logger.error("Failed to parse GDELT JSON", e);
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
         logger.warn(`Failed to process RSS feed ${i}`, e);
       }
    }
    i++;
  }

  return items.join('\n\n');
}
