export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  const scriptId = `ga-${gaId}`;

  return (
    <>
      <script
        id={scriptId}
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `,
        }}
      />
    </>
  );
}
