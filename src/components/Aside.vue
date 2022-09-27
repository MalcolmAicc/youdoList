<template>
  <aside class='task-details'>
        <chart :doneLength="props.doneLength" />
        <Calenter/>
    </aside>
</template>

<script setup>
import chart from '@/components/chart.vue'
import Calenter from '@/components/Calenter.vue'
import {defineProps,watch} from 'vue'

const props = defineProps(['doneLength'])


</script>

<style  scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
}

body {
    color: var(--text);
}


/* @media only screen and (max-width: 1300px) {
    .project {
        max-width: 100%;
    }

    .task-details {
        width: 100%;
        display: flex;
    }

    .tag-progress,
    .task-activity {
        flex-basis: 50%;
        background: #fff;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem;
    }
}

@media only screen and (max-width: 1000px) {

    .project-column:nth-child(2),
    .project-column:nth-child(3) {
        display: none;
    }

    .project-tasks {
        grid-template-columns: 1fr 1fr;
    }
}



@media only screen and (max-width: 600px) {
    .project-column:nth-child(4) {
        display: none;
    }

    .project-tasks {
        grid-template-columns: 1fr;
    }

    .task-details {
        flex-wrap: wrap;
        padding: 3rem 1rem;
    }

    .tag-progress,
    .task-activity {
        flex-basis: 100%;
    }

    h1 {
        font-size: 25px;
    }
} */
</style>