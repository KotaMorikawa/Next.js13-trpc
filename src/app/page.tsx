import Posts from "@/components/Post/Posts";

const Home = () => {
	return (
		<>
			{/* Header */}
			<div className="text-xl flex items-center bg-gray-400 h-14">
				<div className="ml-5">
					<p>Home</p>
				</div>
			</div>

			{/* Post List */}
			<Posts />
		</>
	);
};

export default Home;
