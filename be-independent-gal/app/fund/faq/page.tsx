import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'

export const metadata: Metadata = {
  title: 'BIG Fund FAQ | Frequently Asked Questions',
  description: 'Find answers to common questions about BIG Fund, eligibility, application process, and funding options.',
}

const faqs = [
  {
    category: 'Eligibility',
    questions: [
      {
        q: 'Who can apply for BIG Fund?',
        a: 'Any woman founder or co-founder with a business idea or existing business can apply. You must be a member of the BIG community with at least 3 months of activity.',
      },
      {
        q: 'Do I need to have revenue to apply?',
        a: 'No! We fund businesses at all stages, from pre-launch ideas to established companies. If you have an idea and passion, we want to hear from you.',
      },
      {
        q: 'What if my business is outside the US?',
        a: 'Currently, BIG Fund is available for women-led businesses in the US and Canada. We&apos;re expanding internationally soon. Check back for updates!',
      },
      {
        q: 'Can co-founders apply together?',
        a: 'Yes! If at least one co-founder is a woman, you&apos;re eligible. We particularly encourage all-women founding teams.',
      },
    ],
  },
  {
    category: 'Application Process',
    questions: [
      {
        q: 'How long does the application process take?',
        a: 'Our typical timeline is 2-4 weeks from application to a funding decision. Exceptional applications may be approved faster.',
      },
      {
        q: 'When do applications close?',
        a: 'BIG Fund accepts applications year-round on a rolling basis. However, we have quarterly review cycles for certain funding tiers.',
      },
      {
        q: 'What documents do I need to submit?',
        a: 'At minimum: your application form, a one-page business overview, and financial projections if available. Additional documents may be requested during review.',
      },
      {
        q: 'Can I apply for more than one funding type?',
        a: 'You can apply for multiple funding programs, but we recommend focusing on the program that best fits your current needs.',
      },
    ],
  },
  {
    category: 'Funding Details',
    questions: [
      {
        q: 'What&apos;s the difference between grants and loans?',
        a: 'Grants don&apos;t need to be repaid and have no equity stake. Loans require repayment with interest. Both come with mentorship and support.',
      },
      {
        q: 'What are the terms for loans?',
        a: 'Loan terms vary by program, ranging from 2-5 years with competitive interest rates. We&apos;re flexible and work with your cash flow.',
      },
      {
        q: 'Does equity investment mean losing control?',
        a: 'No. We take minority stakes (typically 5-20%) and act as advisors, not operators. You maintain control of your business.',
      },
      {
        q: 'How quickly will I receive the funds?',
        a: 'Once approved, most founders receive their funding within 2-3 weeks. Verification and legal processes determine the exact timeline.',
      },
    ],
  },
  {
    category: 'Support & Resources',
    questions: [
      {
        q: 'Do I get mentorship along with the funding?',
        a: 'Absolutely! All BIG Fund recipients get access to mentorship from experienced entrepreneurs and industry experts.',
      },
      {
        q: 'What if I&apos;m rejected? Can I reapply?',
        a: 'Of course! We encourage reapplication. We&apos;ll provide feedback on why you weren&apos;t selected and suggestions for strengthening your next application.',
      },
      {
        q: 'Is there a limit to how much I can receive?',
        a: 'Limits vary by program. Grants top out at $25k, while growth capital can reach $500k+. Amount depends on your needs and business stage.',
      },
      {
        q: 'Are there any strings attached?',
        a: 'Our funding comes with support, not strings. We don&apos;t dictate how you run your business, but we do encourage smart financial management.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Common Questions About BIG Fund"
        description="Find answers to your questions about funding, eligibility, and our application process. Can't find what you're looking for? Contact our team."
      />

      <section className="bg-background py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {faqs.map((section) => (
            <div key={section.category} className="mb-16">
              <h2 className="font-heading text-2xl font-bold text-secondary mb-8">
                {section.category}
              </h2>
              <div className="space-y-6">
                {section.questions.map((qa, idx) => (
                  <details
                    key={idx}
                    className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-secondary/30"
                  >
                    <summary className="flex cursor-pointer items-center justify-between font-heading text-base font-semibold text-foreground">
                      {qa.q}
                      <span className="text-secondary transition-transform group-open:rotate-180">
                        ▼
                      </span>
                    </summary>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {qa.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-16 rounded-2xl bg-muted p-8 text-center">
            <h3 className="font-heading text-lg font-bold text-secondary">
              Still have questions?
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Our team is here to help. Reach out to fund@beindependentgal.com or schedule a call with our funding specialists.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
