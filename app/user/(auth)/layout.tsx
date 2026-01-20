export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 認証ページではヘッダー・メニューなし
  return <div style={{ minHeight: "100vh" }}>{children}</div>;
}