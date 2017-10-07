<template>
    <tr>
        <td>
            <select v-model="condition.field">
                <option value="tweet">Tweet</option>
                <option value="user">User</option>
                <option value="lang">Language</option>
            </select>
        </td>
        <td>
            <select v-model="condition.operator">
                <option value="equals">Equals</option>
                <option value="contains">Contains</option>
                <option value="regex">Regular Expression</option>
            </select>
        </td>

        <td>
            <input type="text"  v-model="condition.value">
        </td>
        <td>
            <button type="button" class="btn btn-link" v-on:click="$emit('remove', index)">Delete</button>
        </td>
    </tr>

</template>

<script>

export default {
    props: ['condition', 'index']
}
</script>

<style scoped>
</style>