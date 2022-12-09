import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { sanityClient, urlFor } from "../sanity";
import { Posts } from "../typings";

interface Props {
  posts: Posts[];
}

function HomePage({ posts }: Props) {
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex justify-between items-center bg-yellow-400 border-y border-black py-10 lg:py-0">
        <div className="px-10">
          <h1 className="text-4xl md:text-6xl max-w-xl font-serif">
            <span className="underline decoration-black decoration-4">
              Medium
            </span>{" "}
            is a place to write, read and connect
          </h1>
          <h2>
            It&apos;s easy and free to post your thinking on any topic and with
            millions of readers
          </h2>
        </div>
        <div>
          <Image
            loader={() =>
              "https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
            }
            src={
              "https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
            }
            width={500}
            unoptimized
            priority
            height={500}
            alt="Medium-logo"
            className="hidden md:inline-flex h-32 lg:h-full"
          />
        </div>
      </div>
      {/* posts */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6 ">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className=" border rounded-lg cursor-pointer overflow-hidden group">
              <Image
                src={urlFor(post.mainImage).url()!}
                alt={""}
                width={1000}
                height={1000}
                className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
              />
              <div className="flex justify-between p-5 bg-white-300">
                <div>
                  <h3 className="text-1xl font-bold">{post.title}</h3>
                  <p className="text-gray-500 text-sm text-center">
                    {post.description}
                  </p>
                </div>
                <Image
                  src={urlFor(post.author.image).url()!}
                  alt=""
                  width={1000}
                  height={1000}
                  className="h-12 w-12 rounded-full"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;

export const getServerSideProps = async () => {
  const query = `
        *[_type == "post"]{
            _id,
            title,
            author -> {
                name, image
            },
            description,
            mainImage,
            slug
        }
    `;
  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    },
  };
};
