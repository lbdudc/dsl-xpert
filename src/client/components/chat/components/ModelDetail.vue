<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const SERVER_URL = `${
  import.meta.env.VITE_SERVER_URL || "http://localhost:5000"
}`;

const props = defineProps({
  model: {
    type: Object,
    required: true,
  },
});

const deleteModel = async () => {
  const { _id } = props.model;

  const res = await fetch(`${SERVER_URL}/api/models/${_id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    console.error("Error deleting model");
    return;
  }

  router.push("/");
};

const goToForm = () => {
  router.push({ name: "ModelForm", params: { id: props.model.name } });
};
</script>
<template>
  <v-card class="flexcard mt-5">
    <v-card-title>
      <h1
        class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
      >
        Model: {{ model.name }}
      </h1>
      <v-chip class="text-xs mr-2" color="green" variant="outlined" size="small"
        >{{ model.developer }}
      </v-chip>
      <v-chip class="text-xs" color="blue" variant="outlined" size="small">
        {{ model.modelType }}
      </v-chip>
    </v-card-title>

    <v-card-subtitle class="py-4">
      <p>
        {{ model.description }}
      </p>
    </v-card-subtitle>

    <v-card-text>
      <p>
        <strong class="text-lg text-slate-900"> Model Details</strong>
      </p>
      <div class="mt-5 flex flex-col">
        <span class="text-slate-700">
          <strong>Temperature:</strong> {{ model.temperature }}
        </span>

        <span class="text-slate-700">
          <strong>Seed:</strong> {{ model.seed }}
        </span>
      </div>

      <div class="mt-10">Definition: {{ model.definition }}</div>
    </v-card-text>

    <v-card-actions class="flex justify-start ml-2">
      <v-btn
        color="orange"
        variant="tonal"
        prepend-icon="mdi-pencil"
        @click="goToForm"
        >Edit</v-btn
      >
      <v-btn
        color="red"
        variant="tonal"
        prepend-icon="mdi-delete"
        @click="deleteModel"
        >Delete</v-btn
      >
    </v-card-actions>
  </v-card>
</template>


<style scoped>
.flexcard {
  display: flex;
  flex-direction: column;
}

.flexcard .v-toolbar {
  flex: 0;
}
</style>