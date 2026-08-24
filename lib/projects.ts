// lib/projects.ts
import data from '../public/data/postsContent.json';

export type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  stack: string[];
};

export const verifiedProjects: Project[] = data.map((item: any) => ({
  id: item.id,
  title: item.title,
  description: item.description,
  image: item.image,
  stack: item.technologies.split(',').map((t: string) => t.trim()),
}));
