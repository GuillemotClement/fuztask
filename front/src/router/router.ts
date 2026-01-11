  import { Router, type RouteConfig} from "@mateothegreat/svelte5-router";
import Home from "../pages/Home.svelte";
import Project from "../pages/Project.svelte";

  
export const routes: RouteConfig[] = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/projects",
    component: Project
  }
];