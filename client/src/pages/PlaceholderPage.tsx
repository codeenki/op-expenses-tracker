/* ============================================
   PLACEHOLDER PAGE
   Temporary component used for pages that 
   haven't been built yet. Displays the page
   name so we can verify routing works.
   ============================================ */

interface PlaceholderPageProps {
  title: string;
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        color: "var(--color-text-tertiary)",
        fontSize: "var(--font-size-lg)",
      }}
    >
      {title} — coming soon
    </div>
  );
}
