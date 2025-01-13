import React from "react";
import SearchForms from "../../components/SearchForms";
import StartupCard from "@/components/StartupCard";

const Home = async ({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) => {
  const query = (await searchParams).query;

  const posts = [
    {
      _createdat: new Date(),
      views: 55,
      author: { _id: 1, name: "John Doe" },
      _id: 1,
      description: "this is a descrionption ",
      image: "/s1.jpeg",
      category: "Robots",
      title: "we Robots",
    },
  ];
  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch your startup <br />
          CONNECT WITH ENTREPRENEURS
        </h1>
        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on pitches and get noticed in Virtual Competitions.
        </p>

        <SearchForms query={query} />
      </section>
      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for ${query}` : "All Startups"}
        </p>
        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post:StartupCardType, index: number)=>(
              <StartupCard key={post?._id} post={post}/>
            ))
          ):(
            <p className="no-results">No Startups Found</p>
          )}
        </ul>
      </section>
    </>
  );
};

export default Home;
