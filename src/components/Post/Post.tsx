"use client";

import NextError from "next/error";
import { useRouter, useSearchParams } from "next/navigation";
import { RouterOutput, trpc } from "@/utils/api";

type PostByIdOutput = RouterOutput["post"]["byId"];

const PostItem = (props: { post: PostByIdOutput }) => {
	const { post } = props;

	return (
		<div className="flex mt-10 w-full justify-center">
			<div className="w-fit border-2 p-2">
				<p>{post.title}</p>
				<p>
					created {post.createdAt.toLocaleDateString("ja-JP-u-ca-japanese")}
				</p>
				<p>{post.text}</p>
			</div>
			<div className="w-1/2 mx-20 border-2 p-2">
				<p>{JSON.stringify(post, null, 4)}</p>
			</div>
		</div>
	);
};

export const Post = ({ id }: { id: string }) => {
	const postQuery = trpc.post.byId.useQuery({ id });

	if (postQuery.error) {
		return (
			<NextError
				title={postQuery.error.message}
				statusCode={postQuery.error.data?.httpStatus ?? 500}
			/>
		);
	}

	if (postQuery.status !== "success") {
		return (
			<div className="mt-10">
				<p>Loading...</p>
			</div>
		);
	}

	const { data } = postQuery;
	return <PostItem post={data} />;
};

export default Post;
