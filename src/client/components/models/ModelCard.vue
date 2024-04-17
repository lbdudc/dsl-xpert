<script setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  model: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const goToDetail = () => {
  router.push({ name: "ModelChat", params: { id: props.model.name } });
};

const goToForm = () => {
  router.push({ name: "ModelForm", params: { id: props.model.name } });
};
</script>
<template>
  <v-card
    @click="goToDetail()"
    class="bg-white rounded-lg shadow-md max-w-[400px] min-w-[300px]"
  >
    <v-card-title>
      <h2 class="text-base font-semibold">{{ props.model.name }}</h2>
    </v-card-title>

    <v-card-subtitle v-if="props.model.description">
      <span class="text-ellipsis overflow-hidden ...">
        {{ props.model.description }}
      </span>
    </v-card-subtitle>
    <v-card-subtitle v-else>
      <br />
    </v-card-subtitle>

    <v-card-text>
      <v-chip class="text-xs" color="green" variant="outlined" size="small">
        {{ props.model.developer }}
      </v-chip>
      <v-chip class="text-xs" color="blue" variant="outlined" size="small">
        {{ props.model.modelType }}
      </v-chip>
    </v-card-text>
    <v-card-actions>
      <v-row no-gutters justify="space-between">
        <v-btn
          class="me-2 text-none"
          color="#1e293b"
          prepend-icon="mdi-chat"
          variant="flat"
        >
          Chat
        </v-btn>
        <v-btn
          @click.stop="goToForm()"
          class="me-2 text-none"
          color="#f08b26"
          prepend-icon="mdi-pencil"
          variant="text"
        >
          Edit
        </v-btn>
      </v-row>
    </v-card-actions>
  </v-card>
</template>


<style lang="scss" scoped>
</style>