import React from 'react';
import { getPostsData } from '@/app/actions/adminActions';
import ProjectShowcaseClient from './ProjectShowcaseClient';

export default async function ProjectShowcase() {
  const projects = await getPostsData();
  return <ProjectShowcaseClient projects={projects} />;
}
