import express from "express";
import { jobs } from "../../../db/jobs.ts";

type Request = express.Request<{ id: string }>;
type Response = express.Response;

// 🔧 Contrôleur pour mettre à jour une annonce
export const updateJob = (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;

  // Vérifier si le job existe
  const jobIndex = jobs.findIndex((job) => job.uuid === id);

  if (jobIndex === -1 || !jobs[jobIndex]) {
    return res.status(404).json({ message: "Annonce introuvable" });
  }

  // Mettre à jour les champs modifiables
  const updatedJob = {
    ...jobs[jobIndex],
    ...updatedData,
    uuid: jobs[jobIndex].uuid, // garder le même id
  };

  jobs[jobIndex] = updatedJob;

  return res.status(200).json(updatedJob);
};