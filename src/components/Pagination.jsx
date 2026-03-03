function Pagination({ page, totalPages, setPage }) {

  if (totalPages <= 1) return null; // Hide if only 1 page

  return (
    <div className="flex justify-center items-center gap-2 mt-10">

      {/* Previous Button */}
      <button
        onClick={() => setPage(prev => prev - 1)}
        disabled={page === 1}
        className={`px-3 py-1 rounded ${
          page === 1
            ? "bg-gray-200 cursor-not-allowed"
            : "bg-gray-300 hover:bg-gray-400"
        }`}
      >
        Prev
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => setPage(i + 1)}
          className={`px-3 py-1 rounded ${
            page === i + 1
              ? "bg-indigo-600 text-white"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
        >
          {i + 1}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => setPage(prev => prev + 1)}
        disabled={page === totalPages}
        className={`px-3 py-1 rounded ${
          page === totalPages
            ? "bg-gray-200 cursor-not-allowed"
            : "bg-gray-300 hover:bg-gray-400"
        }`}
      >
        Next
      </button>

    </div>
  );
}

export default Pagination;