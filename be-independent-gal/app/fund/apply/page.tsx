import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/page-hero'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Apply for BIG Fund | Funding Application',
  description: 'Apply for BIG Fund and access capital for your business. Complete our simple application process.',
}

export default function ApplyPage() {
  return (
    <>
      <PageHero
        eyebrow="BIG Fund Application"
        title="Start Your Funding Journey"
        description="Tell us about your business, your vision, and your needs. We'll review your application and connect with you within 5 business days."
      />

      <section className="bg-background py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-12">
            <form className="space-y-8">
              {/* Founder Info */}
              <fieldset className="space-y-6 border-b border-border pb-8">
                <legend className="font-heading text-lg font-bold text-secondary">
                  About You
                </legend>
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-foreground">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Your full name"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-foreground">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="(555) 000-0000"
                    />
                  </div>
                </div>
              </fieldset>

              {/* Business Info */}
              <fieldset className="space-y-6 border-b border-border pb-8">
                <legend className="font-heading text-lg font-bold text-secondary">
                  About Your Business
                </legend>
                <div className="space-y-2">
                  <label htmlFor="business" className="block text-sm font-medium text-foreground">
                    Business Name
                  </label>
                  <input
                    type="text"
                    id="business"
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Your business name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="industry" className="block text-sm font-medium text-foreground">
                    Industry
                  </label>
                  <select
                    id="industry"
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Select an industry</option>
                    <option value="tech">Technology</option>
                    <option value="retail">Retail & E-Commerce</option>
                    <option value="services">Services</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="health">Health & Wellness</option>
                    <option value="education">Education</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="stage" className="block text-sm font-medium text-foreground">
                      Business Stage
                    </label>
                    <select
                      id="stage"
                      className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Select a stage</option>
                      <option value="idea">Idea Stage</option>
                      <option value="launch">Pre-Launch</option>
                      <option value="early">Early Revenue</option>
                      <option value="growth">Growth</option>
                      <option value="scale">Scale</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="revenue" className="block text-sm font-medium text-foreground">
                      Annual Revenue
                    </label>
                    <select
                      id="revenue"
                      className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Select revenue</option>
                      <option value="0">No revenue yet</option>
                      <option value="50k">Under $50k</option>
                      <option value="100k">$50k - $100k</option>
                      <option value="500k">$100k - $500k</option>
                      <option value="1m">$500k - $1M</option>
                      <option value="5m">$1M - $5M</option>
                      <option value="5m+">$5M+</option>
                    </select>
                  </div>
                </div>
              </fieldset>

              {/* Funding Request */}
              <fieldset className="space-y-6 border-b border-border pb-8">
                <legend className="font-heading text-lg font-bold text-secondary">
                  Funding Request
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="amount" className="block text-sm font-medium text-foreground">
                      How much are you seeking?
                    </label>
                    <input
                      type="number"
                      id="amount"
                      className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="$50,000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="fundType" className="block text-sm font-medium text-foreground">
                      Type of Funding
                    </label>
                    <select
                      id="fundType"
                      className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Select funding type</option>
                      <option value="grant">Grant</option>
                      <option value="loan">Loan</option>
                      <option value="equity">Equity Investment</option>
                      <option value="flexible">Flexible (Open to options)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="use" className="block text-sm font-medium text-foreground">
                    How will you use the funds?
                  </label>
                  <textarea
                    id="use"
                    rows={4}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Describe your plans for the funding (e.g., inventory, hiring, marketing, equipment)"
                  />
                </div>
              </fieldset>

              {/* Business Description */}
              <fieldset className="space-y-6">
                <legend className="font-heading text-lg font-bold text-secondary">
                  Tell Us About Your Vision
                </legend>
                <div className="space-y-2">
                  <label htmlFor="mission" className="block text-sm font-medium text-foreground">
                    What&apos;s your business mission?
                  </label>
                  <textarea
                    id="mission"
                    rows={4}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Describe what you&apos;re building and why it matters to you"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="impact" className="block text-sm font-medium text-foreground">
                    What impact will this have on your community?
                  </label>
                  <textarea
                    id="impact"
                    rows={4}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Tell us about the positive change you want to create"
                  />
                </div>
              </fieldset>

              {/* Submit */}
              <div className="flex flex-col gap-4 pt-4">
                <Button
                  type="submit"
                  className="w-full rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Submit Application
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  We&apos;ll review your application within 5 business days and contact you with next steps.
                </p>
              </div>
            </form>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Questions before applying?{' '}
              <Link href="/fund/faq" className="font-semibold text-secondary hover:text-secondary/80">
                Check our FAQ
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
