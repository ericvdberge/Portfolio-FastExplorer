<template>
    <div class="container">
        <div class="header">
            <p>{{ selectedPath.join('\\') }}</p>
            <div class="search">
                <Icon name="carbon:search"/>
                <input />
            </div>
            <div></div>
        </div>
        <div class="main">
            <div class="sidebar">
                <p class="sidebar-subtitle">Disks</p>
                <p v-for="disk in disks" @click="() => readDir(disk, 0)"
                   :class="selectedPath.includes(disk.path) ? 'disk-item selected': 'disk-item'"
                >
                    <Icon class="icon" name="material-symbols:folder"/>
                    {{ disk.path }}
                </p>
            </div>
            <div class="column" v-for="(folder, index) in folders" :key="index">
                <div v-for="file in folder" @click="() => readDir(file, index + 1)"
                    :class="selectedPath.includes(file.path) ? 'disk-item selected': 'disk-item'"
                >
                    <Icon class="icon" v-if="file.isDirectory" name="material-symbols:folder"/>
                    <Icon class="icon" v-else name="ant-design:file-outlined" />
                    <p>{{ file.path.slice(0, 20) }}<span v-if="file.path.length > 20">...</span></p>
                </div>
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
const readDir = async (file, columnIndex) => {
    //want to make more steps back then 1
    //reset length to the appropiate column
    if(file.isDirectory && folders.value.length - columnIndex > 1) { 
       folders.value.length = columnIndex + 1
       selectedPath.value.length = columnIndex + 1
    }
    else {
        folders.value.length = columnIndex 
       selectedPath.value.length = columnIndex
    }

    selectedPath.value[columnIndex] = file.path
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
$background-selected-color: #3a9bdc;
$icon-selected-color: #1360cc;
$foreground-color: #dddddd;
$border-color: #ccccccaf;
$title-color: #afafaf;
$file-color: black;


.container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0px 50px;
    > *:not(.search) {
        width: 25vw;
    }
    .search {
        width: 50vw;
        height: 40px;
        border-radius: 10px;
        box-shadow: 0px 3px 3px #ccc;
        padding: 0 20px;
        input {
            width: 90%;
            height: 100%;
            border: none;
            outline: none;
            padding: 0 20px;
        }
    }
}

.main {
    display: flex;
    background: #f1f1f1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    > div {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 300px;
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
        .sidebar-subtitle {
            color: $title-color;
            font-weight: 400;
        }
    }

    .disk-item {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        height: 30px;
        background: $foreground-color;
        line-height: 30px;
        padding: 5px 20px;
        color: $file-color;
        cursor: pointer;
        border-radius: 4px;
        .icon {
            color: $title-color;
        }
    }

    .disk-item.selected {
        background: $background-selected-color;
        .icon {
            color: $icon-selected-color;
        }
    }
}
</style>