<script setup lang="ts">
import {ref} from 'vue';
import api from '../config/axios';
import {toast} from 'vue-sonner';
import {isAxiosError} from 'axios';
// objeto reactivo del formulario

const usuario = ref({
  name: '',
  email: '',
  password: '',
  age: 0
});

// mandar datos al api (consumir)
const registrarUsuario = async () => {
  try {
    await api.post('/register', usuario.value);
    toast.success('Usuario registrado correctamente');

    usuario.value = {
      name: '',
      email: '',
      password: '',
      age: 0
    };
    
  } catch (error: any) {
    if(isAxiosError(error) && error.response){
      toast.error(error.response?.data.error);
    }
    
  }

};

</script>
<template>
<!--   registration form -->
   <div class="flex min-h-screen mx-auto justify-center items-center bg-gray-50 py-12 px-4">
   <div class="registration-form max-w-md w-full space-y-8">
     <div>
       <h2 class="text-center text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800">Registro</h2>
       <p class="mt-1 text-center text-gray-500">Tienes una cuenta? <a id="login-link" href="/login" class="text-green-500 hover:underline">Iniciar sesión</a></p>
     </div>
    <!--form empieza -->
    <form class="bg-white py-8 px-6 shadow rounded-lg mb-0 space-y-5" @submit.prevent="registrarUsuario">
      
        <div>
      <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
      <div class="mt-1">
        <input v-model="usuario.name" type="text" name="name" id="name"  class="appearance-none px-3 py-2 w-full border border-gray-300 rounded shadow-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" required>
      </div>
    </div>
    
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
      <div class="mt-1">
        <input v-model="usuario.email" type="text" name="email" id="email" class="appearance-none px-3 py-2 w-full border border-gray-300 rounded shadow-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" required>
      </div>
    </div>
      
      <div>
      <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
      <div class="mt-1">
        <input v-model="usuario.password" type="password" name="password" id="password" class="appearance-none px-3 py-2 w-full border border-gray-300 rounded shadow-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" required>
      </div>
    </div>
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">Age</label>
      <div class="mt-1">
        <input v-model="usuario.age" type="number" name="age" id="age" class="appearance-none px-3 py-2 w-full border border-gray-300 rounded shadow-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" required>
    </div>
    </div>
      
    <button type="submit" class="w-full px-4 py-2 text-center bg-green-500 rounded border border-transparent shadow-sm text-white font-medium hover:bg-green-600 focus:outline-none focus:ring-1 focus:ring-green-400" >Sign Up</button>
    
  </form>
   </div>
  </div>
</template>

