<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { router } from '../router/index';
import api from '../config/axios';
import {isAxiosError } from 'axios';
import { toast } from 'vue-sonner';

interface user{
  name: string,
  email: string,
  age: number,
  createdAt: string,
  updatedAt: string
}
interface task{
  _id: string,
  title: string,
  description: string,
  completed: boolean,
  createdAt: string
}
const user = ref<user | null>(null);
const tasks = ref<task[]>([]);
const loadingTasks = ref(true)

onMounted(async () => {
  try {
    const { data } = await api.get('/user');
    user.value = data;
    await getTasks();
  } catch (error) {
    localStorage.removeItem('token');
    router.push('/login');
  }
});

const getTasks = async() => {
  try{
    const {data} = await api.get('/tasks');
    tasks.value = data;
  }catch(error: any){
    if(isAxiosError(error) && error.response){
      toast.error(error.response?.data.error)
    }
  }finally{
    loadingTasks.value = false;
  }
};


</script>

<template>
  <div class="mx-auto flex min-h-screen w-full min-w-[320px] flex-col bg-slate-900">
    
    <!-- Header -->
    <header class="z-10 flex flex-none items-center">
      <div class="container mx-auto px-4 lg:px-8 xl:max-w-7xl">
        <div class="flex justify-between py-10">
          
          <!-- Logo -->
          <div class="flex items-center gap-2 lg:gap-6">
            <a
              href="javascript:void(0)"
              class="group inline-flex items-center gap-2 font-semibold tracking-wider uppercase text-slate-200 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="size-5 -rotate-12 text-indigo-400 transition group-hover:rotate-0"
              >
                <path
                  fill-rule="evenodd"
                  d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm6.39-2.908a.75.75 0 01.766.027l3.5 2.25a.75.75 0 010 1.262l-3.5 2.25A.75.75 0 018 12.25v-4.5a.75.75 0 01.39-.658z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="hidden sm:inline-block">ToDo API</span>
            </a>
          </div>

          <!-- Right section -->
          <div class="flex items-center gap-2 lg:gap-4">
            
            <!-- Search -->
            <form class="w-40 sm:w-72 lg:w-96" @submit.prevent>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex w-14 items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="size-5 text-slate-500"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  class="block w-full rounded-full bg-slate-800 py-3 ps-12 pe-5 text-sm text-slate-200 placeholder:text-slate-400 focus:ring-3 focus:ring-slate-500/50"
                />
              </div>
            </form>

            <!-- User info -->
            <div
              class="flex items-center gap-3 rounded-full bg-slate-500/10 px-3 py-2 text-sm font-medium text-slate-200"
            >
              <img
                src=""
                alt="User Avatar"
                class="size-8 rounded-full"
              />
              <span class="hidden sm:inline-block overflow-hidden text-ellipsis whitespace-nowrap max-w-[8rem] uppercase">
                {{ user?.name ?? 'Cargando...' }}
              </span>
            </div>

          </div>
        </div>
      </div>
    </header>

    <!-- Navigation -->
    <div class="container mx-auto px-4 lg:px-8 xl:max-w-7xl">
      <nav
        class="flex items-center gap-4 rounded-sm border border-slate-800/50 bg-slate-800/25 p-5"
      >
        <a class="text-lg font-light text-white">
          Tasks
        </a>
      </nav>
    </div>

    <!-- Main content -->
    <main class="flex flex-auto flex-col">
  <div class="container mx-auto px-4 py-8 lg:px-8 xl:max-w-7xl">

    <!-- Loading -->
    <div v-if="loadingTasks" class="text-slate-400">
      Cargando tareas...
    </div>

    <!-- Empty state -->
    <div
      v-else-if="tasks.length === 0"
      class="rounded-lg border border-slate-800 bg-slate-800/30 p-6 text-slate-400"
    >
      No tienes tareas aún.
    </div>

    <!-- Task list -->
    <ul v-else class="space-y-4">
      <li
        v-for="task in tasks"
        :key="task._id"
        class="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/30 p-4"
      >
        <div class="flex items-center gap-3">
          <input
            type="checkbox"
            :checked="task.completed"
            enabled
            class="size-4"
          />
          <span
            :class="{
              'line-through text-slate-500': task.completed,
              'text-slate-200': !task.completed
            }"
          >
            {{ task.title }}
          </span>
        </div>

        <span class="text-xs text-slate-500">
          {{ new Date(task.createdAt).toLocaleDateString() }}
        </span>
      </li>
    </ul>

  </div>
</main>


    <!-- Footer -->
    <footer class="border-t border-slate-800">
      <div
        class="container mx-auto px-4 py-10 text-center text-sm font-medium text-gray-500 lg:px-8 xl:max-w-7xl"
      >
        © <span class="font-semibold">To-Do API</span>
      </div>
    </footer>

  </div>
</template>
