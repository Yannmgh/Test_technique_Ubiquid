import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Job } from "../../hooks/useJobs";

const EditJob = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Charger l'annonce à modifier
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch("http://localhost:3000/jobs", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "ubiquid",
          },
        });
        const data: Job[] = await res.json();
        const found = data.find((j) => j.uuid === id);
        if (!found) throw new Error("Annonce introuvable");
        setJob(found);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (key: keyof Job, value: any) => {
    if (!job) return;
    setJob({ ...job, [key]: value });
  };

  // 🔹 Soumettre la modification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;

    try {
      const res = await fetch(`http://localhost:3000/jobs/${job.uuid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "ubiquid",
        },
        body: JSON.stringify(job),
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour");

      alert("Annonce mise à jour avec succès !");
      navigate("/"); // retour à la liste
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Modifier une annonce</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          maxWidth: "400px",
        }}
      >
        <input
          type="text"
          placeholder="Titre"
          value={job?.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Catégorie"
          value={job?.category || ""}
          onChange={(e) => handleChange("category", e.target.value as any)}
          required
        />
        <input
          type="text"
          placeholder="Type (cdi, cdd, internship)"
          value={job?.type || ""}
          onChange={(e) => handleChange("type", e.target.value as any)}
          required
        />
        <input
          type="number"
          placeholder="Salaire"
          value={job?.salary || ""}
          onChange={(e) => handleChange("salary", Number(e.target.value))}
          required
        />
        <button type="submit">💾 Enregistrer</button>
      </form>
    </div>
  );
};

export default EditJob;
