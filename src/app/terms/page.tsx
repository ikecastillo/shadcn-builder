"use client";

import { BlocksIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/landingpage/header";
import Footer from "@/components/landingpage/footer";

export default function TermsOfServicePage() {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-24 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
            <p className="text-lg text-muted-foreground">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <Separator />

          {/* Content */}
          <div className="prose prose-gray max-w-none space-y-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using shadcn/ui Builder ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                shadcn/ui Builder is a web-based form building tool that allows users to create, customize, and deploy forms using a drag-and-drop interface. The service includes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Form builder with various input components</li>
                <li>Pre-built templates for common use cases</li>
                <li>Code generation for React components</li>
                <li>Form data management and export</li>
                <li>Responsive design capabilities</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">User Accounts and Responsibilities</h2>
              <div className="space-y-3">
                <h3 className="text-xl font-medium">Account Creation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You may need to create an account to access certain features. You are responsible for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Providing accurate and current information</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-medium">Acceptable Use</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You agree not to use the service to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Transmit harmful, offensive, or inappropriate content</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with the proper functioning of the service</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Intellectual Property</h2>
              <div className="space-y-3">
                <h3 className="text-xl font-medium">Our Content</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The service and its original content, features, and functionality are owned by shadcn/ui Builder and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>

                <h3 className="text-xl font-medium">Your Content</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You retain ownership of any content you create using our service. By using our service, you grant us a limited license to host, store, and display your content as necessary to provide the service.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Service Availability</h2>
              <p className="text-muted-foreground leading-relaxed">
                We strive to maintain high availability of our service, but we do not guarantee uninterrupted access. We reserve the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Perform scheduled maintenance</li>
                <li>Make updates and improvements</li>
                <li>Suspend service for security reasons</li>
                <li>Modify or discontinue features with notice</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                To the maximum extent permitted by law, shadcn/ui Builder shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You may also terminate your account at any time by contacting us or ceasing to use the service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the service. Your continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be interpreted and governed by the laws of [Your Jurisdiction], without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of [Your Jurisdiction].
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-medium">shadcn/ui Builder</p>
                <p className="text-muted-foreground">Email: legal@shadcnuibuilder.com</p>
                <p className="text-muted-foreground">Address: [Your Business Address]</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
