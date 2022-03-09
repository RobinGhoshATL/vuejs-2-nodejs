<template>
  <div class="modal" :class="{ 'is-active': shown }">
    <div class="modal-background" @click="$emit('close')" />
    <div class="modal-content">
      <div class="notification is-info is-light">
        <button class="delete" @click="$emit('close')" />

        <h5 class="title is-5">
          {{ title }}
          <a v-if="link" class="button is-primary is-pulled-right" target="_blank" :href="link">{{ link }}</a>
        </h5>
        <table v-if="content" class="table is-striped is-hoverable is-fullwidth" :class="{ 'wrap-pre': wrap }">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) of content" :key="item.id">
              <td> {{index + 1}} </td>
              <td><img :src="item.small_image" style="width: 50px; height: 50px" /></td>
              <td>{{ item.name }}</td>
               <td>{{ item.description }}</td>
              <td><del style="text-decoration-color: red;">${{ item.retail_price }}</del> ${{ item.sale_price }}</td>
              <td><i class="fas fa-edit"></i> <i class="fas fa-trash-alt"></i></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductList',
  
  props: {
    shown: {
      type: Boolean,
      default: false,
    },
    content: {
      type: Object,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: false,
      default: '',
    },
    wrap: {
      type: Boolean,
      default: false,
    },
  },

  mounted: {
    // ImageOnError(event) {
    //   // event.target.src = '../assets/default.jpg';
    //   console.log("image fail  to load", event)
    // }
  },
}
</script>

<style scoped>
.modal-content {
  width: 80% !important;
}

.wrap-pre {
  word-wrap: break-word;
  white-space: pre-wrap;
}
</style>