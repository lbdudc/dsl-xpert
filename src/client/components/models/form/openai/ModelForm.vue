<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import ModelGrammarValidator from "./ModelGrammarValidator.vue";
import { fetchModel, createModel, updateModel, assignModelProperties } from './modelService.js';
import { initialValues, modelDeveloperItems, grammarTypeItems, modelTypeItems } from './modelConstants.js';

const SERVER_URL = `${import.meta.env.VITE_SERVER_URL || "http://localhost:5000"}`;

const route = useRoute();
const router = useRouter();

const model = reactive({
  id: null,
  developer: null,
  modelType: null,
  apiKey: "",
  showApiKey: false,
  name: null,
  temperature: 0.2,
  maximumLength: 4095,
  topP: 1,
  repetitionPenalty: 0,
  stopSequences: [";", "###"],
  seed: 6,
  grammarType: null,
  description: "",
  definition: "",
  definitionExamples: [],
  activeTab: 0,
  singleStopSequence: ""
});

const loading = ref(false);

onMounted(() => {
  if (route.params.id) {
    fetchModel(SERVER_URL, route.params.id).then((res) => {
      assignModelProperties(res, model);
    });
  }
});

const handleContentUpdate = (content) => {
  model.definition = content;
};

const resolver = async (values) => {
  const errors = {};

  if (!values.values["modelName"]) {
    errors.modelName = [{ message: 'ModelName is required.' }];
  }

  if (!values.values["description"]) {
    errors.definition = [{ message: 'Description is required.' }];
  }

  if (!values.values["developer"]) {
    errors.developer = [{ type: 'required', message: 'Model Developer is required.' }];
  }

  if (!values.values["modelType"]) {
    errors.modelType = [{ type: 'required', message: 'Model Type is required.' }];
  }

  if (values.values["developer"] === 'OpenAI' && !values.values["apiKey"]) {
    errors.apiKey = [{
      type: 'required', message: 'API Key is required'
    }];
  }

  return {
    errors
  }
};

const onFormSubmit = async (valid) => {
  if (!valid || Object.keys(valid.errors).length > 0) {
    return;
  }

  let res;
  loading.value = true;

  if (model.id) {
    res = await updateModel(SERVER_URL, model.id, model);
  } else {
    res = await createModel(SERVER_URL, model);
  }

  loading.value = false;
  router.push({ name: "ModelChat", params: { id: res.name } });
};

const addStopSequence = () => {
  model.stopSequences.push(model.singleStopSequence);
  model.singleStopSequence = "";
};

const removeStopSequence = (stopSequenceIndex) => {
  model.stopSequences.splice(stopSequenceIndex, 1);
};

const addCard = () => {
  model.definitionExamples.push({ userInstruction: "", modelAnswer: "" });
  if (model.definitionExamples.length > 1) {
    model.activeTab = model.definitionExamples.length - 1;
  } else {
    model.activeTab = 0;
  }
};

const removeCard = (cardIndex) => {
  model.definitionExamples.splice(cardIndex, 1);
  if (model.definitionExamples.length > 1) {
    model.activeTab = model.definitionExamples.length - 1;
  } else {
    model.activeTab = 0;
  }
};
</script>

