<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
    models: {
        type: Array,
        required: true,
    },
});

const emit = defineEmits(["delete"]);

const router = useRouter();

const goToDetail = (slotProps) => {
    const id = slotProps.data.name;
    router.push({ name: "ModelChat", params: { id: id } });
};

const goToForm = (slotProps) => {
    const name = slotProps.data.name;
    router.push({ name: "ModelForm", params: { id: name }, query: { m: "openai" } });
};

const sendDelete = (slotProps) => {
    emit("delete", slotProps.data);
};
</script>

<template>
    <DataTable :value="models" :paginator="false" stripedRows class="border border-zinc-300 shadow-md">
        <Column field="name" header="Name" sortable></Column>
        <Column field="developer" header="Developer" sortable></Column>
        <Column field="modelType" header="Model Type" sortable></Column>
        <Column field="grammarType.name" header="Grammar Type" sortable></Column>
        <Column header="Actions">
            <template #body="slotProps">
                <Button @click.stop="goToDetail(slotProps)" icon="pi pi-comments" />
                <Button @click.stop="goToForm(slotProps)" rounded variant="text" severity="warn" icon="pi pi-pencil" />
                <Button @click.stop="sendDelete(slotProps)" rounded variant="text" severity="danger"
                    icon="pi pi-trash" />
            </template>
        </Column>
        <!-- Column for the buttons -->

    </DataTable>
    <!-- <Button label="Chat" class="w-full mb-2" @click="goToDetail(model)" icon="pi pi-comments" />
        <Button @click="goToForm(model)" rounded variant="text" severity="warn" icon="pi pi-pencil" />
        <Button @click="sendDelete(model)" rounded variant="text" severity="danger" icon="pi pi-trash" /> -->
</template>



<style scoped>
/* Add any necessary styles here */
</style>