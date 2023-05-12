import { TRPCError } from "@trpc/server";
import { publicProcudure, router } from "../trpc";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";

const defaultPostSelect = Prisma.validator<Prisma.PostSelect>()({
	id: true,
	title: true,
	text: true,
	createdAt: true,
	updatedAt: true,
});

export const postRouter = router({
	list: publicProcudure
		.input(
			z.object({
				limit: z.number().min(1).max(100).nullish(),
				cursor: z.string().nullish(),
			})
		)
		.query(async ({ input }) => {
			const limit = input.limit ?? 50;
			const { cursor } = input;

			const items = await prisma.post.findMany({
				select: defaultPostSelect,
				take: limit + 1,
				where: {},
				cursor: cursor ? { id: cursor } : undefined,
				orderBy: {
					text: "asc",
				},
			});
			let nextCursor: typeof cursor | undefined = undefined;
			if (items.length > limit) {
				const nextItem = items.pop()!;
				nextCursor = nextItem.id;
			}

			return {
				items: items,
				nextCursor,
			};
		}),
	byId: publicProcudure
		.input(
			z.object({
				id: z.string(),
			})
		)
		.query(async ({ input }) => {
			const { id } = input;
			const post = await prisma.post.findUnique({
				where: { id },
				select: defaultPostSelect,
			});
			if (!post) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: `NO post with id "${id}"`,
				});
			}
			return post;
		}),
	add: publicProcudure
		.input(
			z.object({
				id: z.string().uuid().optional(),
				title: z.string().min(1).max(32),
				text: z.string().min(1),
			})
		)
		.mutation(async ({ input }) => {
			const post = await prisma.post.create({
				data: input,
				select: defaultPostSelect,
			});
			return post;
		}),
});
