<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { router } from '../router';
import api from '../config/axios';
import { isAxiosError } from 'axios';
import { toast } from 'vue-sonner';


  //Interfaces

interface User {
  name: string;
  email: string;
  age: number;
  createdAt: string;
  updatedAt: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

   //declaraciones state para el componente
const user = ref<User | null>(null);
const tasks = ref<Task[]>([]);
const loadingTasks = ref(true);

const showCreateModal = ref(false);
const creatingTask = ref(false);

const newTask = ref({
  title: '',
  description: ''
});


   //ciclo de vida

onMounted(async () => {
  try {
    //obtener el usuario autenticado desde la api
    const { data } = await api.get('/user');
    user.value = data;
    await getTasks();
  } catch {
    localStorage.removeItem('token');
    router.push('/login');
  }
});


   //Metodos

const getTasks = async () => {
  try {
    loadingTasks.value = true;
    const { data } = await api.get('/tasks');
    tasks.value = data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      toast.error(error.response.data.error);
    }
  } finally {
    loadingTasks.value = false;
  }
};

const updateTask = async (taskId: string, completed: boolean) => {
  try {
    await api.patch(`/tasks/${taskId}`, { completed: !completed });
    await getTasks();
    toast.success('Tarea actualizada');
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      toast.error(error.response.data.error);
    }
  }
};

const createTask = async () => {
  if (!newTask.value.title.trim()) {
    toast.error('El título es obligatorio');
    return;
  }

  try {
    creatingTask.value = true;
    await api.post('/createTask', newTask.value);

    toast.success('Tarea creada');
    showCreateModal.value = false;

    newTask.value = { title: '', description: '' };
    await getTasks();
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      toast.error(error.response.data.error);
    }
  } finally {
    creatingTask.value = false;
  }
};

const deleteTask = async (taskId: string) => {
  try {
    await api.delete(`/tasks/${taskId}`);
    toast.success('Tarea eliminada');
    await getTasks();
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      toast.error(error.response.data.error);
    }
  }
};
</script>

<template>
  <div class="mx-auto flex min-h-screen w-full flex-col bg-slate-900">

    <!-- ================= HEADER ================= -->
    <header class="border-b border-slate-800">
      <div class="container mx-auto px-4 py-6 xl:max-w-7xl flex justify-between items-center">
        <h1 class="text-xl font-semibold text-slate-200">
          ToDo Dashboard
        </h1>

        <div class="text-sm text-slate-400 uppercase">
          {{ user?.name ?? 'Cargando...' }}
        </div>
      </div>
    </header>

    <!-- ================= MAIN ================= -->
    <main class="flex flex-auto">
      <div class="container mx-auto px-4 py-8 xl:max-w-7xl w-full">

        <!-- Header actions -->
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-lg font-medium text-slate-200">
            Mis tareas
          </h2>

          <button
            @click="showCreateModal = true"
            class="rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Nueva tarea
          </button>
        </div>

        <!-- Loading -->
        <div v-if="loadingTasks" class="text-slate-400">
          Cargando tareas...
        </div>

        <!-- Empty -->
        <div
          v-else-if="tasks.length === 0"
          class="rounded-lg border border-slate-800 bg-slate-800/30 p-6 text-slate-400"
        >
          No tienes tareas aún.
        </div>

        <!-- List -->
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
                @change="updateTask(task._id, task.completed)"
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

            <div class="flex items-center gap-3">
              <span class="text-xs text-slate-500">
                {{ new Date(task.createdAt).toLocaleDateString() }}
              </span>
              <button
                @click="deleteTask(task._id)"
                class="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </li>
        </ul>

      </div>
    </main>

    <!-- ================= MODAL ================= -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div class="w-full max-w-md rounded-lg bg-slate-900 p-6 shadow-xl">

        <div class="mb-4 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-slate-200">
            Nueva tarea
          </h3>
          <button
            @click="showCreateModal = false"
            class="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="createTask" class="space-y-4">
          <div>
            <label class="block text-sm text-slate-400 mb-1">
              Título
            </label>
            <input
              v-model="newTask.title"
              type="text"
              class="w-full rounded-lg bg-slate-800 px-4 py-2 text-slate-200 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm text-slate-400 mb-1">
              Descripción
            </label>
            <textarea
              v-model="newTask.description"
              rows="3"
              class="w-full rounded-lg bg-slate-800 px-4 py-2 text-slate-200 focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              @click="showCreateModal = false"
              class="px-4 py-2 text-sm text-slate-400 hover:text-white"
            >
              Cancelar
            </button>

            <button
              type="submit"
              :disabled="creatingTask"
              class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {{ creatingTask ? 'Creando...' : 'Crear' }}
            </button>
          </div>
        </form>

      </div>
    </div>

    <!-- ================= FOOTER ================= -->
    <footer class="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
      © ToDo API
    </footer>

  </div>
</template>
