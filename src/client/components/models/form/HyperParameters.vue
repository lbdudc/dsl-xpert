<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { hyperParameterPresets } from "@/consts/grammar";

// Props and other variables
const props = defineProps({
    model: {
        type: Object,
        required: true
    }
});

const model = reactive(props.model);
const preset = ref(null);
const visible = ref(false);


const addStopSequence = () => {
    model.stopSequences.push(model.singleStopSequence);
    model.singleStopSequence = "";
};

const removeStopSequence = (stopSequenceIndex) => {
    model.stopSequences.splice(stopSequenceIndex, 1);
};


watch(() => model.modelType, () => {
    preset.value = hyperParameterPresets[model.modelType];
});

const applyPreset = () => {
    const preset = hyperParameterPresets[model.modelType];

    Object.keys(preset).forEach((key) => {
        model[key] = preset[key];
    });

    visible.value = false;
};

</script>

<template>
    <div>
        <section class="mb-4">
            <h3 class="text-lg font-semibold">Hyperparameters</h3>
            <p class="text-sm text-gray-500">Fine-tune the model's behavior with these hyperparameters</p>
        </section>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FloatLabel class="flex flex-col gap-4" variant="in">
                <InputText name="temperature" id="temperature" v-model="model.temperature" label="Temperature"
                    v-tooltip.top='"From OpenAI docs: What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.We generally recommend altering this or top_p but not both."'
                    type="number">
                </InputText>
                <label for="temperature">Temperature</label>
            </FloatLabel>

            <FloatLabel class="flex flex-col gap-4" variant="in">
                <InputText name="seed" id="seed" v-model="model.seed" label="Seed"
                    placeholder="Enter a seed for the model" type="number"
                    v-tooltip.top='"From OpenAI docs: If specified, our system will make a best effort to sample deterministically, such that repeated requests with the same seed and parameters should return the same result."'>
                </InputText>
                <label for="seed">Seed</label>
            </FloatLabel>

            <FloatLabel class="flex flex-col gap-4" variant="in">
                <InputText name="maximumLength" id="maximumLength" v-model="model.maximumLength" label="Maximum length"
                    placeholder="Enter a maximum length for the model responses" type="number"
                    v-tooltip.top='"The maximum number of tokens that can be generated for each model response. Take into account that each model type may have its own limitations in this regard."'>
                </InputText>
                <label for="maximumLength">Maximum length</label>
            </FloatLabel>

            <FloatLabel class="flex flex-col gap-4" variant="in">
                <InputText name="topP" id="topP" v-model="model.topP" label="Top P"
                    placeholder="Enter a top P number for the model" type="number"
                    v-tooltip.top='"From OpenAI docs: An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass.So 0.1 means only the tokens comprising the top 10 % probability mass are considered. We generally recommend altering this or temperature but not both."'>
                </InputText>
                <label for="topP">Top P</label>
            </FloatLabel>

            <FloatLabel class="flex flex-col gap-4" variant="in">
                <InputText name="repetitionPenalty" id="repetitionPenalty" v-model="model.repetitionPenalty"
                    label="Repetition penalty" placeholder="Enter a repetition penalty for the model responses"
                    type="number"
                    v-tooltip.top='"From OpenAI docs: Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency and whether they appear in the text so far, decreasing the model s likelihood to repeat the same line verbatim and increasing its likelihood to talk about new topics."'>
                </InputText>
                <label for="repetitionPenalty">Repetition penalty</label>
            </FloatLabel>

            <div class="flex flex-row gap-1">
                <FloatLabel variant="in" class="w-full">
                    <InputText fluid v-model="model.singleStopSequence" label="Stop sequences" append-icon="mdi-plus"
                        v-tooltip='"From OpenAI docs: Up to 4 sequences where the model will stop generating further tokens."'
                        @keyup.enter="addStopSequence" @click:append="addStopSequence">
                    </InputText>
                    <label for="singleStopSequence">Stop sequences</label>
                </FloatLabel>

                <Chip v-for="(singleStopSequence, stopSequenceIndex) in model.stopSequences" :key="stopSequenceIndex"
                    class="w-1/6" removable @click:close="removeStopSequence(stopSequenceIndex)">
                    {{ singleStopSequence }}
                </Chip>
            </div>
        </div>

        <Divider class="pt-4" v-if="preset" />
        <section v-if="preset" class="flex flex-col gap-4 md:flex-row md:items-center md:justify-start">
            <p class="text-sm flex items-center gap-2">
                <i class="pi pi-info-circle text-xl text-blue-500"></i>
                We found a preset for this model that probably work well, want to use it?
            </p>
            <div class="flex flex-row gap-1">
                <Button variant="text" severity="info" @click="visible = true">View preset</Button>
            </div>
            <Dialog v-model:visible="visible" header="Preset Information" :style="{ width: '40vw' }">
                <div class="flex flex-col gap-4 mb-4">
                    <p v-for="(value, key) in preset" :key="key">
                        <strong>{{ key }}:</strong> {{ value }}
                    </p>
                </div>
                <div class="flex justify-end gap-2">
                    <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                    <Button type="button" label="Apply Preset" @click="applyPreset"></Button>
                </div>
            </Dialog>
        </section>
    </div>
</template>

<style></style>