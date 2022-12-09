import { GetStaticProps } from "next";
import Image from "next/image";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import PortableText from "react-portable-text/dist";
import { sanityClient, urlFor } from "../../sanity";
import { Post, Posts } from "../../typings";

interface Props {
  post: Posts;
}

interface IformInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

function Post({ post }: Props) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IformInput>();

  const onSubmit: SubmitHandler<IformInput> = async (data) => {
    console.log(data);

    await fetch(`/api/createComment`, {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data, "data");
        setSubmitted(true);
      })
      .catch((err) => {
        console.log(err);
        setSubmitted(false);
      });
  };
  return (
    <div>
      <Image
        src={urlFor(post.mainImage).url()!}
        alt={post.title}
        width={1000}
        height={1000}
        className="w-full h-40 object-cover"
      />
      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500 mb-2">
          {post.description}
        </h2>

        <div>
          <Image
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()!}
            alt={post.author.name}
            width={1000}
            height={1000}
          />
          <p className="font-extralight text-sm">
            Blog post by{" "}
            <span className="text-green-600">{post.author.name} </span> -
            Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        <div>
          <PortableText
            content={post.body}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-3xl font-bold my-5" {...props} />
              ),
              h2: (props: any) => (
                <h1 className="text-xl font-bold my-5" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover: underline">
                  {children}
                </a>
              ),
              someCustomType: Post,
            }}
          />
        </div>
      </article>

      <hr className="max-w-lg mx-auto border border-yellow-500" />

      {submitted ? (
        <div className="flex flex-col p-10 my-10  bg-yellow-500 text-white max-w-2xl mx-auto rounded-md">
          <h3 className="text-3xl font-bold">
            Thank you for submitting your comment!
          </h3>
          <p>Once it has been approved, it will appear below!</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
        >
          <h3 className="text-sm text-yellow-500">Enjoyed the article</h3>
          <h4 className="text-2xl font-bold ">Leave a comment below</h4>

          <input
            {...register("_id")}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label htmlFor="name" className="block mb-5">
            <span className="text-gray-700">Name</span>
            <input
              {...register("name", { required: true })}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 focus:ring outline-none"
              type="text"
              placeholder="John appleseed"
            />
          </label>
          <label htmlFor="email" className="block mb-5">
            <span className="text-gray-700">Email</span>
            <input
              {...register("email", { required: true })}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 focus:ring outline-none"
              type="email"
              placeholder="John appleseed"
            />
          </label>
          <label htmlFor="name" className="block mb-5">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register("comment", { required: true })}
              placeholder="John appleseed"
              rows={8}
              className="shadow border py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring rounded-sm"
            />
          </label>

          {/* errors will return when field validation fails */}
          <div className="flex flex-col p-5">
            {errors.name && (
              <span className="text-red-500">
                {" "}
                -- The Name Field is required
              </span>
            )}
            {errors.comment && (
              <span className="text-red-500">
                -- The comment Field is required
              </span>
            )}
            {errors.email && (
              <span className="text-red-500">
                {" "}
                -- The Email Field is required
              </span>
            )}
          </div>
          <button
            type="submit"
            className="shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer"
          >
            Submit
          </button>
        </form>
      )}

      <div className="flex flex-col p-10 my-10 w-11/12 sm:max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />
        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p className="c">
              <span className="text-yellow-500">{comment.name}: </span>
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Post;

export const getStaticPaths = async () => {
  const query = `
        *[_type == "post"]{
            _id,
            slug{
                current
            }
        }
    `;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = ` *[_type == "post" && slug.current == $slug][0]{
    _id,
    _createdAt,
    title,
    author ->{
        name, image
    },
    'comments' : *[  
        _type == "comment" && post._ref == ^._id && approved == true ],
    description,
    mainImage,
    slug,
    body
  }`;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 10,
  };
};
