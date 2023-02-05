<template>
    <h1>VMail Inbox</h1>

    <Suspense>
        <template #default>
            <MailTable />
        </template>
        <template #fallback>
            Loading...
        </template>
    </Suspense>
</template>

<script setup lang="ts">
import MailTable from "./components/MailTable.vue";
</script>
