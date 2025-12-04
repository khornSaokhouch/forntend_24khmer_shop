<template>
  <nav class="bg-green-500 text-white p-4 flex justify-between items-center">
    <h1 class="font-bold text-lg">Admin Dashboard</h1>
    <button @click="$router.push('/login')" class="bg-white text-green-500 px-3 py-1 rounded hover:bg-gray-100">
      Logout
    </button>
  </nav>
</template>

<script>
export default {
  name: 'AdminNavbar'
}
</script>
