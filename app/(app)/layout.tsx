import Navbar from "@/components/ui/Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen  bg-background">
      <Navbar/>
      {children}
    </main>
  );
}