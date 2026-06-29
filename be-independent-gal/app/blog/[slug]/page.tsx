import { Metadata } from 'next';
import { getArticleBySlug, getArticleComments } from '@/app/actions/article-actions';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Article | Be Independent Gal',
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const comments = await getArticleComments(article.id);

  return (
    <main className="min-h-screen bg-white">
      <article className="max-w-4xl mx-auto px-4 py-12">
        {article.featured_image_url && (
          <div className="mb-8 h-96 overflow-hidden rounded-lg">
            <img
              src={article.featured_image_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <span>{new Date(article.published_at!).toLocaleDateString()}</span>
            <span>{article.view_count} views</span>
            {article.circle_name && (
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                {article.circle_name}
              </span>
            )}
          </div>
        </header>

        <div
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <section className="border-t pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Comments ({comments.length})
          </h2>
          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment: any) => (
                <div
                  key={comment.id}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {comment.author?.avatar_url && (
                      <img
                        src={comment.author.avatar_url}
                        alt={comment.author.full_name}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span className="font-semibold text-gray-900">
                      {comment.author?.full_name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </article>
    </main>
  );
}
