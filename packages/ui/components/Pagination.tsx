import { Flex, Icon, Link } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Box, Button } from 'ui';

import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md';

const _buttonColor = 'brand.banner.paginationColor';

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
        <Flex justifyContent="center" alignItems="center" gap="1rem">
          {currentPage > 1 && (
            <Link href={`${link}${currentPage - 1}`} h="1.5rem">
              <Icon as={MdOutlineNavigateBefore} boxSize={6} color={_buttonColor} />
            </Link>
          )}
          {pages.map(i => {
            const active = currentPage === i;
            return i === 1 || (i <= currentPage + 2 && i >= currentPage - 2) || i === pageCount - 1 ? (
              <Link key={i} href={`${link}${i}`} style={{ textDecoration: 'none' }}>
                <Flex
                  w="3rem"
                  h="3rem"
                  justifyContent="center"
                  alignItems="center"
                  borderRadius="0.75rem"
                  bg={active ? _buttonColor : 'transparent'}
                  color={active ? 'white' : 'black'}
                  _hover={{
                    bg: active ? _buttonColor : 'brand.grey.1',
                    transition: 'background-color 0.2s ease-in-out',
                  }}
                >
                  {i}
                </Flex>
              </Link>
            ) : null;
          })}
          {currentPage < pageCount && (
            <Link href={`${link}${currentPage + 1}`} h="1.5rem">
              <Icon as={MdOutlineNavigateNext} boxSize={6} color={_buttonColor} />
            </Link>
          )}
        </Flex>
      )}
    </>
  );
};

export default Pagination;
