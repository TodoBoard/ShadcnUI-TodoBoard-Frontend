"use client";

import { clientEnv } from "@/config/env";
import React, { useEffect, useRef } from "react";
import { useTodosStore } from "@/store/todos";
import { useNotificationsStore } from "@/store/notifications";
import { useProjectsStore } from "@/store/projects";
import { Project } from "@/models/projects";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export function RealtimeProvider({ children }: Props) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef<number>(0);
  const manualDisconnectRef = useRef<boolean>(false);
  const RECONNECT_BASE_DELAY = 1000;
  const RECONNECT_MAX_DELAY = 30000;
  const router = useRouter();
  const pathname = usePathname();

  const connect = () => {
    if (manualDisconnectRef.current) return;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (!token) return;
    const base = clientEnv.apiUrl.replace(/^http/, "ws").replace(/\/$/, "");
    const url = `${base}/ws?token=${token}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.info("WebSocket connected");
      retryCountRef.current = 0;
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
      // Refetch data on reconnect to catch any missed updates (silent for todos)
      const todosStore = useTodosStore.getState();
      if (todosStore.selectedProjectId) {
        todosStore.silentlyRefreshTodos(todosStore.selectedProjectId);
      } else {
        todosStore.fetchAllTodos();
      }
      useProjectsStore.getState().fetchProjects();
    };

    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);
        handleMessage(data);
      } catch {
        console.warn('Invalid WebSocket message:', evt.data);
      }
    };

    ws.onclose = () => {
      console.warn("WebSocket closed. Scheduling reconnect...");
      wsRef.current = null;
      scheduleReconnect();
    };

    ws.onerror = () => {
      ws.close();
    };
  };

  const scheduleReconnect = () => {
    if (manualDisconnectRef.current || reconnectTimer.current) return;
    retryCountRef.current += 1;
    const delay = Math.min(
      RECONNECT_BASE_DELAY * 2 ** (retryCountRef.current - 1) + Math.random() * 1000,
      RECONNECT_MAX_DELAY
    );
    console.info(`Reconnecting WebSocket (attempt #${retryCountRef.current}) in ${delay}ms`);
    reconnectTimer.current = setTimeout(() => {
      reconnectTimer.current = null;
      connect();
    }, delay);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMessage = (data: any) => {
    console.log("Received message:", data);
    const event = data?.event;
    switch (event) {
      case "todo.created":
      case "todo.updated": {
        const todo = data.todo;
        if (todo) useTodosStore.getState().upsertTodo(todo);
        break;
      }
      case "todo.deleted": {
        const id = data.todo_id;
        if (id) useTodosStore.getState().removeTodo(id);
        break;
      }
      case "notification.new": {
        const notification = data.notification;
        if (notification) {
          useNotificationsStore.getState().addNotification(notification);
        }
        break;
      }
      case "notification.read_all": {
        useNotificationsStore.getState().markAllRead();
        break;
      }
      case "project.created":
      case "project.updated": {
        const project = data.project as Record<string, unknown>;
        if (project) {
          useProjectsStore.getState().upsertProject(project as unknown as Project, "my");
        }
        break;
      }
      case "project.deleted": {
        const id = data.project_id as string;
        if (id) useProjectsStore.getState().removeProject(id);
        break;
      }
      case "project.sorted": {
        const ids = data.project_ids as string[];
        if (ids) useProjectsStore.getState().updateLocalProjectSorting(ids, "my");
        break;
      }
      case "team.member_joined": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { project_id, member, project_name } = data as any;
        if (project_id && member) {
          useProjectsStore.getState().addMember(project_id, member);
          toast.success(`${member.username} joined the project "${project_name}"`);
        }
        break;
      }
      case "team.member_left": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { project_id, member, project_name } = data as any;
        if (project_id && member) {
          useProjectsStore.getState().removeMember(project_id, member.id);
          if (member.id === localStorage.getItem("user_id")) {
            useProjectsStore.getState().removeProject(project_id);
            if (pathname.includes(project_id)) {
              router.push("/board/home");
            }
          }
          toast(`${member.username} left the project "${project_name}"`, {
            icon: "👋",
          });
        }
        break;
      }
      default:
        break;
    }
  };

  useEffect(() => {
    manualDisconnectRef.current = false;
    connect();
    return () => {
      manualDisconnectRef.current = true;
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
} 