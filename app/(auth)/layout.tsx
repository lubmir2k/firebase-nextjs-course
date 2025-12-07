export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="max-w-screen-sm mx-auto p-5">{children}</div>;
}
