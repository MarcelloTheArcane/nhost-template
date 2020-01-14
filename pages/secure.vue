<template>
  <div>
    Secure page
  </div>
</template>

<script>
export default {
  name: 'Index',
  middleware: ['auth']
}
</script>
