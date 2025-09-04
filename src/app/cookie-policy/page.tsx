"use client";

import { BlocksIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/landingpage/header";
import Footer from "@/components/landingpage/footer";

export default function CookiePolicyPage() {
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
            <h1 className="text-4xl font-bold tracking-tight">Cookie Policy</h1>
            <p className="text-lg text-muted-foreground">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <Separator />

          {/* Content */}
          <div className="prose prose-gray max-w-none space-y-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">What Are Cookies?</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This Cookie Policy explains how shadcn/ui Builder uses cookies and similar technologies when you visit our website.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Types of Cookies We Use</h2>
              
              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="text-xl font-medium mb-2">Essential Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    These cookies are necessary for the website to function properly. They enable basic features like page navigation and access to secure areas.
                  </p>
                  <div className="bg-muted p-3 rounded text-sm">
                    <strong>Examples:</strong> Session management, authentication, security
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-xl font-medium mb-2">Performance Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    These cookies collect information about how visitors use our website, such as which pages are visited most often and if users receive error messages.
                  </p>
                  <div className="bg-muted p-3 rounded text-sm">
                    <strong>Examples:</strong> Google Analytics, page load times, error tracking
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-xl font-medium mb-2">Functional Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    These cookies allow the website to remember choices you make and provide enhanced, more personal features.
                  </p>
                  <div className="bg-muted p-3 rounded text-sm">
                    <strong>Examples:</strong> Language preferences, form data, theme settings
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-xl font-medium mb-2">Targeting/Advertising Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    These cookies are used to deliver content more relevant to you and your interests.
                  </p>
                  <div className="bg-muted p-3 rounded text-sm">
                    <strong>Examples:</strong> Social media widgets, advertising networks
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Third-Party Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may use third-party services that place cookies on your device. These services include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Google Analytics:</strong> To analyze website traffic and user behavior</li>
                <li><strong>PostHog:</strong> For product analytics and user experience tracking</li>
                <li><strong>Social Media Platforms:</strong> For social sharing and authentication</li>
                <li><strong>Content Delivery Networks:</strong> For faster loading of resources</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Cookie Duration</h2>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-lg font-medium">Session Cookies</h3>
                  <p className="text-muted-foreground">
                    These cookies are temporary and are deleted when you close your browser.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-lg font-medium">Persistent Cookies</h3>
                  <p className="text-muted-foreground">
                    These cookies remain on your device for a set period or until you delete them manually.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Managing Your Cookie Preferences</h2>
              <p className="text-muted-foreground leading-relaxed">
                You have several options for managing cookies:
              </p>
              
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-blue-900">Browser Settings</h3>
                  <p className="text-blue-800 text-sm mt-1">
                    Most browsers allow you to control cookies through their settings. You can set your browser to reject cookies or to alert you when cookies are being sent.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-yellow-900">Opt-Out Links</h3>
                  <p className="text-yellow-800 text-sm mt-1">
                    For third-party analytics and advertising cookies, you can opt out directly through their respective services.
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-red-900">Impact of Disabling Cookies</h3>
                  <p className="text-red-800 text-sm mt-1">
                    Please note that disabling cookies may affect the functionality of our website and your user experience.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Cookie Table</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-muted">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left">Cookie Name</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-mono">session_id</td>
                      <td className="border border-gray-300 px-4 py-2">User session management</td>
                      <td className="border border-gray-300 px-4 py-2">Essential</td>
                      <td className="border border-gray-300 px-4 py-2">Session</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-gray-300 px-4 py-2 font-mono">_ga</td>
                      <td className="border border-gray-300 px-4 py-2">Google Analytics tracking</td>
                      <td className="border border-gray-300 px-4 py-2">Performance</td>
                      <td className="border border-gray-300 px-4 py-2">2 years</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-mono">theme_preference</td>
                      <td className="border border-gray-300 px-4 py-2">Remember user theme choice</td>
                      <td className="border border-gray-300 px-4 py-2">Functional</td>
                      <td className="border border-gray-300 px-4 py-2">1 year</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-gray-300 px-4 py-2 font-mono">form_builder_state</td>
                      <td className="border border-gray-300 px-4 py-2">Save form builder progress</td>
                      <td className="border border-gray-300 px-4 py-2">Functional</td>
                      <td className="border border-gray-300 px-4 py-2">30 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Updates to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-medium">shadcn/ui Builder</p>
                <p className="text-muted-foreground">Email: cookies@shadcnuibuilder.com</p>
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
