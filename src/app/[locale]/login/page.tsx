import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { PageLayout } from "@/components/layouts";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export default function LoginPage() {
  return (
    <PageLayout variant="gradient" showHeader={false}>
      <div className="flex h-full items-center justify-center px-4">
        {/* Back Button */}
        <Link href="/" className="absolute top-4 left-4 sm:top-8 sm:left-8">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
        </Link>

        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <Logo size="md" className="mx-auto w-fit" />

          {/* Login Form */}
          <LoginForm />
        </div>
      </div>
    </PageLayout>
  );
}
