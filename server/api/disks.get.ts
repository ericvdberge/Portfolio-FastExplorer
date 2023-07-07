import * as drivelist from 'drivelist';

const sort = (disk1: any, disk2: any, property: string) => {
  if(!disk1[property] && disk2[property]) {
    return -1
  }
  if(disk1[property] && !disk2[property]) {
    return 1
  }
  return 0
}

export default defineEventHandler((event: any) => {
  return new Promise(async (resolve, reject) => {
    const drives = await drivelist.list();
    resolve(drives
      .sort((disk1: any, disk2: any) => sort(disk1, disk2, "isRemovable"))
      .map(drive => {
        return {
          path: drive.mountpoints[0].path,
          // size: drive.size,
          isDirectory: true
        }
      })
    )
  })
})

