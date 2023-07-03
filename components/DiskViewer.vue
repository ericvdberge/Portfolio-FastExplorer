<template>
    <div class="container">
        <div class="header">
            {{ selectedPath }}
        </div>
        <div class="main">
            <div class="sidebar">
                <p class="sidebar-subtitle">Disks</p>
                <p class="disk" v-for="disk in disks" @click="() => readDir(disk.name, 0)">
                    <Icon name="material-symbols:folder" color="#afafaf"/>
                    {{ disk.name }}
                </p>
            </div>
            <div class="column" v-for="(folder, index) in folders" :key="index">
                <p v-for="file in folder" @click="() => { if(file.isDirectory) readDir(file.path, index + 1) }">
                    {{ file.path }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
/**
 * Prefetch disks
 */
const { data: disks } = await useFetch('/api/disks')
let folders = ref([])
let selectedPath = ref([])

/**
 * fetch folder files when clicked on folder
 * @param {*} folderName - the folder name you want to fetch files from 
 */
const readDir = async (folderName, columnIndex) => {
    //want to make more steps back then 1
    //reset length to the appropiate column
    if(folders.value.length - columnIndex > 1) { 
       folders.value.length = columnIndex + 1
       selectedPath.value.length = columnIndex + 1
    }

    selectedPath.value[columnIndex] = folderName
    const { data: files } = await useFetch('/api/folder', {
        method: 'POST',
        body: {
            "diskName": selectedPath.value.join('\\')
        }
    })
    
    //only if the folder contains files, create a new row
    if(files.value.length > 0) 
        folders.value[columnIndex] = files.value
    
}
</script>

<style lang="scss">
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

$background-color: #eeeeee;
$foreground-color: #dddddd;
$border-color: #ccccccaf;
$title-color: #afafaf;


.container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.header {
    height: 60px;
}

.main {
    display: flex;
    background: #f1f1f1;
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    > div {
        min-width: 150px;
        padding: 20px;
        background: $background-color;
        border-right: 1px solid $border-color;
        overflow-y: scroll;
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
        &::-webkit-scrollbar {
            display: none;
        }
    }
    .sidebar {
        display: flex;
        flex-direction: column;
        gap: 10px;
        .sidebar-subtitle {
            // color: #afafaf;
            color: $title-color;
            font-weight: 400;
        }
        .disk {
            width: 100%;
            height: 30px;
            background: $foreground-color;
            line-height: 30px;
            padding: 0 10px;
            color: $title-color;
            cursor: pointer;
        }
    }
}
</style>