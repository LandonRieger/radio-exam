<!-- { filename: 'js/App.svelte' } -->
<script>
    import { LayerCake, Svg } from "layercake";
    import AxisX from "$lib/_components/AxisX.svelte";
    import AxisY from "$lib/_components/AxisY.svelte";
    import BarStacked from "$lib/_components/BarStacked.svelte";
    import { onMount } from "svelte";
    import { format, precisionFixed } from "d3-format";
    import { scaleBand, scaleOrdinal } from "d3-scale";

    // Define some data
    let stats;
    let statsSorted;

    $: totalAns = stats ? stats.reduce((n, { answered }) => n + answered, 0) : 0;
    $: totalCorr = stats ? stats.reduce((n, { correct }) => n + correct, 0) : 0;
    const formatTickX = (d) => format(`.${precisionFixed(d)}s`)(d);

    onMount(() => {
        const cookieValue = document.cookie
            .split("; ")
            .find((row) => row.startsWith("stats="))
            ?.split("=")[1];
        stats = JSON.parse(cookieValue);
        stats = stats.map((v) => ({ ...v, wrong: v.answered - v.correct, percent: (v.correct / v.answered) * 100 }));
        statsSorted = stats.toSorted((a, b) => (a.correct / a.answered) - (b.correct / b.answered));
        console.log('sorted', statsSorted)
    });
</script>

<div class="flex flex-row justify-between">
    <div></div>
    <div class="text-center text-gray-700 dark:text-gray-100">
        <p class="text-3xl font-medium">{totalAns}</p>
        <p class="text-xs">Answered</p>
    </div>
    <div class="text-center text-gray-700 dark:text-gray-100">
        <p class="text-3xl font-medium">{Number((totalCorr / totalAns) * 100).toFixed(0)}&#8202%</p>
        <p class="text-xs">Overall</p>
    </div>
    <div></div>
</div>

{#if statsSorted}
    <div class="chart-container">
        <LayerCake
            padding={{ top: 0, bottom: 20, left: 115 }}
            x={"percent"}
            y={"category"}
            yScale={scaleBand().paddingInner(0.05)}
            data={statsSorted}>
            <!-- Components go here -->
            <Svg>
                <AxisX baseline={false} snapTicks={true} />
                <AxisY gridlines={false} />
                <BarStacked />
            </Svg>
        </LayerCake>
    </div>
{/if}

<style>
    /*
    The wrapper div needs to have an explicit width and height in CSS.
    It can also be a flexbox child or CSS grid element.
    The point being it needs dimensions since the <LayerCake> element will
    expand to fill it.
  */
    .chart-container {
        width: 100%;
        height: 200px;
    }
</style>
