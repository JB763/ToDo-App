<script setup lang="ts">
    import {ref} from 'vue';
    import api from '../config/axios';
    import {toast} from 'vue-sonner';
    import {isAxiosError} from 'axios';
    import {router} from '../router/index';


    const usuario = ref({
      email: '',
      password:''    
    });

    const login = async()=>{
      try{
          const {data} = await api.post('/login', usuario.value);
          localStorage.setItem('token', data);
          router.push('/dashboard')
      }catch(error: any){
          if(isAxiosError(error) && error.response){
          toast.error(error.response?.data.error);
        }
      }
    };
</script>
<template>
    <div class="flex min-h-screen mx-auto justify-center items-center bg-gray-50 py-12 px-4">
<!--   Login form -->
  <div class="max-w-md w-full space-y-8">
     <div>
       <h2 class="text-center text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800">Iniciar sesión</h2>
       <p class="mt-1 text-center text-gray-500">¿No tienes una cuenta? <a id="register-link" href="/register" class="text-green-500 hover:underline">Regístrate</a></p>
     </div>
    
    <form @submit.prevent="login" class="bg-white py-8 px-6 shadow rounded-lg mb-0 space-y-5">
      
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
      <div class="mt-1">
        <input v-model="usuario.email"type="text" name="email" id="email" class="appearance-none px-3 py-2 w-full border border-gray-300 rounded shadow-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" required>
      </div>
    </div>
         
      <div>
      <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
      <div class="mt-1">
        <input v-model="usuario.password" type="password" name="password" id="password" class="appearance-none px-3 py-2 w-full border border-gray-300 rounded shadow-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" required>
      </div>
    </div>
      
    <button type="submit" class="w-full px-4 py-2 text-center bg-green-500 rounded border border-transparent shadow-sm text-white font-medium hover:bg-green-600 focus:outline-none focus:ring-1 focus:ring-green-400" >Iniciar sesión</button>  
    
  </form>
   </div>

</div>

</template>