<template>
    <div>
        <div class="flex flex-row p-3 border-b-[1px] border-gray-500">
            <p class="basis-1/4">{{ selectedPath }}</p>
            <div class="basis-1/2">
                <UInput  icon="i-heroicons-magnifying-glass-20-solid" size="sm" color="white" :trailing="false" placeholder="Search..." />
            </div>
            <div class="basis-1/4"></div>
        </div>
        <div class="flex flex-row gap-4 h-[90vh] p-4">
            <div class="h-auto" v-for="(folder, index) in folders" :key="index">
                <UCard class="h-auto max-h-[90vh] overflow-y-scroll no-scrollbar">
                    <div class="flex flex-col gap-4">
                        <UTooltip :text="file.path" v-for="file in folder" @click="() => readDir(file, index + 1)">
                            <UButton :icon="file.isDirectory ? 'i-heroicons-folder' : 'i-heroicons-document'" class="px-5 py-1" color="white" variant="solid">
                                {{file.path.length > 20 ? `${file.path.slice(0, 10)}...` : file.path}}
                            </UButton>
                        </UTooltip>
                    </div>
                </UCard>
            </div>
            
        </div>
    </div>
</template>

<script setup>
/**
 * Prefetch disks
 */
const { data: disks } = await useFetch('/api/disks')
let folders = ref([disks.value])
let selectedFolders = ref([])
let selectedPath = computed(() => 
    selectedFolders.value.slice(1, selectedFolders.value.length).join('\\')
)

/**
 * fetch folder files when clicked on folder
 * @param {*} folderName - the folder name you want to fetch files from 
 */
const readDir = async (file, columnIndex) => {
    if(!file.isDirectory) return;

    //want to make more steps back then 1
    //reset length to the appropiate column
    if(folders.value.length - columnIndex > 1) { 
       folders.value.length = columnIndex + 1
       selectedFolders.value.length = columnIndex + 1
    }
    else {
        folders.value.length = columnIndex 
        selectedFolders.value.length = columnIndex
    }

    selectedFolders.value[columnIndex] = file.path
    const { data: files } = await useFetch('/api/folder', {
        method: 'POST',
        body: {
            "diskName": selectedPath
        }
    })
    
    //only if the folder contains files, create a new row
    if(files.value.length > 0) 
        folders.value[columnIndex] = files.value
    
}
</script>