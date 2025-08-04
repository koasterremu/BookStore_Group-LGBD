import React, { useEffect } from "react";
import { VscChevronRight, VscChevronLeft } from "react-icons/vsc";

const Pagination: React.FC<any> = ({
  pages,
  setCurrentPage,
  currentPage,
}) => {
  const numOfPages = [];

  // getting number of the pages
  for (let i = 1; i <= pages; i++) {
    numOfPages.push(i);
  }

  // updating current page when the button is clicked
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <nav
      aria-label="Page navigation example"
      className="d-flex justify-content-center"
    >
      <ul className="pagination">
        <li className={currentPage === 1 ? "page-item disabled" : "page-item"}>
          <button
            className="page-link"
            onClick={() =>
              setCurrentPage(currentPage === 1 ? currentPage : currentPage - 1)
            }
          >
            <VscChevronLeft />
          </button>
        </li>
        {numOfPages.map((page, index) => (
          <li
            key={index}
            className={currentPage === page ? "page-item active" : "page-item"}
          >
            <button className="page-link" onClick={() => setCurrentPage(page)}>
              {page}
            </button>
          </li>
        ))}
        <li
          className={
            currentPage === numOfPages.length
              ? "page-item disabled"
              : "page-item"
          }
        >
          <button
            className="page-link"
            onClick={() =>
              setCurrentPage(
                currentPage === numOfPages.length
                  ? currentPage
                  : currentPage + 1
              )
            }
          >
            <VscChevronRight />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
