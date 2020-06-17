import React, { ReactNode, useState, ReactElement, useEffect } from 'react';
import * as store from '../navigation-store';

type RawBlog = {
  id: number;
  title: { rendered: string };
  date: string;
  excerpt: { rendered: string };
  link: string;
};

export type Blog = {
  id: number;
  title: string;
  date: string;
  intro: string;
  link: string;
  isNew: boolean;
};

export type State = {
  blogs: Blog[];
};

type ChildrenShape = {
  blogs: Blog[];
  storeLastSeenBlog: () => void;
  newBlogCount: number;
};

export type Props = {
  url?: string;
  children: (api: ChildrenShape) => ReactNode;
  currentUserUuid: string;
};

export const removeBadCharacters = (inputText: string) => {
  const converter = document.createElement('span');
  converter.innerHTML = inputText
    .replace(/<\s*script[^>]*>.*<\s*\/\s*script\s*>/, '')
    .replace(/<\/?[^>]+(>|$)/g, '');
  return (converter.textContent || '').trim();
};

// The feed intro is wrapped in a <p> tag, is too long, and contains some
// unescaped characters.
const formatIntro = (rawIntro: string) =>
  `${removeBadCharacters(rawIntro)
    .split('. ')
    .slice(0, 1)
    .join('')}.`;

// The initial feed response is not exactly how we want to display it,
// so we clean it up here.
const cleanBlogData = (rawBlogs: RawBlog[]) =>
  rawBlogs.map(({ id, title, date, excerpt, link }) => ({
    id,
    title: removeBadCharacters(title.rendered),
    date: date.slice(0, 10), // Example date format from feed: 2018-10-23T17:39:57
    intro: formatIntro(excerpt.rendered),
    link,
    isNew: false,
  }));

// Used to re-process the title/intro, since we cache the blog feed response in local storage so
// any changes to removeBadCharacters / formatIntro need to be applied to the cached value.
const recleanData = (blogs: Blog[]) =>
  blogs.map(({ title, intro, ...otherBlogData }) => ({
    title: removeBadCharacters(title),
    intro: formatIntro(intro),
    ...otherBlogData,
  }));

const setIsNewForBlogs = (blogs: Blog[], currentUserUuid: string) => {
  const lastSeenId = store.getLastSeen(currentUserUuid);
  return blogs.map(blog => ({
    ...blog,
    isNew: blog.id > lastSeenId,
  }));
};

const getBlogContent = async (userUuid: string, url?: string) => {
  const storedContent = store.getContent(userUuid);
  if (storedContent) {
    return recleanData(storedContent);
  }
  if (!url) {
    return undefined;
  }

  const resp = await fetch(url);
  const blogs = await resp.json();
  const cleanedBlogs = cleanBlogData(blogs);
  store.setContent(userUuid, cleanedBlogs);
  return cleanedBlogs;
};

export function useBlogs(whatsNewUrl: string | undefined, userUuid: string) {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    try {
      getBlogContent(userUuid, whatsNewUrl).then(newBlogs => {
        if (newBlogs) {
          // Mark each blog as isNew true/false and save in state
          const lastSeenId = store.getLastSeen(userUuid);
          setBlogs(
            newBlogs.map(blog => ({
              ...blog,
              isNew: blog.id > lastSeenId,
            }))
          );
        }
      });
    } catch (error) {
      setBlogs([]);
    }
  }, [whatsNewUrl, userUuid]);

  return {
    blogs,
    newBlogCount: blogs.filter(blog => blog.isNew).length,
    storeLastSeenBlog: () => {
      // If there are no blogs, we cannot store the blog id, so exit here
      if (!blogs || !blogs.length) {
        return;
      }

      // If there are multiple blogs posted on the same day we are not guaranteed that
      // blogs[0] has the highest id, so we loop through blogs to find the highest.
      const latestBlogId: number = Math.max(...blogs.map(b => b.id));

      store.setLastSeen(userUuid, latestBlogId);

      // Now that we've updated the latest blog id, we refresh isNew for each blog item
      setBlogs(setIsNewForBlogs(blogs, userUuid));
    },
  };
}

type BlogFetchProps = {
  url: string | undefined;
  currentUserUuid: string;
  children: ({
    blogs,
    newBlogCount,
    storeLastSeenBlog,
  }: {
    newBlogCount: number;
    blogs: Blog[];
    storeLastSeenBlog: () => void;
  }) => ReactElement<any>;
};

export const BlogFetch = React.memo((props: BlogFetchProps) => {
  const { url, currentUserUuid, children } = props;
  const { blogs, newBlogCount, storeLastSeenBlog } = useBlogs(
    url,
    currentUserUuid
  );
  return children({ blogs, newBlogCount, storeLastSeenBlog });
});
