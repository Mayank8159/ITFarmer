import { fetchVerifiedProjects } from "@/lib/projects";
import WorksClient from "./WorksClient";

export default async function WorksPage() {
  const projects = await fetchVerifiedProjects();
  return <WorksClient initialProjects={projects} />;
}
