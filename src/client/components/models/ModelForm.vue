<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const SERVER_URL = `${import.meta.env.SERVER_URL || "http://localhost:5000"}`;

const router = useRouter();

const modelDeveloperItems = ["OpenAI", "LLama", "Mistral", "Alpaca"];
const modelTypeItems = ["gpt-3.5", "gpt-3.5-turbo", "gpt-4"];

const modelDeveloper = ref(null);
const modelType = ref(null);
const name = ref(null);
const temperature = ref(0.7);
const seed = ref(6);
const description = ref();
const definition = ref("");

const myForm = ref();
const loading = ref(false);

const submit = () => {
  // reset validation
  myForm.value.resetValidation();

  myForm.value.validate().then(({ valid: isValid }) => {
    if (!isValid) {
      return;
    }

    loading.value = true;
    fetch(`${SERVER_URL}/api/models`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        developer: modelDeveloper.value,
        modelType: modelType.value,
        name: name.value,
        temperature: temperature.value,
        seed: seed.value,
        description: description.value,
        definition: definition.value,
      }),
    }).then((res) => {
      res.json().then((res) => {
        loading.value = false;
        router.push({ name: "ModelChat", params: { id: res.name } });
      });
    });
  });
};
</script>

<template>
  <div class="w-screen px-40 pt-4">
    <h1 class="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">
      New Model
    </h1>

    <v-form ref="myForm" @submit.prevent="submit">
      <v-text-field
        v-model="name"
        label="Model name"
        placeholder="Enter model name"
        required
        :rules="[(v) => !!v || 'Name is required']"
        variant="outlined"
      >
      </v-text-field>

      <v-row no-gutters class="pb-2">
        <v-col cols="12" md="6" class="pr-6">
          <v-select
            v-model="modelDeveloper"
            :items="modelDeveloperItems"
            required
            :rules="[(v) => !!v || 'Model developer is required']"
            label="Model Developer"
            placeholder="Select a model developer"
            variant="outlined"
          >
          </v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="modelType"
            :items="modelTypeItems"
            label="Model type"
            :rules="[(v) => !!v || 'Model type is required']"
            placeholder="Select a model type"
            variant="outlined"
          >
          </v-select>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" md="6" class="pr-6">
          <v-text-field
            v-model="temperature"
            label="Temperature"
            placeholder="Enter a temperature for the model (0-1)"
            type="number"
            variant="outlined"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="seed"
            label="Seed"
            placeholder="Enter a seed for the model"
            type="number"
            variant="outlined"
          >
          </v-text-field>
        </v-col>
      </v-row>

      <v-textarea
        v-model="description"
        label="Model description"
        placeholder="Enter a description for the model"
        rows="2"
        no-resize
        clearable
        variant="outlined"
      >
      </v-textarea>

      <v-textarea
        v-model="definition"
        label="Model grammar definition"
        placeholder="Enter a definition for the model"
        :rules="[(v) => !!v || 'Definition is required']"
        auto-grow
        clearable
        variant="outlined"
      >
      </v-textarea>

      <!-- TODO EJEMPLOS -->

      <v-btn type="submit" color="blue-darken-4" :loading="loading"
        >Create Model</v-btn
      >
    </v-form>
  </div>
</template>


<style lang="scss" scoped>
</style>