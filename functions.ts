import axios from 'axios';

export const add = (a: number, b: number) => {
  return a + b;
};

export const aquarium = {
  hasWhale() {
    return true;
  },
};

type PostResponse = {
  id: number;
  title: string;
  author: string;
};
export const fetchPosts = async () => {
  try {
    const { data } = await axios.get<PostResponse>(
      'http://localhost:3000/posts'
    );
    return data;
  } catch (error) {
    throw new Error('Something wrong when fetching posts!');
  }
};

export const delay = (milliseconds: number, fn: () => void) => {
  setTimeout(() => fn(), milliseconds);
};
