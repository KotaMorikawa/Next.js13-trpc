import { postRouter } from "./post";
import { publicProcudure, router } from "./trpc";

export const appRouter = router({
	healthcheck: publicProcudure.query(() => "yay!"),
	post: postRouter,
});

export type AppRouter = typeof appRouter;
