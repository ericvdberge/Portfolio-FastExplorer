import * as fs from 'fs';

export default defineEventHandler(async (event) => {
    const { diskName } = await readBody(event)
    const files = await readFiles(diskName)
    return files
})

const readFiles = async (directory) => {
    return new Promise((resolve, reject) => {
      let driveInfo = [] 
      fs.readdir(directory, (err, files) => {
        if (err) {
          reject(err)
        }

        driveInfo = files
          .filter(file => !file.includes('$'))
          .map( file => {
            try {
              return {
                path: file,
                isDirectory: !file.includes('.')
              }
            }
            catch {
              return {
                path: file,
                isDirectory: null
              }
            }
          })
        resolve(driveInfo)
      });
    })
}