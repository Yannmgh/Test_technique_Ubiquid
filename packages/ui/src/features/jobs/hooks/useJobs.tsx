import { useEffect, useState, useMemo } from "react";

type JobCategory = "it" | "sales" | "managment";
type JobType = "cdi" | "cdd" | "internship";
export type SortByT = "title" | "category" | "type" | "salary" | "createdAt";
export type SortOrderT = "asc" | "desc";

export interface Job {
  uuid: string;
  title: string;
  category: JobCategory;
  type: JobType;
  salary: number;
  createdAt: string;
}

const URL = "http://localhost:3000/jobs";

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortByT>("title");
  const [sortOrder, setSortOrder] = useState<SortOrderT>("asc");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const getJobs = async () => {
      try {
        const response = await fetch(URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "ubiquid",
          },
        });

        if (!response.ok) {
          throw new Error("Erreur de connexion au serveur.");
        }

        const data = await response.json();
        setJobs(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    getJobs();
  }, []);

  const filteredAndSortedJobs = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = jobs.filter((job) => {
      if (!normalizedSearch) return true;
      return (
        job.title.toLowerCase().includes(normalizedSearch) ||
        job.category.toLowerCase().includes(normalizedSearch) ||
        job.type.toLowerCase().includes(normalizedSearch)
      );
    });

    const sortFn = (a: Job, b: Job) => {
      switch (sortBy) {
        case "category":
          return sortOrder === "asc"
            ? a.category.localeCompare(b.category)
            : b.category.localeCompare(a.category);
        case "salary":
          return sortOrder === "asc" ? a.salary - b.salary : b.salary - a.salary;
        case "title":
          return sortOrder === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        case "type":
          return sortOrder === "asc"
            ? a.type.localeCompare(b.type)
            : b.type.localeCompare(a.type);
        case "createdAt": {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return sortOrder === "asc"
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        }
        default:
          return 0;
      }
    };

    return [...filtered].sort(sortFn);
  }, [jobs, sortBy, sortOrder, searchTerm]);

  //  nouvelle référence à chaque tri pour éviter le bug removeChild
  return {
    jobs: [...filteredAndSortedJobs],
    error,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    searchTerm,
    setSearchTerm,
  };
};
