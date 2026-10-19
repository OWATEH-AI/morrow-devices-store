"use client";

export default function StoreError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="page-wrap setup-page" role="alert">
      <p className="eyebrow">CATALOGUE CONNECTION</p>
      <h1>We could not load the store catalogue.</h1>
      <p>The configured content service did not respond. No sample products were substituted. Please try again, or check the Sanity project settings.</p>
      <button className="button button-dark" type="button" onClick={() => reset()}>Try again</button>
    </main>
  );
}