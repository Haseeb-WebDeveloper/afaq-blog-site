import Navbar from "@/components/ui/navbar";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {children}
      {/* <Footer /> */}
    </div>
  );
}
