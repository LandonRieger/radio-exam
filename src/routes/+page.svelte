<script lang="ts">
    import Question from "$lib/Question.svelte";
    import { Toggle, Select, Label } from "flowbite-svelte";

    let advanced: boolean;
    let filtered_questions;
    let selected: string = '000'
    let randomize: boolean = true;
    let flaggedOnly: boolean = false;
    let categories = [
        {value: '000', name: 'All'},
        {value: '001', name: 'Regulations'},
        {value: '002', name: 'Operation'},
        {value: '003', name: 'Assembly and Safety'},
        {value: '004', name: 'Circuit Components'},
        {value: '005', name: 'Electronic Theory'},
        {value: '006', name: 'Antennas'},
        {value: '007', name: 'Propagation'},
        {value: '008', name: 'Interference'}
    ]
    $: {
        // console.log(data.basic[0].id.split('-')[1])
        // console.log(selected)
        if (selected === '000') {
            filtered_questions = data.basic
        } else {
            filtered_questions = data.basic.filter((x) => x.id.split('-')[1] === selected)
        }
    }
    export let data;
</script>

<div class="max-w-2xl mx-auto px-4 lg:px-0">
    <div class="py-8">
        <p class="text-3xl font-bold">Amateur Radio Exam</p>
    </div>

    <div class="flex flex-row my-4 justify-between items-start space-x-8">
        <div>
            <Label>Randomize
                <Toggle color="red" bind:checked={randomize}></Toggle>
            </Label>
        </div>
        <div>
            <Label>flagged only
                <Toggle color="red" bind:checked={flaggedOnly}></Toggle>
            </Label>
        </div>
        <div class="flex-grow">
            <Label>
                Select a category
                <Select class="mt-2" items={categories} bind:value={selected} />
            </Label>
        </div>
    </div>
    <!--    <div class="py-4">-->
    <!--    <Toggle bind:checked={advanced}>Advanced</Toggle>-->
    <!--    </div>-->
    {#key filtered_questions}
        {#if filtered_questions.length > 0}
            <Question questions={filtered_questions} randomize={randomize} flaggedOnly={flaggedOnly}/>
        {/if}
    {/key}
</div>