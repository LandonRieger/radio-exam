<script lang="ts">
    import Question from "$lib/Question.svelte";
    import { Toggle, Select, Label, Modal, Button } from "flowbite-svelte";
    import { ChartOutline } from "flowbite-svelte-icons";
    import { onMount } from "svelte";

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
        // console.log(data.basic[0].id.split('-')[1])
        // console.log(selected)
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

        console.log("stats cookie", cookieValue);
        if (cookieValue == undefined) {
            console.log("creating stats cookie");
            stats = {};
            for (let i = 0; i < 9; i++) {
                stats[String(i).padStart(3, 0)] = { answered: 0, correct: 0 };
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
                <Toggle color="red" class="mt-2" bind:checked={randomize}></Toggle>
            </Label>
        </div>
        <div>
            <Label
                >Bookmarked
                <Toggle color="red" class="mt-2" bind:checked={flaggedOnly}></Toggle>
            </Label>
        </div>
        <div class="flex-grow">
            <Label>
                Select a category
                <Select class="mt-2" items={categories} bind:value={selected} />
            </Label>
        </div>
        <div class="self-end">
            <ChartOutline strokeWidth="1.5" class="h-11 w-11 text-gray-500" on:click={() => (defaultModal = true)} />
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

<Modal
    title="Terms of Service"
    bind:open={defaultModal}
    autoclose
    outsideclose
    backdropClass="fixed inset-0 z-40 bg-gray-100 dark:bg-gray-900 bg-opacity-95 dark:bg-opacity-80">
    <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
        With less than a month to go before the European Union enacts new consumer privacy laws for its citizens,
        companies around the world are updating their terms of service agreements to comply.
    </p>
    <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
        The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to
        ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as
        possible of high-risk data breaches that could personally affect them.
    </p>
</Modal>
