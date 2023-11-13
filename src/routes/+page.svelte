<script lang="ts">
    import Question from "$lib/Question.svelte";
    import Statistics from "$lib/Statistics.svelte";
    import { Toggle, Select, Label, Modal, Button } from "flowbite-svelte";
    import { ChartOutline } from "flowbite-svelte-icons";
    import { onMount } from "svelte";
    import { slide, fade } from "svelte/transition";

    let filtered_questions;
    let selected: string = "000";
    let randomize: boolean = true;
    let flaggedOnly: boolean = false;
    let defaultModal: boolean = false;
    let categories = [
        { value: "000", name: "All" },
        { value: "001", name: "Regulations" },
        { value: "002", name: "Operation" },
        { value: "003", name: "Assembly and Safety" },
        { value: "004", name: "Circuit Components" },
        { value: "005", name: "Electronic Theory" },
        { value: "006", name: "Antennas" },
        { value: "007", name: "Propagation" },
        { value: "008", name: "Interference" },
    ];
    $: {
        if (selected === "000") {
            filtered_questions = data.basic;
        } else {
            filtered_questions = data.basic.filter((x) => x.id.split("-")[1] === selected);
        }
    }
    export let data;
    let stats;

    onMount(() => {
        const cookieValue = document.cookie
            .split("; ")
            .find((row) => row.startsWith("stats="))
            ?.split("=")[1];

        if (cookieValue == undefined) {
            stats = [];
            for (let i = 1; i < 9; i++) {
                stats.push({
                    value: String(i).padStart(3, 0),
                    answered: 0,
                    correct: 0,
                    category: categories.filter((x) => x.value === String(i).padStart(3, 0))[0].name,
                });
            }
            document.cookie = `stats=${JSON.stringify(stats)}`;
        }
    });
</script>

<div class="max-w-2xl mx-auto px-4 pb-12 md:px-0">
    <div class="py-8">
        <p class="text-3xl font-bold text-gray-800 dark:text-gray-100">Amateur Radio Exam</p>
    </div>

    <div class="flex mb-4 justify-between items-start space-x-4 sm:space-x-8 h-18">
        <div>
            <Label
                >Randomize
                <Toggle color="green" class="mt-2" bind:checked={randomize}></Toggle>
            </Label>
        </div>
        <div>
            <Label
                >Bookmarked
                <Toggle color="green" class="mt-2" bind:checked={flaggedOnly}></Toggle>
            </Label>
        </div>
        <div class="flex-grow">
            <Label>
                Select a category
                <Select
                    class="mt-2"
                    defaultClass={"text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"}
                    items={categories}
                    bind:value={selected} />
            </Label>
        </div>
        <div class="self-end">
            <button on:click={() => (defaultModal = true)}>
                <svg width="30" height="40">
                    <g transform="scale(1 -1) translate(0, -40)">
                        <rect width="9" height="40" x="0" class="fill-green-500" />
                        <rect width="9" height="25" x="10" class="fill-green-400" />
                        <rect width="9" height="12" x="20" class="fill-green-300" />
                    </g>
                </svg>
            </button>
            <!--            <ChartOutline strokeWidth="1.0" class="h-11 w-11 text-gray-500" on:click={() => (defaultModal = true)} />-->
        </div>
    </div>

    {#key flaggedOnly}
        {#key randomize}
            {#key filtered_questions}
                {#if filtered_questions.length > 0}
                    <Question questions={filtered_questions} {randomize} {flaggedOnly} />
                {/if}
            {/key}
        {/key}
    {/key}
</div>

{#if defaultModal}
    <div transition:fade={{ duration: 250 }}>
        <Modal
            title="Stats"
            bind:open={defaultModal}
            autoclose
            outsideclose
            backdropClass="fixed inset-0 z-40 bg-gray-100 dark:bg-gray-900 bg-opacity-95 dark:bg-opacity-80">
            <!--            <div transition:slide={{ duration: 250, delay: 1000 }}>-->
            <Statistics />
            <!--            </div>-->
        </Modal>
    </div>
{/if}
