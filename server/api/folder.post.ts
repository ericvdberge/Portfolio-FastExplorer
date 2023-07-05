import * as fs from 'fs';

export default defineEventHandler(async (event: any) => {
    const { diskName } = await readBody(event)
    return await readFiles(diskName)
})

const readFiles = async (directory: string) => {
    return new Promise((resolve, reject) => {
      let driveInfo: any[] = [] 
      fs.readdir(directory, (err, files: string[]) => {
        if (err) {
          reject(err)
        }

        driveInfo = files
          .filter(file => !file.startsWith('$') && !file.startsWith('.'))
          .map(file => {
              return {
                path: file,
                isDirectory: !file.includes('.')
              }
            })

        resolve(driveInfo)
      })
    })
}