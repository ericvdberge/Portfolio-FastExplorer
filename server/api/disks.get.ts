import * as drivelist from 'drivelist';

export default defineEventHandler(async (event: any) => {
    const drives = await drivelist.list();
    return drives
      .map(drive => {
        return {
          path: drive.mountpoints[0].path,
          size: drive.size,
          removable: drive.isRemovable
        }
      })
      .sort((disk1: any, disk2: any) => sort(disk1, disk2, "removable"))
})

const sort = (disk1: any, disk2: any, property: string) => {
  if(!disk1[property] && disk2[property]) {
    return -1
  }
  if(disk1[property] && !disk2[property]) {
    return 1
  }
  return 0
}