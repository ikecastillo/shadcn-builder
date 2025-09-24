import { SignIn } from "@clerk/nextjs";
import Header from "@/components/landingpage/header";
import Footer from "@/components/landingpage/footer";

export default function SignInPage() {
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Header />
      <div className="flex items-start justify-center bg-dotted pt-24 flex-1">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
              card: "shadow-none",
              cardBox: "!border !shadow-sm",
              headerTitle: "text-gray-900",
              headerSubtitle: "text-gray-600",
              socialButtonsBlockButton:
                "border border-gray-300 hover:bg-gray-50",
              socialButtonsBlockButtonText: "font-normal",
              formFieldInput:
                "border border-gray-300 focus:border-blue-500 focus:ring-blue-500",
              footerActionLink: "text-blue-600 hover:text-blue-500",
            },
          }}
          signUpUrl="/sign-up"
        />
      </div>
      <Footer />
    </div>
  );
}
