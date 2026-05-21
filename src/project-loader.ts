import { Project } from 'ts-morph';

export function loadProject(paths: string[]): Project {
  const project = new Project({
    skipAddingFilesFromTsConfig: true,
    compilerOptions: { allowJs: false },
  });
  for (const p of paths) { project.addSourceFilesAtPaths(p); }
  return project;
}
