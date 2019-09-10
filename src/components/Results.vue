// Results.vue file
<template>
  <div style = "border-style: solid; border-width:2px; float:right;">
    <li v-for="(message, index) in messageList" :item="message" :key="index">
      {{ message }}
    </li>
    <h3> Name : {{ name }} </h3>
  </div>
</template>

<script>
export default {
  name: "Results",
  props: {
    msg: {
      type: String
    }
  },
  data: function() {
    return {
      messageList: []
    };
  },
  watch: {
    msg: function() {
      this.messageList.push(this.msg);
    }
  }
};
</script>
