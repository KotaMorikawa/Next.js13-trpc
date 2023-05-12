import Post from "@/components/Post/Post";

const page = ({ params }: { params: { id: string } }) => {
	const id = params.id;
	return (
		<>
			<div className="text-xl flex items-center bg-gray-400 h-14">
				<div className="ml-5">
					<p>Detail</p>
				</div>
			</div>
			<Post id={id} />
		</>
	);
};

export default page;
