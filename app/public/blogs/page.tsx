import { getPublicBlogsAction } from "@/actions/blogs";
import Link from "next/link";

export default async function PublicBlogsPage() {
    const result = await getPublicBlogsAction();
    const blogs = result.success ? result.data : [];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                        Public Blogs
                    </h1>
                    <p className="mt-4 text-xl text-gray-500">
                        Read the latest public articles published by our community.
                    </p>
                </div>
                
                {result.error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-md mb-8">
                        {result.error}
                    </div>
                )}

                {!result.error && blogs.length === 0 && (
                    <div className="text-center text-gray-500 py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                        No public blogs available at the moment.
                    </div>
                )}

                <div className="grid gap-8 md:grid-cols-2">
                    {blogs.map((blog) => (
                        <div key={blog.id} className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col">
                            <div className="p-6 grow flex flex-col">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-2 line-clamp-2">
                                    {blog.title}
                                </h3>
                                {/* {!!blog.content && (
                                    <div className="text-gray-600 line-clamp-3 mb-4 grow">
                                        <p>{blog.content}</p>
                                    </div>
                                )} */}
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                    <span className="text-sm text-gray-500">
                                        {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : (blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : '')}
                                    </span>
                                    <Link 
                                        href={`/public/blogs/${blog.slug}`} 
                                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
                                    >
                                        Read more &rarr;
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
