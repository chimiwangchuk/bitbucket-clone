import { Page } from 'src/types/pagination';

export const getPagination = (totalPages: number) => (
  getPaginationUrl: (page: number) => string
) => {
  const pages: Page[] = [];

  [...Array(totalPages).keys()].forEach(pageNum => {
    const page = pageNum + 1;
    pages.push({ href: getPaginationUrl(page), label: page });
  });

  return pages;
};
