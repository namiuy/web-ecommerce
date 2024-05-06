import { Link } from '@chakra-ui/react';
import { useRouter } from 'next/router';

type PaginationProps = {
  currentPage: number;
  maxRowsPerPage: number;
  totalItems: number;
};

const Pagination = ({ currentPage, maxRowsPerPage, totalItems }: PaginationProps) => {
  const pageCount = Math.ceil(totalItems / maxRowsPerPage);
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  const router = useRouter();
  const { query } = router;
  const filteredQuery = Object.fromEntries(Object.entries(query).filter(([key]) => key !== 'pag'));
  const and = Object.keys(filteredQuery).length === 0 ? '' : '&';
  const link = `?${new URLSearchParams(filteredQuery as Record<string, string>).toString()}${and}pag=`;

  return (
    <>
      {pageCount > 1 && (
        <div>
          {currentPage > 1 && <Link href={`${link}${currentPage - 1}`}>prev</Link>}
          {pages.map(i => {
            const active = currentPage === i;
            return i === 1 || (i <= currentPage + 2 && i >= currentPage - 2) || i === pageCount - 1 ? (
              <Link key={i} href={`${link}${i}`} style={active ? { color: 'blue' } : {}}>
                {i}
              </Link>
            ) : null;
          })}
          {currentPage < pageCount && <Link href={`${link}${currentPage + 1}`}>next</Link>}
        </div>
      )}
    </>
  );
};

export default Pagination;
