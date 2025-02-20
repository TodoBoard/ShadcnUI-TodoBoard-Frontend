"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Project, ProjectStatisticsResponse } from "@/models/stats";
import { TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { Projects } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { NoProjects } from "./no-projects";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { handleApiError } from "@/lib/api";
import { slugify } from "@/utils/format-projects";

const SKELETON_COUNT = 3;

export function ProjectGrid({
  projects,
  type,
}: {
  projects: Project[];
  type: "my-projects" | "invited-projects";
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/board/projects/${type}/${slugify(project.name)}-id=${
            project.id
          }`}
          className="block hover:opacity-90 transition-opacity"
        >
          <Card className="shadow-none">
            <CardHeader>
              <h3 className="font-semibold text-lg">{project.name}</h3>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Open Tasks</p>
                  <p className="text-2xl font-bold">{project.open_tasks}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                  <p className="text-2xl font-bold">{project.total_tasks}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{project.percentage.toFixed(1)}%</span>
                </div>
                <Progress value={project.percentage} className="h-2" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Team</p>
                <div className="flex -space-x-2">
                  {project.team_members.map((member, index) => (
                    <Avatar
                      key={index}
                      className="border-2 border-background h-8 w-8"
                    >
                      <AvatarImage
                        src={`/user/avatar/${member.avatar_id}.png`}
                        alt={member.username}
                      />
                      <AvatarFallback>{member.username[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function ProjectCardSkeleton() {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <Skeleton className="h-7 w-48" />
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-8 w-12" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-8 w-12" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>

        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <div className="flex -space-x-2">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-full" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <ProjectCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ProjectStats() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [projectStats, setProjectStats] =
    useState<ProjectStatisticsResponse | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      try {
        const data = await Projects.getStatistics();
        if (isMounted) {
          setProjectStats(data);
          setError(undefined);
        }
      } catch (error) {
        if (isMounted) {
          setError(handleApiError(error));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return <LoadingOverlay error={true} errorMessage={error} />;
  }

  if (!projectStats || isLoading) {
    return (
      <>
        <TabsContent value="my-projects">
          <ProjectGridSkeleton />
        </TabsContent>
        <TabsContent value="invited-projects">
          <ProjectGridSkeleton />
        </TabsContent>
      </>
    );
  }

  const renderProjects = (
    projects: Project[],
    type: "my-projects" | "invited-projects"
  ) => {
    return projects.length > 0 ? (
      <ProjectGrid projects={projects} type={type} />
    ) : (
      <NoProjects />
    );
  };

  const hasNoProjects =
    projectStats.my_projects.length === 0 &&
    projectStats.invited_projects.length === 0;

  if (hasNoProjects) {
    return <NoProjects />;
  }

  return (
    <>
      <TabsContent value="my-projects">
        {renderProjects(projectStats.my_projects, "my-projects")}
      </TabsContent>

      <TabsContent value="invited-projects">
        {renderProjects(projectStats.invited_projects, "invited-projects")}
      </TabsContent>
    </>
  );
}
