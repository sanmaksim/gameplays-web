import { Pagination } from "react-bootstrap";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type SearchResults from "../types/SearchResultsType";

type Props = {
  searchResults: SearchResults;
};

function Paginator({ searchResults }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentPage: number = parseInt(searchParams.get("page") || "1", 10);
  const totalPages: number = Math.ceil(searchResults.number_of_total_results / searchResults.limit);

  const adjacent: number = 2;
  const visible: number = 5;

  // Adjust adjacent pages dynamically
  const adjustAdjacentPages = (active: number, total: number, adjacent: number) => {
    if (active <= adjacent) {
      return { 
        left: active - 1, 
        right: adjacent + (adjacent - active + 1) 
      };
    }
    if (active >= total - adjacent + 1) {
      return { 
        left: adjacent + (adjacent - (total - active)), 
        right: total - active 
      };
    }
    return { 
      left: adjacent, 
      right: adjacent 
    };
  };

  const { left: adjacentLeft, right: adjacentRight } = adjustAdjacentPages(currentPage, totalPages, adjacent);

  const changePage = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
  };

  const shiftPagination = (direction: string) => {
    const shiftAmount = adjacent * 2; // Number of pages to shift
    let newPage: number = 1;
    if (direction === 'left') {
      newPage = Math.max(1, currentPage - shiftAmount);
    } else if (direction === 'right') {
      newPage = Math.min(totalPages, currentPage + shiftAmount);
    } 
    changePage(newPage);
  };

  // useMemo for performance
  // pagination buttons are only recalculated when currentPage or totalPages change
  const pages = useMemo(() => {
    let pageItems: Array<JSX.Element> = [];

    // Left ellipsis
    if (currentPage > visible - adjacent) {
      pageItems.push(
        <Pagination.Ellipsis key="left-ellipsis" onClick={() => shiftPagination("left")} />
      );
    }

    // Visible page numbers
    for (let page = currentPage - adjacentLeft; page <= currentPage + adjacentRight; page++) {
      if (page >= 1 && page <= totalPages) {
        pageItems.push(
          <Pagination.Item key={page} active={page === currentPage} onClick={() => changePage(page)}>
            {page}
          </Pagination.Item>
        );
      }
    }

    // Right ellipsis
    if (currentPage < totalPages - adjacent) {
      pageItems.push(
        <Pagination.Ellipsis key="right-ellipsis" onClick={() => shiftPagination("right")} />
      );
    }

    return pageItems;
  }, [currentPage, totalPages]);

  return (
    <Pagination>
      <Pagination.First disabled={currentPage === 1} onClick={() => changePage(1)} />
      <Pagination.Prev disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)} />
      {pages}
      <Pagination.Next disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)} />
      <Pagination.Last disabled={currentPage === totalPages} onClick={() => changePage(totalPages)} />
    </Pagination>
  );
}

export default Paginator;
