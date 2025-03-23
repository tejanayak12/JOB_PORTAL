import { getJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import JobCard from "../components/Job-Card";
import { getCompanies } from "@/api/apicompanies";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { State } from "country-state-city";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { isLoaded } = useUser();

  const {
    fn: fnJobs,
    data: jobs,
    loading: loadingJobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
    page: currentPage,
    limit: 6, // Number of jobs per page
  });

  const {
    fn: fnCompanies,
    data: companies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnJobs().then((res) => {
      if (res?.totalPages) setTotalPages(res.totalPages);
    });
  }, [isLoaded, location, company_id, searchQuery, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);

    const query = formData.get("search-query");
    if (query) setSearchQuery(query);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCompany_id("");
    setLocation("");
    setCurrentPage(1);
  };

  if (!isLoaded) {
    return (
      <div className="w-full mb-4">
        <BarLoader color="white" width="100%" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="pb-8 text-6xl font-extrabold text-center gradient-title sm:text-7xl">Latest Jobs</h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex items-center w-full gap-2 mb-3 h-14">
        <Input
          type="text"
          placeholder="Search Jobs by Title"
          name="search-query"
          className="flex-1 h-full px-4 text-md"
        />
        <Button variant="blue" type="submit" className="h-full sm:w-28">
          Search
        </Button>
      </form>

      {/* Filters */}
      <div className="flex flex-col w-full gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col w-full gap-4 sm:flex-row sm:w-auto">
          <Select value={location} onValueChange={(value) => setLocation(value)}>
            <SelectTrigger className="w-full border-gray-500 rounded-lg shadow-sm sm:w-52">
              <SelectValue placeholder="Filter By Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {State.getStatesOfCountry('IN').map(({ name }) => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={company_id} onValueChange={(value) => setCompany_id(value)}>
            <SelectTrigger className="w-full border-gray-500 rounded-lg shadow-sm sm:w-52">
              <SelectValue placeholder="Filter By Companies" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Array.isArray(companies) && companies.map(({ name, id }) => (
                  <SelectItem key={name} value={id}>{name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={clearFilters} variant="destructive" className="w-full h-10 rounded-lg sm:w-44">
          Clear Filters
        </Button>
      </div>

      {/* Jobs */}
      {loadingJobs && (
        <BarLoader className="mt-4" width={"100%"} color="white" />
      )}

      {loadingJobs === false && (
        <div className="grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {jobs?.length ? (
            jobs.map((job) => (
              <JobCard key={job.id} job={job} savedInit={job?.saved?.length > 0} />
            ))
          ) : (
            <div>No Jobs Found</div>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 mb-10">
        {!loadingJobs && jobs?.length > 0 && (
          <Pagination className="mt-2">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                />
              </PaginationItem>

              {/* Render First Page */}
              {currentPage > 3 && (
                <>
                  <PaginationItem>
                    <PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
                  </PaginationItem>
                  <PaginationEllipsis />
                </>
              )}

              {/* Render pages around current page */}
              {Array.from({ length: totalPages }, (_, index) => index + 1)
                .filter(page => Math.abs(page - currentPage) <= 2)
                .map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

              {/* Render Last Page */}
              {currentPage < totalPages - 2 && (
                <>
                  <PaginationEllipsis />
                  <PaginationItem>
                    <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div> // 2:10:40 
  );
};

export default JobListing;
