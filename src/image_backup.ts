import axios from 'axios'
import {promises as fs} from 'fs'


const BASE_URL = 'https://sg.storage.bunnycdn.com'

const visit = async (path: string) => {
  const res = await axios.get(`${BASE_URL}/${path}`, {
      headers: {
        Accept: '*/*',
        AccessKey: '0b17b3e3-6da6-40e3-8a574487998c-287f-443b'
      }
    })

  for (const item of res.data) {
    const {Path: path, IsDirectory: isDirecotry} = item
    if (isDirecotry) {
      await visit(path)
    } else {
      await fs.writeFile(path, res.data)
    }
  }

  console.log(res.data)
}

visit("/onefly/notes/")

