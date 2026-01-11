import { Router, type RouteConfig} from "@mateothegreat/svelte5-router";
import Home from "../pages/Home.svelte";
import Project from "../pages/Project.svelte";
import Login from "../pages/Auth/Login.svelte"
import Register from "../pages/Auth/Register.svelte";
import Task from "../pages/Task.svelte";
  
export const routes: RouteConfig[] = [
  {
    path: "/",
    component: Home,
  },
  {
    path:"/login",
    component: Login
  },
  {
    path:"/register",
    component: Register
  },
  {
    path: "/projects",
    component: Project
  },
  {
    path: "/tasks",
    component: Task
  }
];