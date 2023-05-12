"use client";
import { trpc } from "@/utils/api";
import { inferProcedureInput } from "@trpc/server";
import Link from "next/link";
import type { AppRouter } from "@/server";
import { useEffect, useState } from "react";

type Post = {
	id: string;
	title: string;
	text: string;
	createdAt: Date;
	updatedAt: Date;
};

const Posts = () => {
	const [posts, setPosts] = useState<Post[] | []>();
	const [isLoad, setIsLoad] = useState<boolean>(false);

	const utils = trpc.useContext();
	const postsQuery = trpc.post.list.useInfiniteQuery(
		{
			limit: 5,
		},
		{
			getPreviousPageParam(lastPage) {
				return lastPage.nextCursor;
			},
		}
	);

	useEffect(() => {
		if (postsQuery.status === "success" && !posts) {
			const lastItemIndex = postsQuery.data?.pages.length - 1;
			setPosts(postsQuery.data?.pages[lastItemIndex].items);
		}
	}, [postsQuery.status]);

	// read more
	useEffect(() => {
		if (postsQuery.status === "success" && posts && isLoad) {
			const isDuplicate = posts.some((post) =>
				postsQuery.data?.pages[0].items.some((item) => item.id === post.id)
			);
			if (!isDuplicate) {
				setPosts([...posts, ...postsQuery.data?.pages[0].items]);
			}
			setIsLoad(false);
		}
	}, [postsQuery.data?.pages]);

	const addPost = trpc.post.add.useMutation({
		async onSuccess() {
			// refetches posts after a post is added
			await utils.post.list.invalidate();
		},
	});

	return (
		<div>
			<div className="mt-10">
				{postsQuery.status === "loading" && <p>Loading ...</p>}
			</div>

			<div className="w-full flex flex-wrap justify-center items-center space-x-3">
				{posts?.map((post, index) => (
					<div key={index} className="border-2 w-fit p-3">
						<p>{post.title}</p>
						<Link href={`/post/${post.id}`}>View More</Link>
					</div>
				))}
			</div>

			<button
				className="p-3 border-2 rounded-md mt-10"
				onClick={() => {
					setIsLoad(true);
					postsQuery.fetchPreviousPage();
				}}
				disabled={
					!postsQuery.hasPreviousPage || postsQuery.isFetchingPreviousPage
				}
			>
				{postsQuery.isFetchingPreviousPage
					? "Loading more..."
					: postsQuery.hasPreviousPage
					? "Load More"
					: "Nothing more to load"}
			</button>

			<p>Add a Post</p>

			<form
				onSubmit={async (e) => {
					/**
					 * In a real app you probably don't want to use this manually
					 * Checkout React Hook Form - it works great with tRPC
					 * @see https://react-hook-form.com/
					 * @see https://kitchen-sink.trpc.io/react-hook-form
					 */
					e.preventDefault();
					const $form = e.currentTarget;
					const values = Object.fromEntries(new FormData($form));
					type Input = inferProcedureInput<AppRouter["post"]["add"]>;
					//    ^?
					const input: Input = {
						title: values.title as string,
						text: values.text as string,
					};
					try {
						await addPost.mutateAsync(input);

						$form.reset();
					} catch (cause) {
						console.error({ cause }, "Failed to add post");
					}
				}}
			>
				<label htmlFor="title">Title:</label>
				<br />
				<input
					className="bg-black border-2"
					id="title"
					name="title"
					type="text"
					disabled={addPost.isLoading}
				/>

				<br />
				<label htmlFor="text">Text:</label>
				<br />
				<textarea
					className="bg-black border-2"
					id="text"
					name="text"
					disabled={addPost.isLoading}
				/>
				<br />
				<input type="submit" disabled={addPost.isLoading} />
				{addPost.error && (
					<p style={{ color: "red" }}>{addPost.error.message}</p>
				)}
			</form>
		</div>
	);
};

export default Posts;
