export const metadata = {
  title: "Next.js Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
