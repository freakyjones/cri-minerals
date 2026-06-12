

interface SEOProps {
  title: string;
  description: string;
}

export function SEO({ title, description }: SEOProps) {
  // In React 19, we can return <title> and <meta> tags directly from components
  // and React will automatically hoist them into the document <head>.
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Dynamic Open Graph for crawlers that execute JS (like Google) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  );
}
