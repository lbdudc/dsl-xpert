<script setup>
</script>

<template>
    <div>
        <!-- Center in the middle of the screen -->
        <h1 class="text-4xl font-bold text-center my-8">
            About Us
        </h1>
        <section class="flex md:flex-row flex-col md:justify-center justify-start items-center md:gap-32 gap-8">

            <Card class="w-96">
                <template #header>
                    <img src="/victor_img.jpg" alt="Victor Lamas" />
                </template>
                <template #title>
                    <h1 class="text-2xl tracking-tight text-center font-bold">
                        Victor Lamas
                    </h1>
                </template>

                <template #subtitle>
                    <p class="text-sm ">
                        PhD Student in Computer Science
                    </p>
                    <p class="text-sm ">
                        Database Lab, University of A Coruña, Spain
                    </p>
                    <div class="flex flex-row items-center justify-center gap-2 text-2xl mt-4">
                        <a href="mailto:victor.lamas@udc.es" class="text-blue-500" target="_blank">
                            <i class="pi pi-envelope" style="font-size: 1.3rem"></i>
                        </a>
                        <a href="https://victorjlamas.github.io/" class="text-blue-500" target="_blank">
                            <i class=" pi pi-globe" style="font-size: 1.3rem"></i>
                        </a>
                    </div>
                </template>
                <template #content>
                    <p class="text-sm tracking-tight text-pretty min-h-[100px]">
                        Focused on the creation and advancement of variant-rich software systems, with a particular
                        focus on Geographic Information Systems.
                    </p>
                </template>
            </Card>
            <Card class="w-96">
                <template #header>
                    <img src="/daniel_img.png" alt="Daniel Garcia Gonzalez" />
                </template>
                <template #title>
                    <h1 class="text-2xl tracking-tight text-center font-bold">
                        Daniel Garcia-Gonzalez
                    </h1>
                </template>

                <template #subtitle>
                    <p class="text-sm">
                        PhD in Computer Science
                    </p>
                    <p class="text-sm">
                        Database Lab, University of A Coruña, Spain
                    </p>
                    <div class="flex flex-row items-center justify-center gap-2 text-2xl mt-4">
                        <a href="mailto:d.garcia2@udc.es" class="text-blue-500" target="_blank">
                            <i class="pi pi-envelope" style="font-size: 1.3rem"></i>
                        </a>
                        <a href="https://www.researchgate.net/profile/Daniel-Garcia-Gonzalez-2" target="_blank"
                            class="text-blue-500">
                            <i class=" pi pi-globe" style="font-size: 1.3rem"></i>
                        </a>
                    </div>
                </template>
                <template #content>
                    <p class="text-sm tracking-tight text-pretty min-h-[100px]">
                        Focused on the field of human activity recognition (HAR). My goal is to seek the application of
                        the techniques studied in recent years to a real-life environment, using machine learning, deep
                        learning and sensor data from smartphones.
                    </p>
                </template>
            </Card>
        </section>
    </div>
</template>