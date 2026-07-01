import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getArticleBySlug, getArticleComments } from '@/app/actions/article-actions'
import { notFound } from 'next/navigation'
import { CalendarDays, Eye, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import FallbackImage from '@/components/ui/fallback-image'
import { SectionHeading } from '@/components/section-heading'
import { CtaBanner } from '@/components/cta-banner'
import type { Article } from '@/lib/db-types'

interface Comment {
  id: string
  content: string
  author_id: string
  author: {
    id: string
    first_name: string
    last_name: string
    avatar_url?: string
  }
  created_at: string
}

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params
  const article = (await getArticleBySlug(slug)) as Article | null

  if (!article) {
    return {
      title: 'Article Not Found | BIG',
      description: 'The requested article could not be found.',
    }
  }

  return {
    title: `${article.title} | BIG`,
    description: article.content.substring(0, 150) + '...', // Use first part of content as description
    openGraph: {
      title: article.title,
      description: article.content.substring(0, 150) + '...',
      images: [article.featured_image_url || '/og-image.jpg'],
      type: 'article',
      publishedTime: article.published_at ?? undefined,
      authors: article.author_name ? [article.author_name] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.content.substring(0, 150) + '...',
      creator: '@BIG', // Assuming a Twitter handle for BIG
      images: [article.featured_image_url || '/og-image.jpg'],
    },
  }
}

export const dynamic = 'force-dynamic'

export default async function ArticlePage({ params }: Props) {
  const { slug } = params
  const article = await getArticleBySlug(slug)

  if (!article) {
    notFound() // Renders Next.js 404 page
  }

  const comments = (await getArticleComments(article.id)) as any[]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Article Header */}
      <header className="bg-white border-b border-gray-200 py-12 px-6 sm:px-12 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-secondary- hover:text-secondary- font-medium mb-4"
          >
            ← Back to Community
          </Link>

          {/* Featured Image */}
          {article.featured_image_url && (
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl mb-8 mx-auto max-w-2xl">
              <FallbackImage
                src={article.featured_image_url}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
                fallbackSrc="/images/article-placeholder.jpg"
              />
            </div>
          )}

          {/* Article Title */}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
            {article.title}
          </h1>

          {/* Author and Meta */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-gray-600 text-sm mb-6">
            {/* Author */}
            <div className="flex items-center gap-2">
              {article.author_avatar_url ? (
                <Image
                  src={article.author_avatar_url}
                  alt={article.author_name ?? 'Author'}
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-secondary- flex items-center justify-center text-xs">
                  {article.author_name ? article.author_name.charAt(0) : 'A'}
                </div>
              )}
              <span className="font-semibold">{article.author_name ?? 'Author'}</span>
            </div>

            {/* Published Date */}
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-secondary-" />
              <span>{article.published_at ? new Date(article.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }) : 'Unknown date'}</span>
            </div>

            {/* Views */}
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-secondary-" />
              <span>{article.view_count.toLocaleString()} views</span>
            </div>

            {/* Circle */}
            {article.circle_name && article.circle_id && (
              <Link href={`/circles/${article.circle_id}`} className="flex items-center gap-2 text-secondary- hover:text-secondary-">
                <MessageCircle className="w-4 h-4" />
                <span>{article.circle_name} Circle</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Article Content */}
      <section className="py-12 px-6 sm:px-12 lg:px-16">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 p-8 lg:p-12 prose prose-pink max-w-none">
          {/* Render HTML content safely */}
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      </section>

      {/* Comments Section */}
      <section className="py-12 bg-gray-50 px-6 sm:px-12 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            title={`Comments (${comments.length})`}
            subtitle="Share your thoughts"
          />

          <div className="mt-8 space-y-6">
            {comments.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <div className="text-5xl mb-4">💬</div>
                <p className="text-gray-600 text-lg mb-2">No comments yet.</p>
                <p className="text-gray-500 text-sm">Be the first to share your thoughts!</p>
                <Button className="mt-6 bg-secondary- hover:bg-secondary- text-white font-bold rounded-full h-11 px-6">
                  Add a Comment
                </Button>
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 flex items-start gap-4"
                >
                  {/* Author Avatar */}
                  <div className="flex-shrink-0">
                    {comment.author?.avatar_url ? (
                      <Image
                        src={comment.author.avatar_url}
                        alt={comment.author.first_name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-secondary- flex items-center justify-center text-sm font-bold">
                        {comment.author?.first_name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-2">
                      <p className="font-bold text-gray-900">
                        {comment.author?.first_name} {comment.author?.last_name}
                      </p>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Related Articles/CTA */}
      <CtaBanner
        title="Explore More from BIG"
        description="Dive deeper into topics that matter to you or connect with sisters in our community."
        cta1={{ text: 'Back to Community', href: '/community' }}
        cta2={{ text: 'Browse Circles', href: '/circles' }}
        background="bg-gradient-to-r from-primary- to-secondary-"
      />
    </div>
  )
}