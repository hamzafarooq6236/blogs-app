import { db } from "@/db";
import { blogs } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, count } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        const userBlogs = await db
            .select({
                status: blogs.status,
                count: count(),
            })
            .from(blogs)
            .where(eq(blogs.userId, userId))
            .groupBy(blogs.status);

            console.log(userBlogs)

        let total = 0;
        let draft = 0;
        let publicCount = 0;
        let privateCount = 0;

        for (const item of userBlogs) {
            const cnt = Number(item.count);
            console.log(cnt)
            total += cnt;
            if (item.status === "draft") draft = cnt;
            else if (item.status === "public") publicCount = cnt;
            else if (item.status === "private") privateCount = cnt;
        }

        return Response.json({
            total,
            draft,
            public: publicCount,
            private: privateCount,
        });
    } catch (error) {
        console.error("Error fetching dashboard statistics:", error);
        return Response.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
    }
}
