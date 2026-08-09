<template>
  <div class="navbar bg-primary text-primary-content">
    <div class=" navbar-start">
      <NuxtLink to="/" class="btn btn-ghost text-xl text-white">
        Travel Log
      </NuxtLink>
    </div>
    <div class="navbar-end">
      <AppThemeToggle />
      <AuthButton />
    </div>
  </div>
</template>
