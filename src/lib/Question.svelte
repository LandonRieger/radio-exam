<script lang="ts">
    interface Question {
        id: string;
        answer: string;
        question: string;
        options: string[];
    }

    import { Card, Button, Radio, Alert, Star } from "flowbite-svelte";
    import { onMount } from "svelte";
    import { fade, slide } from "svelte/transition";
    import { StarSolid, StarOutline } from "flowbite-svelte-icons";

    export let questions: Question[];
    export let randomize: boolean = true;
    export let flaggedOnly: boolean = false;
    // export let update;
    let flaggedQuestions: string[] = [];

    let idx: number;
    if (randomize) {
        idx = Math.floor(Math.random() * questions.length);
    } else {
        idx = 0;
    }
    let options: string[] = [];
    let correct: number = 0;
    let wrong: number = 0;
    let total: number = 0;
    let percent: number = 0;
    let answer: string | undefined;
    let answered: boolean = false;
    let response: boolean | undefined;
    let unused_options = Array.from(Array(questions.length).keys());
    let filtered_unused: number[] = [];
    // let previous_options: string[] = []
    // let previous_question: number
    let opt_id: number = unused_options[idx];
    let flagged: boolean = false;

    $: {
        response = answer ? answer === questions[opt_id].answer : undefined;
        if (!answered && answer) {
            answered = true;
            if (response) {
                correct++;
            } else {
                wrong++;
            }
            total = correct + wrong;
            percent = (correct / total) * 100;
        }
    }

    function generate() {
        answer = undefined;
        answered = false;
        response = undefined;

        // previous_question = opt_id
        // previous_options = options

        if (flaggedOnly) {
            filtered_unused = unused_options.filter((i) => flaggedQuestions.includes(questions[i].id));
        } else {
            filtered_unused = [...unused_options];
        }

        if (randomize) {
            // return a random element from our list
            idx = Math.floor(Math.random() * filtered_unused.length);
            opt_id = filtered_unused[idx];
        } else {
            // return the next element in our list
            opt_id = filtered_unused[0];
        }

        if (opt_id < questions.length) {
            console.log("setting opt id: ", opt_id);
            options = shuffle(questions[opt_id].options);

            // once shown remove the question from the bank
            unused_options = unused_options.filter((x) => x != opt_id);
            flagged = flaggedQuestions.includes(questions[opt_id].id);
        }
    }

    function shuffle(array: string[]) {
        let arrayCopy = [...array];
        for (let i = arrayCopy.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
            [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
        }
        return arrayCopy;
    }

    function flagQuestion() {
        // toggle the flag on the current question
        if (!flagged) {
            flaggedQuestions.push(questions[opt_id].id);
            document.cookie = `flaggedQuestions=${JSON.stringify(flaggedQuestions)}`;
            flagged = true;
        } else {
            flaggedQuestions = flaggedQuestions.filter((x) => x != questions[opt_id].id);
            document.cookie = `flaggedQuestions=${JSON.stringify(flaggedQuestions)}`;
            flagged = false;
        }
    }

    onMount(() => {
        const cookieValue = document.cookie
            .split("; ")
            .find((row) => row.startsWith("flaggedQuestions="))
            ?.split("=")[1];

        if (cookieValue) {
            flaggedQuestions = JSON.parse(cookieValue);
        } else {
            document.cookie = "flaggedQuestions=[]";
        }
        generate();
    });
</script>

<div class="max-w-2xl mx-auto">
    <Card size="lg" class="rounded-sm relative">
        {#if opt_id < questions.length}
            <div class="absolute top-0 right-0 focus:ring-0">
                {#if flagged}
                    <StarSolid class="h-6 w-6 p-1 text-yellow-400" on:click={flagQuestion} />
                {:else}
                    <StarOutline class="h-6 w-6 p-1" on:click={flagQuestion} />
                {/if}
            </div>

            <p class="font-medium text-xl text-gray-800 dark:text-gray-100 pb-4">
                {questions[opt_id].question}
            </p>

            <ul
                class="dark:bg-gray-800 dark:border-gray-600 divide-y divide-gray-200 dark:divide-gray-600">
                {#each options as option, index}
                    <li>
                        <Radio class="p-3 text-base" bind:group={answer} value={option}>{option}</Radio>
                    </li>
                {/each}
            </ul>

            {#if response !== undefined}
                <div transition:slide>
                    <Alert color={response ? "green" : "red"} class="font-medium">
                        {response ? "Correct" : "Wrong"}
                    </Alert>
                </div>
            {/if}

            <div class="flex pt-4 justify-between items-center">
                <div class="flex font-bold text-xl">
                    <div>
                        {correct} / {total}
                        <span
                            class={percent >= 70 ? (percent >= 80 ? "text-green-500" : "text-yellow-400") : "text-red-600"}
                            >({total > 0 ? Number(percent).toFixed(0) : "-"} %)</span>
                    </div>
                </div>
                <p class="text-xs text-gray-500 justify-self-end">
                    {questions[opt_id].id}
                </p>
                <div>
                    {#if answered}
                        <Button color="green" class="rounded-sm focus:ring-0" on:click={generate}>Next</Button>
                    {:else}
                        <Button color="green" class="rounded-sm focus:ring-0" on:click={generate} disabled>Next</Button>
                    {/if}
                </div>
            </div>
        {:else}
            <div class="text-center py-8">
                <p class="font-bold text-lg text-gray-800 dark:text-gray-100">End of Questions</p>
            </div>
        {/if}
    </Card>
</div>
