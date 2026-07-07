async function run() {
  const gdeltQuery = '("critical minerals" OR lithium OR cobalt OR nickel OR graphite) AND (strike OR ban OR tariff OR delay OR war OR sanctions OR discovery)';
  const gdeltUrl = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(gdeltQuery)}&mode=artlist&format=json&maxrecords=15`;
  const res = await fetch(gdeltUrl);
  const data = await res.json();
  console.log("GDELT Articles:", data.articles ? data.articles.length : 0);

  const RSS_FEEDS = ["https://www.mining.com/feed/"];
  const rssData = await Promise.all(RSS_FEEDS.map(url => fetch(url).then(res => res.text()).catch(() => "")));
  console.log("RSS feeds received:", rssData.map(r => r.length));
}
run();
