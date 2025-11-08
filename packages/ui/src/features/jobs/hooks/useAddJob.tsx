import { useState } from "react";

export const useAddJob = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSucces] = useState(false);

  const addNewJob: ({
    title,
    category,
    salary,
    type,
  }: {
    title: string;
    category: string;
    salary: number;
    type: string;
  }) => void = (e) => {
    setError(null);
    setSucces(false);

    // ✅ ajout du header Authorization
    fetch("http://localhost:3000/jobs", {
      method: "POST",
      body: JSON.stringify(e),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "ubiquid",
      },
    })
      .then((response) => {
        if (!response.ok) {
          response.json().then((r) => setError(r.message));
        } else {
          response.json().then(() => setSucces(true));
        }
      })
      .catch((err) => setError(err.message));
  };

  return { addNewJob, error, success };
};
