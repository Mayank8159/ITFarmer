import React from 'react';
import ProjectShowcaseClient from './ProjectShowcaseClient';
import { fetchVerifiedProjects } from '@/lib/projects';

export default async function ProjectShowcase() {
  const projects = await fetchVerifiedProjects();
  return <ProjectShowcaseClient projects={projects} />;
}
