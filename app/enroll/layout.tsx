import { EnrollmentProvider } from "@/lib/enrollment-store";

export default function EnrollLayout({ children }: { children: React.ReactNode }) {
  return (
    <EnrollmentProvider>
      <div className="min-h-screen bg-slate-50">
        {children}
      </div>
    </EnrollmentProvider>
  );
}
