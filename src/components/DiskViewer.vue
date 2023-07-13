<template>
    <div>
        <!--==============================================-->
        <!-- Header-->
        <!--==============================================-->
        <div class="flex flex-row p-3 border-b-[1px] border-gray-500">
            <div class="basis-1/4 px-5">
                <img src="/logowhite.png" class=" h-[30px] object-contain text-align-"/>
            </div>
            <div class="basis-1/2">
                <UInput icon="i-heroicons-magnifying-glass-20-solid" size="sm" color="white" :trailing="false" placeholder="Search..." />
            </div>
        </div>
        <!--==============================================-->
        <!-- breadcrumb-->
        <!--==============================================-->
        <div class="flex p-4">
            <nav class="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg dark:border-gray-700" aria-label="Breadcrumb">
                <UButton @click="() => navigateBack()" icon="i-heroicons-chevron-left" color="white" variant="ghost"/>
                <UButton icon="i-heroicons-chevron-right" color="white" variant="ghost"/>
                <ol class="inline-flex items-center space-x-1 md:space-x-3">
                    <li class="inline-flex items-center" v-for="(file, i) in selectedFolders.slice(0, selectedFolders.length)" @click="() => navigateFromBreadcrumb(i)">
                        <a href="#" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                            <svg v-if="i == 1" class="w-3 h-3 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                            </svg>
                            <svg v-if="i > 1" class="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                            </svg>
                            {{file}}
                        </a>
                    </li>
                </ol>
            </nav>
        </div>
        <!--==============================================-->
        <!-- File system-->
        <!--==============================================-->
        <div class="flex flex-row gap-4 h-[80vh] p-4">
            <div class="h-auto" v-for="(folder, index) in folders" :key="index">
                <UCard class="h-auto max-h-[80vh] overflow-y-scroll no-scrollbar">
                    <div class="flex flex-col gap-4">
                        <UTooltip :text="file.path" v-for="file in folder" @click="() => readDir(file, index + 1)">
                                <UButton :icon="file.isDirectory ? 'i-heroicons-folder' : 'i-heroicons-document'" class="px-5 py-1" :color="selectedFolders.includes(file.path) ? 'primary' : 'white'" variant="solid">
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

const initSelected = folders.value[0][0].path
let selectedFolders = ref([])
let selectedPath = computed(() => 
    selectedFolders.value.slice(1, selectedFolders.value.length).join('\\')
)

const navigateBack = () => {
    if(selectedFolders.value.length - 2 < 1) return; //check if we can go back
    
    let file = {
        path: selectedFolders.value[selectedFolders.value.length - 2 ?? 0],
        isDirectory: true
    }
    readDir(file, selectedFolders.value.length - 2 ?? 0)
}

const navigateFromBreadcrumb = (i) => {
    let file = {
        path: selectedFolders.value[i],
        isDirectory: true
    }
    readDir(file, i)
}

/**
 * fetch folder files when clicked on folder
 * @param {*} folderName - the folder name you want to fetch files from 
 */
const readDir = async (file, columnIndex) => {
    if(!file.isDirectory || file.path == '') return;

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

let file = {
    path: initSelected,
    isDirectory: true
}
readDir(file, 1)
</script>