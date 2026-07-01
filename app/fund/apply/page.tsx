import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/page-hero'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export const metadata: Metadata = {
  title: 'Apply for BIG Fund | BIG',
  description:
    'Apply for BIG Fund and access capital for your business. Complete our simple application process and get funded.',
  openGraph: {
    title: 'Apply for BIG Fund | BIG',
    description: 'Access capital to grow your business with BIG Fund',
    images: ['/og-image.jpg'],
  },
}

export default function ApplyPage() {
  return (
    <>
      {/* Hero */}
      <PageHero
        title="Apply for BIG Fund"
        subtitle="Access capital to grow your business"
        description="Get the funding you need to take your business to the next level. Our simple application process connects women entrepreneurs with capital, mentorship, and community support."
        cta1={{ text: 'Start Application', href: '#application' }}
        cta2={{ text: 'Learn More', href: '#faq' }}
        imageSrc="/images/fund-hero.jpg"
      />

      {/* Application Info */}
      <section className="py-12 bg-blue-50 px-6 sm:px-12 lg:px-16 border-b border-blue-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-sm text-blue-600 font-bold mb-2">FUNDING AVAILABLE</p>
              <p className="text-3xl font-bold text-blue-900">Up to KES 5M</p>
            </div>
            <div>
              <p className="text-sm text-blue-600 font-bold mb-2">PROCESSING TIME</p>
              <p className="text-3xl font-bold text-blue-900">5 Business Days</p>
            </div>
            <div>
              <p className="text-sm text-blue-600 font-bold mb-2">ACCEPTANCE RATE</p>
              <p className="text-3xl font-bold text-blue-900">45%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application" className="py-20 bg-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Application Form</h2>
            <p className="text-gray-600">
              Complete this form to apply for BIG Fund. All fields marked with * are required.
            </p>
          </div>

          <form className="space-y-12">
            {/* Section 1: Founder Info */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-secondary- text-white flex items-center justify-center font-bold">
                  1
                </span>
                About You
              </h3>

              <div className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-bold">
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Jane Doe"
                    required
                    className="h-12 rounded-xl"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane@example.com"
                    required
                    className="h-12 rounded-xl"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-bold">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+254 7XX XXX XXX"
                    required
                    className="h-12 rounded-xl"
                  />
                </div>

                {/* LinkedIn (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="text-sm font-bold">
                    LinkedIn Profile (Optional)
                  </Label>
                  <Input
                    id="linkedin"
                    type="url"
                    placeholder="https://linkedin.com/in/janedoe"
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Business Info */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-secondary- text-white flex items-center justify-center font-bold">
                  2
                </span>
                About Your Business
              </h3>

              <div className="space-y-6">
                {/* Business Name */}
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-sm font-bold">
                    Business Name *
                  </Label>
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="Your Business Name"
                    required
                    className="h-12 rounded-xl"
                  />
                </div>

                {/* Industry */}
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-sm font-bold">
                    Industry *
                  </Label>
                  <select
                    id="industry"
                    required
                    className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-secondary-"
                  >
                    <option value="">Select an industry</option>
                    <option value="technology">Technology</option>
                    <option value="retail">Retail & E-Commerce</option>
                    <option value="services">Services</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="health">Health & Wellness</option>
                    <option value="education">Education</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="hospitality">Hospitality & Tourism</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Business Stage */}
                <div className="space-y-2">
                  <Label htmlFor="stage" className="text-sm font-bold">
                    Business Stage *
                  </Label>
                  <select
                    id="stage"
                    required
                    className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-secondary-"
                  >
                    <option value="">Select a stage</option>
                    <option value="idea">Idea Stage</option>
                    <option value="pre-launch">Pre-Launch</option>
                    <option value="early-revenue">Early Revenue</option>
                    <option value="growth">Growth</option>
                    <option value="scale">Scale</option>
                  </select>
                </div>

                {/* Annual Revenue */}
                <div className="space-y-2">
                  <Label htmlFor="revenue" className="text-sm font-bold">
                    Annual Revenue *
                  </Label>
                  <select
                    id="revenue"
                    required
                    className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-secondary-"
                  >
                    <option value="">Select revenue range</option>
                    <option value="0">No revenue yet</option>
                    <option value="50k">Under KES 50k</option>
                    <option value="100k">KES 50k - 100k</option>
                    <option value="500k">KES 100k - 500k</option>
                    <option value="1m">KES 500k - 1M</option>
                    <option value="5m">KES 1M - 5M</option>
                    <option value="5m+">KES 5M+</option>
                  </select>
                </div>

                {/* Years in Operation */}
                <div className="space-y-2">
                  <Label htmlFor="yearsOp" className="text-sm font-bold">
                    Years in Operation *
                  </Label>
                  <Input
                    id="yearsOp"
                    type="number"
                    placeholder="0"
                    min="0"
                    required
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Funding Request */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-secondary- text-white flex items-center justify-center font-bold">
                  3
                </span>
                Funding Request
              </h3>

              <div className="space-y-6">
                {/* Amount Seeking */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-bold">
                    How much are you seeking? (KES) *
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="500,000"
                    min="10000"
                    max="5000000"
                    required
                    className="h-12 rounded-xl"
                  />
                  <p className="text-xs text-gray-500">Minimum: KES 10,000 | Maximum: KES 5,000,000</p>
                </div>

                {/* Funding Type */}
                <div className="space-y-2">
                  <Label htmlFor="fundingType" className="text-sm font-bold">
                    Type of Funding *
                  </Label>
                  <select
                    id="fundingType"
                    required
                    className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-secondary-"
                  >
                    <option value="">Select funding type</option>
                    <option value="grant">Grant</option>
                    <option value="loan">Loan</option>
                    <option value="equity">Equity Investment</option>
                    <option value="flexible">Flexible (Open to options)</option>
                  </select>
                </div>

                {/* Use of Funds */}
                <div className="space-y-2">
                  <Label htmlFor="useOfFunds" className="text-sm font-bold">
                    How will you use the funds? *
                  </Label>
                  <Textarea
                    id="useOfFunds"
                    placeholder="Describe how you'll use the funding (e.g., inventory, equipment, marketing, hiring, etc.)"
                    rows={5}
                    required
                    className="rounded-xl"
                  />
                  <p className="text-xs text-gray-500">Minimum 50 characters</p>
                </div>
              </div>
            </div>

            {/* Section 4: Business Vision */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-secondary- text-white flex items-center justify-center font-bold">
                  4
                </span>
                Tell Us About Your Vision
              </h3>

              <div className="space-y-6">
                {/* Business Mission */}
                <div className="space-y-2">
                  <Label htmlFor="mission" className="text-sm font-bold">
                    What's your business mission? *
                  </Label>
                  <Textarea
                    id="mission"
                    placeholder="Describe your business mission and what problem you're solving"
                    rows={5}
                    required
                    className="rounded-xl"
                  />
                </div>

                {/* Impact */}
                <div className="space-y-2">
                  <Label htmlFor="impact" className="text-sm font-bold">
                    What impact will this have on your community? *
                  </Label>
                  <Textarea
                    id="impact"
                    placeholder="Describe the positive impact your business will have on your community (jobs created, problems solved, etc.)"
                    rows={5}
                    required
                    className="rounded-xl"
                  />
                </div>

                {/* Additional Info */}
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo" className="text-sm font-bold">
                    Anything else we should know? (Optional)
                  </Label>
                  <Textarea
                    id="additionalInfo"
                    placeholder="Share any additional information about your business or application"
                    rows={4}
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 space-y-4">
              <div className="flex gap-3">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="w-5 h-5 rounded border-gray-300 text-secondary- focus:ring-secondary- cursor-pointer mt-1"
                />
                <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                  I confirm that all information provided in this application is accurate and complete. *
                </label>
              </div>

              <div className="flex gap-3">
                <input
                  id="privacy"
                  type="checkbox"
                  required
                  className="w-5 h-5 rounded border-gray-300 text-secondary- focus:ring-secondary- cursor-pointer mt-1"
                />
                <label htmlFor="privacy" className="text-sm text-gray-700 cursor-pointer">
                  I agree to BIG's privacy policy and terms of service. *
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="space-y-4">
              <Button className="w-full bg-secondary- hover:bg-secondary- text-white font-bold rounded-full h-12 text-lg">
                Submit Application
              </Button>

              <p className="text-xs text-gray-600 text-center">
                We'll review your application within 5 business days and contact you with next steps.
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50 px-6 sm:px-12 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'Who is eligible to apply?',
                a: 'Any woman-owned business that is registered and operating in Kenya. We welcome businesses at all stages from idea to scale.',
              },
              {
                q: 'What documents do I need to apply?',
                a: 'For the initial application, we only need the information in the form. If selected, we may request additional documents like business registration, financial statements, or a business plan.',
              },
              {
                q: 'How long does the review process take?',
                a: 'We aim to review all applications within 5 business days. Selected applicants will be invited for an interview within 2 weeks.',
              },
              {
                q: 'What are the success factors for approval?',
                a: 'We look for: clear business mission, market understanding, realistic use of funds, community impact, and founder commitment. We believe in your potential, not just your current numbers.',
              },
              {
                q: 'What happens if I am approved?',
                a: 'You will receive a funding agreement outlining the terms. You will also get paired with a mentor and have access to our community and academy resources.',
              },
              {
                q: 'Can I apply if my business is still in the idea stage?',
                a: 'Yes! We fund ideas, not just existing businesses. Tell us your vision and how you plan to execute it.',
              },
            ].map((item, idx) => (
              <details key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 cursor-pointer group">
                <summary className="flex items-center justify-between font-bold text-gray-900 select-none">
                  {item.q}
                  <span className="text-secondary- group-open:rotate-180 transition-transform">+</span>
                </summary>
                <p className="text-gray-600 mt-4 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 bg-white px-6 sm:px-12 lg:px-16 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-8">
            Questions about the application process? We're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:fund@big.org">
              <Button className="bg-secondary- hover:bg-secondary- text-white font-bold rounded-full h-12 px-8">
                Email Us
              </Button>
            </a>
            <a href="https://calendly.com/big/consultation">
              <Button variant="outline" className="border-2 border-secondary- text-secondary- hover:bg-secondary- font-bold rounded-full h-12 px-8">
                Schedule a Call
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
