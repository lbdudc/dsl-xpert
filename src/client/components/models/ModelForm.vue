<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const SERVER_URL = `${
  import.meta.env.VITE_SERVER_URL || "http://localhost:5000"
}`;

const route = useRoute();
const router = useRouter();

const modelDeveloperItems = ["OpenAI", "Meta", "Mistral", "Google"];
const modelTypeItems = ["gpt-3.5-turbo", "gpt-3.5-turbo-0125", "gpt-3.5-turbo-16k", "gpt-4", "gpt-4-turbo"];

const id = ref(null);
const modelDeveloper = ref(null);
const modelType = ref(null);
const name = ref(null);
const temperature = ref(0.2);
const maximumLength = ref(4095);
const topP = ref(1);
const repetitionPenalty = ref(0);
const stopSequences = ref([";", "###"]);
const seed = ref(6);
const description = ref();
const definition = ref("");
const definitionExamples = ref([{ userInstruction: '', modelAnswer: '' }]);

const myForm = ref();
const loading = ref(false);
const singleStopSequence = ref("");

onMounted(() => {
  if (route.params.id) {
    fetch(`${SERVER_URL}/api/models/${route.params.id}`).then((res) => {
      res.json().then((res) => {
        id.value = res._id;
        modelDeveloper.value = res.developer;
        modelType.value = res.modelType;
        name.value = res.name;
        temperature.value = res.temperature;
        maximumLength.value = res.maximumLength;
        topP.value = res.topP;
        repetitionPenalty.value = res.repetitionPenalty;
        stopSequences.value = res.stopSequences;
        seed.value = res.seed;
        description.value = res.description;
        definition.value = res.definition;
        definitionExamples.value = res.definitionExamples;
      });
    });
  }
});

const submit = async () => {
  // reset validation
  myForm.value.resetValidation();

  const { valid } = await myForm.value.validate();

  if (!valid) {
    return;
  }

  let res;

  loading.value = true;

  if (id.value) {
    res = await updateModel();
  } else {
    res = await createModel();
  }

  loading.value = false;
  router.push({ name: "ModelChat", params: { id: res.name } });
};

const createModel = async () => {
  const res = await fetch(`${SERVER_URL}/api/models`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      developer: modelDeveloper.value,
      modelType: modelType.value,
      name: name.value,
      temperature: temperature.value,
      maximumLength: maximumLength.value,
      topP: topP.value,
      repetitionPenalty: repetitionPenalty.value,
      stopSequences: stopSequences.value,
      seed: seed.value,
      description: description.value,
      definition: definition.value,
      definitionExamples: definitionExamples.value,
    }),
  });

  const json = await res.json();
  return json;
};

const updateModel = async () => {
  const res = await fetch(`${SERVER_URL}/api/models/${id.value}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      developer: modelDeveloper.value,
      modelType: modelType.value,
      name: name.value,
      temperature: temperature.value,
      maximumLength: maximumLength.value,
      topP: topP.value,
      repetitionPenalty: repetitionPenalty.value,
      stopSequences: stopSequences.value,
      seed: seed.value,
      description: description.value,
      definition: definition.value,
      definitionExamples: definitionExamples.value,
    }),
  });

  const json = await res.json();

  return json;
};

const addStopSequence = () => {
  stopSequences.value.push(singleStopSequence.value);
  singleStopSequence.value = '';
};
  
const removeStopSequence = (stopSequenceIndex) => {
  stopSequences.value.splice(stopSequenceIndex, 1);
}

const addCard = () => {
  definitionExamples.value.push({ userInstruction: '', modelAnswer: '' });
};

const removeCard = (cardIndex) => {
  definitionExamples.value.splice(cardIndex, 1);
};
</script>

<template>
  <div class="w-screen px-40 pt-4 flex-grow flex flex-col">
    <h1 class="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">
      New Model
    </h1>

    <v-form ref="myForm" @submit.prevent="submit" class="flex flex-col gap-4">
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
            label="Model developer"
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
            placeholder="Enter a temperature for the model [0-2]"
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

      <v-row no-gutters>
        <v-col cols="12" md="6" class="pr-6">
          <v-text-field
            v-model="maximumLength"
            label="Maximum length"
            placeholder="Enter a maximum length for the model responses"
            type="number"
            variant="outlined"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="topP"
            label="Top P"
            placeholder="Enter a top P number for the model"
            type="number"
            variant="outlined"
          >
          </v-text-field>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" md="6" class="pr-6">
          <v-text-field
            v-model="repetitionPenalty"
            label="Repetition penalty"
            placeholder="Enter a repetition penalty for the model responses"
            type="number"
            variant="outlined"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="singleStopSequence"
            label="Stop sequences"
            placeholder="Enter stop sequences for the model"
            variant="outlined"
            append-icon="mdi-plus"
            @keyup.enter="addStopSequence"
            @click:append="addStopSequence"
          >
          </v-text-field>
          <v-chip
            v-for="(singleStopSequence, stopSequenceIndex) in stopSequences"
              :key="stopSequenceIndex"
              class="ma-1"
              closable
              @click:close="removeStopSequence(stopSequenceIndex)"
          >
            {{ singleStopSequence }}
          </v-chip>
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

      <v-card v-for="(card, cardIndex) in definitionExamples" :key="cardIndex" class="outlined-card">
        <v-card-title>
          <div>Usage example</div>
        </v-card-title>
        <v-card-text>
          <v-textarea 
            v-model="card.userInstruction" 
            label="User instruction"
            placeholder="Enter an instruction for the model"
            rows="2"
            auto-grow
            variant="outlined"
            >
          </v-textarea>
        </v-card-text>
        <v-card-text>
          <v-textarea 
            v-model="card.modelAnswer" 
            label="Model answer"
            placeholder="Enter the desired result for that instruction"
            rows="2"
            auto-grow
            variant="outlined"
            >
          </v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="removeCard(cardIndex)">Remove</v-btn>
        </v-card-actions>
      </v-card>
      <v-btn @click="addCard">Add example</v-btn>

      <v-btn type="submit" color="blue-darken-4" :loading="loading">
        {{ id ? "Update" : "Create" }} Model
      </v-btn>
    </v-form>
  </div>
</template>


<style scoped>
.flexcard {
  display: flex;
  flex-direction: column;
}

.flexcard .v-toolbar {
  flex: 0;
}

.outlined-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
}
</style>