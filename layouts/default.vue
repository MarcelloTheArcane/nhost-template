<template>
  <div>
    <button @click="logout">
      Logout
    </button>
    <nuxt />
  </div>
</template>

<script>
export default {
  name: 'Default',
  methods: {
    logout () {
      this.$auth.logout()
      this.$router.push('/login')
      // this.$auth.strategy
    }
  }
}
</script>
