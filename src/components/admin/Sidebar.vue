<template>
  <aside class="w-64 bg-gray-800 text-white min-h-screen p-4">
    <h2 class="text-xl font-bold mb-6">Admin</h2>
    <ul>
      <li class="mb-2">
        <router-link to="/admin" class="block px-2 py-1 rounded hover:bg-gray-700">Dashboard</router-link>
      </li>
      <li class="mb-2">
        <router-link to="/admin/users" class="block px-2 py-1 rounded hover:bg-gray-700">Users</router-link>
      </li>
      <li class="mb-2">
        <router-link to="/admin/todos" class="block px-2 py-1 rounded hover:bg-gray-700">Todos</router-link>
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar'
}
</script>