<template>
  <div class="w-screen pt-4 flex-grow flex flex-col pl-10 pr-14">
    <h1 class="text-xl tracking-tighter sm:text-4xl mb-6">
      New Model
    </h1>

    <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit" class="flex flex-col gap-4">
      <FloatLabel class="flex flex-col gap-2" variant="in">
        <InputText name="modelName" id="modelname" v-model="model.name" label="Model name" fluid>
        </InputText>
        <label for="modelname">Model Name</label>
      </FloatLabel>

      <FloatLabel class="flex flex-col gap-2" variant="in">
        <Textarea name="description" v-model="model.description" label="Model Description"
          :rules="[(v) => !!v || 'Description is required']">
        </Textarea>
        <label for="modeldescription">Model Description</label>
      </FloatLabel>

      <div class="flex flex-col gap-2 md:flex-row">
        <Select name="developer" v-model="model.developer" :options="modelDeveloperItems" label="Model developer"
          placeholder="Select a model developer" class="flex-grow md:w-1/2">
        </Select>

        <Select name="modelType" v-model="model.modelType" :options="modelTypeItems" label="Model type"
          placeholder="Select a model type" class="flex-grow md:w-1/2">
        </Select>
      </div>

      <div v-if="model.developer === 'OpenAI'" class="justify-items-center self-center">
        <Password v-model="model.apiKey" name="apiKey" label="OpenAI API key" placeholder="Enter OpenAI API key"
          autocomplete="off" :feedback="false" toggleMask :rules="[(v) => !!v || 'API key is required']" class="w-fit">
        </Password>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FloatLabel class="flex flex-col gap-2" variant="in">
          <InputText name="temperature" id="temperature" v-model="model.temperature" label="Temperature"
            v-tooltip.top='"From OpenAI docs: What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.We generally recommend altering this or top_p but not both."'
            type="number">
          </InputText>
          <label for="temperature">Temperature</label>
        </FloatLabel>

        <FloatLabel class="flex flex-col gap-2" variant="in">
          <InputText name="seed" id="seed" v-model="model.seed" label="Seed" placeholder="Enter a seed for the model"
            type="number"
            v-tooltip.top='"From OpenAI docs: If specified, our system will make a best effort to sample deterministically, such that repeated requests with the same seed and parameters should return the same result."'>
          </InputText>
          <label for="seed">Seed</label>
        </FloatLabel>

        <FloatLabel class="flex flex-col gap-2" variant="in">
          <InputText name="maximumLength" id="maximumLength" v-model="model.maximumLength" label="Maximum length"
            placeholder="Enter a maximum length for the model responses" type="number"
            v-tooltip.top='"The maximum number of tokens that can be generated for each model response. Take into account that each model type may have its own limitations in this regard."'>
          </InputText>
          <label for="maximumLength">Maximum length</label>
        </FloatLabel>

        <FloatLabel class="flex flex-col gap-2" variant="in">
          <InputText name="topP" id="topP" v-model="model.topP" label="Top P"
            placeholder="Enter a top P number for the model" type="number"
            v-tooltip.top='"From OpenAI docs: An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass.So 0.1 means only the tokens comprising the top 10 % probability mass are considered. We generally recommend altering this or temperature but not both."'>
          </InputText>
          <label for="topP">Top P</label>
        </FloatLabel>


        <FloatLabel class="flex flex-col gap-2" variant="in">
          <InputText name="repetitionPenalty" id="repetitionPenalty" v-model="model.repetitionPenalty"
            label="Repetition penalty" placeholder="Enter a repetition penalty for the model responses" type="number"
            v-tooltip.top='"From OpenAI docs: Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency and whether they appear in the text so far, decreasing the model s likelihood to repeat the same line verbatim and increasing its likelihood to talk about new topics."'>
          </InputText>
          <label for="repetitionPenalty">Repetition penalty</label>
        </FloatLabel>

        <div>
          <FloatLabel class="flex flex-col gap-2" variant="in">
            <InputText v-model="model.singleStopSequence" label="Stop sequences" append-icon="mdi-plus"
              v-tooltip='"From OpenAI docs: Up to 4 sequences where the model will stop generating further tokens."'
              @keyup.enter="addStopSequence" @click:append="addStopSequence">
            </InputText>
            <label for="singleStopSequence">Stop sequences</label>
          </FloatLabel>

          <Chip v-for="(singleStopSequence, stopSequenceIndex) in model.stopSequences" :key="stopSequenceIndex"
            class="ma-1" removable @click:close="removeStopSequence(stopSequenceIndex)">
            {{ singleStopSequence }}
          </Chip>
        </div>
      </div>

      <Select name="grammarType" v-model="model.grammarType" :options="grammarTypeItems" label="Grammar type"
        :rules="[(v) => !!v || 'Grammar type is required']" placeholder="Select a grammar type">
      </Select>

      <ModelGrammarValidator v-if="model.grammarType" :key="model.grammarType" :grammarType="model.grammarType"
        @updateContent="handleContentUpdate">
      </ModelGrammarValidator>

      <!-- EXAMPLE TABS CARDS -->
      <Tabs :value="model.activeTab" scrollable>
        <TabList>
          <Tab v-for="(card, cardIndex) in model.definitionExamples" :key="cardIndex" :value="cardIndex">
            Example {{ cardIndex + 1 }}
          </Tab>
          <Tab @click="addCard">
            <Button label="Add Example" icon="pi pi-plus" severity="success" variant="text" />
          </Tab>
        </TabList>

        <TabPanel v-for="(card, cardIndex) in model.definitionExamples" :key="cardIndex" :value="cardIndex">
          <Card>
            <template #content>
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2 min-h-[200px]">
                <Textarea v-model="card.userInstruction" label="User instruction"
                  placeholder="Enter an instruction for the model" rows="2" auto-grow>
              </Textarea>
                <Textarea v-model="card.modelAnswer" label="Model answer"
                  placeholder="Enter the desired result for that instruction" rows="2" auto-grow>
              </Textarea>
              </div>
            </template>

            <template #footer>
              <Button @click="removeCard(cardIndex)" label="Remove" icon="pi pi-times" severity="danger" variant="text">
              </Button>
            </template>
          </Card>
        </TabPanel>
      </Tabs>

      <Button type="submit" :loading="loading" severity="success" icon="pi pi-check"
        :label="model.id ? 'Update' : 'Create' + ' Model'" />
    </Form>
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

.v-card {
  background-color: var(--v-background-base) !important;
  color: var(--v-text-base) !important;
}
</style>
