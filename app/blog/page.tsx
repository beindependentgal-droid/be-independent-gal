import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getPublishedArticles } from '@/app/actions/article-actions'
import { Badge } from '@/components/ui/badge'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { Eye, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog | BIG',
  description:
    'Read inspiring stories, expert advice, and learn from the experiences of women in the BIG community. Your hub for growth and insights.',
  openGraph: {
    title: 'Blog | BIG',
    description: 'Inspiring stories and insights from the BIG community.',
    images: ['/og-image.jpg'],
  },
}

interface Article {
  id: string
  slug: string
  title: string
  excerpt?: string
  featured_image_url?: string
  circle_name?: string
  view_count: number
  comment_count: number // Assuming this field exists from your API
}

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const articles: Article[] = await getPublishedArticles(20)

  return (
    <>
      {/* Hero */}
      <PageHero
        title="Community Blog"
        subtitle="Stories, insights, and wisdom from independent women"
        description="Dive into inspiring articles, expert advice, and real-life experiences shared by our community members and thought leaders."
        cta1={{ text: 'View All Articles', href: '#articles' }}
        imageSrc="/images/blog-hero.jpg"
      />

      {/* Main Blog Articles */}
      <section id="articles" className="py-20 bg-gray-50 px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="Latest Articles"
            subtitle="Fresh insights from our community"
            description="Stay updated with the newest posts, tips, and stories."
          />

          {articles.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 mt-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No articles yet
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Check back soon for inspiring stories and insights from the BIG community!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {articles.map((article) => (
                <Link key={article.id} href={`/blog/${article.slug}`}>
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-pink-300 hover:shadow-xl transition-all h-full flex flex-col">
                    {/* Featured Image */}
                    {article.featured_image_url && (
                      <div className="relative aspect-video overflow-hidden bg-gray-300">
                        <FallbackImage
                          src={article.featured_image_url}
                          alt={article.title}
                          fill
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          fallbackSrc="/images/article-placeholder.jpg"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      {article.circle_name && (
                        <Badge className="bg-purple-100 text-purple-700 font-bold mb-3 w-fit">
                          {article.circle_name}
                        </Badge>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-pink-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      {article.excerpt && (
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                          {article.excerpt}
                        </p>
                      )}

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{article.view_count.toLocaleString()} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{article.comment_count} comments</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories / Trending Section (Optional - Add your own content here) */}
      <section className="py-20 bg-white px-6 sm:px-12 lg:px-16 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <SectionHeading
            title="Explore by Category"
            subtitle="Find topics that empower you"
            description="Discover articles sorted by your favorite BIG pillars or specific themes."
          />
          <div className="flex flex-wrap justify-center gap-3 mt-12">
            <Link href="/blog?category=learn">
              <Button variant="outline" className="rounded-full">📚 Learn</Button>
            </Link>
            <Link href="/blog?category=connect">
              <Button variant="outline" className="rounded-full">🤝 Connect</Button>
            </Link>
            <Link href="/blog?category=earn">
              <Button variant="outline" className="rounded-full">💰 Earn</Button>
            </Link>
            <Link href="/blog?category=thrive">
              <Button variant="outline" className="rounded-full">❤️ Thrive</Button>
            </Link>
            <Link href="/blog?category=mentorship">
              <Button variant="outline" className="rounded-full">👩‍🏫 Mentorship</Button>
            </Link>
            <Link href="/blog?category=wellness">
              <Button variant="outline" className="rounded-full">🧘‍♀️ Wellness</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}