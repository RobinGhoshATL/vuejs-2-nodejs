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
              <th>Name</th>
              <th>Processed</th>
              <th>Active</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item of content" :key="item.id">
              <td> {{item.id}} </td>
              <td>{{ item.name }}</td>
              <td>{{ item.processed }}</td>
              <td>{{ item.isActive }}</td>
              <td><a :href="item.url" target="blank" style="color: blue;"> Click here</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileList',

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