/**
* This configuration file lets you run `$ sanity [command]` in this folder
* Go to https://www.sanity.io/docs/cli to learn more.
**/
import { defineCliConfig } from 'sanity/cli'
import { publicEnv } from './lib/env'

const projectId = publicEnv.sanityProjectId
const dataset = publicEnv.sanityDataset

export default defineCliConfig({ api: { projectId, dataset } })
