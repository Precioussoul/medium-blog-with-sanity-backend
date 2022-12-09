import { Interface } from "readline";

export type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export interface Posts {
  _id: string;
  title: string;
  _createdAt: string;
  author: {
    name: string;
    image: string;
  };
  comments: Comment[];
  description: string;
  mainImage: {
    asset: {
      url: string;
    };
  };
  slug: {
    current: string;
  };
  body: [object];
}

export type Post = {
  _id: string;
  slug: {
    current: string;
  };
};

export type Comment = {
  approved: boolean;
  comment: string;
  email: string;
  name: string;
  posts: {
    _ref: string;
    _type: string;
  };
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
};
