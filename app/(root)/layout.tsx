import NavBar from "@/components/NavBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <main className="mx-auto px-4 md:px-8 lg:px-16 pt-16 pb-8">
        {children}
      </main>
    </>
  );
}
