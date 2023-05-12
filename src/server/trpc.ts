import { Context } from "./context";
import { transformer } from "@/utils/transformer";
import { initTRPC } from "@trpc/server";

const t = initTRPC.context<Context>().create({
	transformer,
	errorFormatter({ shape }) {
		return shape;
	},
});

export const router = t.router;

export const publicProcudure = t.procedure;

export const middleware = t.middleware;

export const mergeRouters = t.mergeRouters;
