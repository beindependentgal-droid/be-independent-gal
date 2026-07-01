'use client'

import Link from 'next/link'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { Button } from '@/components/ui/button'
import { ChevronDown, Mail, Calendar } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  {
    category: 'Eligibility',
    icon: '✨',
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
        q: 'What if my business is outside Kenya?',
        a: 'Currently, BIG Fund is available for women-led businesses in Kenya. We\'re expanding internationally soon. Check back for updates!',
      },
      {
        q: 'Can co-founders apply together?',
        a: 'Yes! If at least one co-founder is a woman, you\'re eligible. We particularly encourage all-women founding teams.',
      },
      {
        q: 'What about international founders?',
        a: 'We\'re open to applications from women who have a business operating in Kenya, even if they\'re based elsewhere.',
      },
    ],
  },
  {
    category: 'Application Process',
    icon: '📋',
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
      {
        q: 'What happens after I submit my application?',
        a: 'We review your application and may request additional information. If selected, you\'ll be invited for an interview with our funding team.',
      },
    ],
  },
  {
    category: 'Funding Details',
    icon: '💰',
    questions: [
      {
        q: 'What\'s the difference between grants and loans?',
        a: 'Grants don\'t need to be repaid and have no equity stake. Loans require repayment with interest. Both come with mentorship and support.',
      },
      {
        q: 'What are the terms for loans?',
        a: 'Loan terms vary by program, ranging from 2-5 years with competitive interest rates. We\'re flexible and work with your cash flow.',
      },
      {
        q: 'Does equity investment mean losing control?',
        a: 'No. We take minority stakes (typically 5-20%) and act as advisors, not operators. You maintain control of your business.',
      },
      {
        q: 'How quickly will I receive the funds?',
        a: 'Once approved, most founders receive their funding within 2-3 weeks. Verification and legal processes determine the exact timeline.',
      },
      {
        q: 'What\'s the minimum amount I can receive?',
        a: 'Minimum amounts vary by program. Grants start at KES 50,000, while loans begin at KES 100,000. Growth capital has higher minimums.',
      },
    ],
  },
  {
    category: 'Support & Resources',
    icon: '🤝',
    questions: [
      {
        q: 'Do I get mentorship along with the funding?',
        a: 'Absolutely! All BIG Fund recipients get access to mentorship from experienced entrepreneurs and industry experts in our community.',
      },
      {
        q: 'What if I\'m rejected? Can I reapply?',
        a: 'Of course! We encourage reapplication. We\'ll provide feedback on why you weren\'t selected and suggestions for strengthening your next application.',
      },
      {
        q: 'Is there a limit to how much I can receive?',
        a: 'Limits vary by program. Grants top out at KES 500,000, while growth capital can reach KES 5M+. Amount depends on your needs and business stage.',
      },
      {
        q: 'Are there any strings attached?',
        a: 'Our funding comes with support, not strings. We don\'t dictate how you run your business, but we do encourage smart financial management.',
      },
      {
        q: 'Do you require equity or collateral?',
        a: 'This depends on the program. Grants require neither. Loans may require collateral or personal guarantees. Equity investments are optional.',
      },
    ],
  },
  {
    category: 'After Funding',
    icon: '🚀',
    questions: [
      {
        q: 'What are the reporting requirements?',
        a: 'We ask for quarterly updates on how you\'re using the funds and your business progress. This helps us support you better.',
      },
      {
        q: 'Can I use the funds for anything I want?',
        a: 'Generally yes, but funds should be used for business purposes outlined in your application. We\'re flexible but ask for transparency.',
      },
      {
        q: 'What if my business doesn\'t perform as expected?',
        a: 'We understand business is unpredictable. We\'ll work with you on loan repayment plans and provide additional mentorship to get back on track.',
      },
      {
        q: 'Can I get additional funding in the future?',
        a: 'Yes! Successful BIG Fund recipients are first in line for follow-up funding rounds as your business grows.',
      },
    ],
  },
]

function FAQSection({ section }: { section: (typeof faqs)[0] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-4xl">{section.icon}</span>
        <h2 className="text-3xl font-bold text-gray-900">{section.category}</h2>
      </div>

      <div className="space-y-4">
        {section.questions.map((qa, idx) => (
          <FAQItem key={idx} question={qa.q} answer={qa.a} />
        ))}
      </div>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <details className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-pink-300 transition-colors cursor-pointer group">
      <summary
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-6 font-bold text-gray-900 select-none hover:bg-gray-50 transition-colors"
      >
        <span className="text-left flex-1">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-600 flex-shrink-0 ml-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </summary>

      {isOpen && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-4 text-gray-600 leading-relaxed">
          {answer}
        </div>
      )}
    </details>
  )
}

export default function FAQPage() {
  return (
    <>
      {/* Hero */}
      <PageHero
        title="BIG Fund FAQ"
        subtitle="Answers to your questions"
        description="Everything you need to know about BIG Fund, eligibility, the application process, and funding options."
        cta1={{ text: 'Apply Now', href: '/fund/apply' }}
        cta2={{ text: 'Learn More', href: '#faq' }}
        imageSrc="/images/faq-hero.jpg"
      />

      {/* FAQ Sections */}
      <section id="faq" className="py-20 bg-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-4xl mx-auto space-y-20">
          {faqs.map((section, idx) => (
            <FAQSection key={idx} section={section} />
          ))}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-20 bg-primary text-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Still have questions?</h2>
            <p className="text-xl text-gray-600">
              Our team is here to help. Get in touch with our funding specialists.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:fund@big.org">
              <Button className="bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full h-12 px-8 flex items-center gap-2 w-full sm:w-auto justify-center">
                <Mail className="w-4 h-4" />
                Email Us
              </Button>
            </a>

            <a href="https://calendly.com/big/fund-consultation">
              <Button
                variant="outline"
                className="border-2 border-pink-500 text-pink-600 hover:bg-pink-50 font-bold rounded-full h-12 px-8 flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <Calendar className="w-4 h-4" />
                Schedule a Call
              </Button>
            </a>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Contact Information</h3>
            <div className="space-y-2 text-left">
              <p className="text-gray-700">
                <span className="font-bold">Email:</span>{' '}
                <a href="mailto:fund@big.org" className="text-pink-600 hover:text-pink-700">
                  fund@big.org
                </a>
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Response Time:</span> 24-48 hours
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Office Hours:</span> Monday - Friday, 9am - 5pm EAT
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-white px-6 sm:px-12 lg:px-16 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Ready to Apply?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/fund/apply">
              <div className="rounded-2xl bg-white border-2 border-border p-8 text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Apply for Funding</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Start your application in minutes
                </p>
                <span className="inline-block text-pink-600 font-bold">Get Started →</span>
              </div>
            </Link>

            <Link href="/fund">
              <div className="rounded-2xl bg-white border-2 border-border p-8 text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="text-4xl mb-4">💡</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Learn About BIG Fund</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Understand our programs and requirements
                </p>
                <span className="inline-block text-purple-600 font-bold">Explore →</span>
              </div>
            </Link>

            <Link href="/community">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-300 p-8 text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Join the Community</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Become a BIG member first
                </p>
                <span className="inline-block text-blue-600 font-bold">Join Now →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}