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
  <v-card class="flexcard">
    <v-card-title>
      <h1 class="text-2xl font-bold tracking-tight text-slate-900 mb-2">
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
        <strong class="text-lg text-slate-900"> Model details</strong>
      </p>
      <div class="mt-5 flex flex-col">
        <span class="text-slate-700">
          <strong>Temperature:</strong> {{ model.temperature }}
        </span>

        <span class="text-slate-700">
          <strong>Seed:</strong> {{ model.seed }}
        </span>

        <span class="text-slate-700">
          <strong>Maximum length:</strong> {{ model.maximumLength }}
        </span>

        <span class="text-slate-700">
          <strong>Top P:</strong> {{ model.topP }}
        </span>

        <span class="text-slate-700">
          <strong>Repetition penalty:</strong> {{ model.repetitionPenalty }}
        </span>

        <span class="text-slate-700">
          <strong>Stop sequences:</strong> {{ model.stopSequences }}
        </span>
      </div>

      <div class="mt-10"><strong>Definition:</strong> {{ model.definition }}</div>

      <div class="mt-10">
        <strong>Examples:</strong>
        <ul class="example-list">
          <li v-for="example in model.definitionExamples" :key="example._id" class="example-item">
            <div class="example-item-content">
              <div class="example-item-label">User instruction:</div>
              <div class="example-item-value">{{ example.userInstruction }}</div>
            </div>
            <div class="example-item-content">
              <div class="example-item-label">Model answer:</div>
              <div class="example-item-value">{{ example.modelAnswer }}</div>
            </div>
          </li>
        </ul>
      </div>
    </v-card-text>

    <v-card-actions class="flex justify-start ml-2">
      <v-btn
        color="orange"
        variant="outlined"
        prepend-icon="mdi-pencil"
        @click="goToForm"
        >Edit</v-btn
      >
      <v-btn
        color="red"
        variant="outlined"
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

.example-list {
  list-style-type: none;
  padding: 0;
}

.example-item {
  margin-bottom: 10px;
}

.example-item-content {
  display: flex;
}

.example-item-label {
  flex-basis: 150px;
}

.example-item-value {
  flex-grow: 1;
  padding-left: 20px;
}
</style>