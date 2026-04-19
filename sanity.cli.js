import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'k92utnmx',
    dataset: 'production'
  },
  deployment: {
    appId: 'ib8mgtg3fbgfdkjknsnhsjcq',
    autoUpdates: true,
  }
})
