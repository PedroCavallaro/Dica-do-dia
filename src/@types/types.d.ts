export type LocalStorageFormat = {
  answer: {
    state: Array<{
      solution: string;
    }>;
  };
};
export type Article = {
  date: Date;
  number: number;
  text: string;
  title: string;
  url: string;
};
