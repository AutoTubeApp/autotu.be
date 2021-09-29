/*
    Handlers related to videos
 */

import express from 'express'
import validator from 'validator'
import axios, { AxiosResponse } from 'axios'

import { ApiResponse } from '../classes/ApiResponse'

// Checks if mpd exists
// Returns video meta by loading remote meta.json (if exists)
export const getVideoMetaFromManifest = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const response = new ApiResponse()

  const { manifest } = req.body

  // https://v.autotube.app/DC6FirstLanding/dash.mpd
  // ECONNREFUSED
  // manifest = 'v.autotube.app/DC6FirstLanding/dash.mpd'
  // manifest = 'https://v.autotube.app/DC6FirstLandingo/dash.mpd'

  // validate is URL && extension is .mpd
  if (!validator.isURL(manifest)) {
    res.locals.response = response.setResponse(400, 'URL is not valid', 1,
      `getVideoMetaFromManifest failed: bad URL for manifest: ${manifest}`)
    next()
    return
  }

  if (manifest.split('.')?.pop()?.toLowerCase() !== 'mpd') {
    res.locals.response = response.setResponse(400, 'URL is not valid, extension must be .mpd', 1,
      `getVideoMetaFromManifest failed: bad URL for manifest, not mpd: ${manifest}`)
    next()
    return
  }

  // load mpd file
  let r: AxiosResponse
  try {
    r = await axios.get(manifest)
  } catch (e) {
    // 404 not found
    if (e.response.status === 404) {
      res.locals.response = response.setResponse(400, 'Remote server reply with a "Not Found" error (404). Check your URL.', 1,
        `getVideoMetaFromManifest failed: get 404 from remote server: ${manifest}`)
    } else {
      res.locals.response = response.setResponse(400, `Remote server reply with a error ${e.reponse.statusText}. Check your URL.`, 1,
        `getVideoMetaFromManifest failed: get ${e.reponse.status} - ${e.response.statusText} from remote server: ${manifest}`)
    }
    next()
    return
  }

  // OK manifest exists
  // get root path
  console.log(r)

  res.status(200).send()
}
