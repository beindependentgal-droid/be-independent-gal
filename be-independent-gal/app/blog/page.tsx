import { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedArticles } from '@/app/actions/article-actions';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Blog | Be Independent Gal',
  description: 'Read inspiring stories and learn from the community',
};

export default async function BlogPage() {
  const articles = await getPublishedArticles(20);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Blog</h1>
          <p className="text-xl text-gray-600">
            Stories, insights, and wisdom from independent women
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              {article.featured_image_url && (
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <img
                    src={article.featured_image_url}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {article.title}
                </h2>
                {article.excerpt && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{article.view_count} views</span>
                  {article.circle_name && (
                    <Badge variant="secondary">{article.circle_name}</Badge>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No articles yet. Check back soon!</p>
          </div>
        )}
      </div>
    </main>
  );
}
