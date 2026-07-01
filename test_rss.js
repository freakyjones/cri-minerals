async function test() {
  console.log("Fetching RSS...");
  const response = await fetch("https://www.mining.com/feed/");
  const xml = await response.text();
  console.log("XML length:", xml.length);
  
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/;
  const descRegex = /<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/;

  const items = [];
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemContent = match[1];
    const titleMatch = titleRegex.exec(itemContent);
    const descMatch = descRegex.exec(itemContent);
    
    const title = titleMatch ? (titleMatch[1] || titleMatch[2]) : "";
    const description = descMatch ? (descMatch[1] || descMatch[2]) : "";
    
    const cleanDesc = description.replace(/<[^>]*>?/gm, '').trim().substring(0, 500);
    
    if (title) {
      items.push(`Title: ${title}\nDescription: ${cleanDesc}`);
    }
    if (items.length >= 15) break;
  }
  
  console.log("Parsed items count:", items.length);
  if (items.length > 0) {
    console.log("First item:", items[0]);
  }
}

test().catch(console.error);
