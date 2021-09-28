/*
    Related to videos
 */

import express from 'express'
import validator from 'validator'
import axios from 'axios'
import { ApiResponse } from '../classes/ApiResponse'

// Checks if mpd exists
// Returns video meta by loading remote meta.json (if exists)
export const getVideoMetaFromManifest = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const response = new ApiResponse()

  let { manifest } = req.body

  // https://v.autotube.app/DC6FirstLanding/dash.mpd
  // ECONNREFUSED
  // manifest = 'v.autotube.app/DC6FirstLanding/dash.mpd'
  manifest = 'https://v.autotube.app/DC6FirstLandingo/dash.mpd'

  // validate is URL && extension is .mpd
  if (!validator.isURL(manifest)) {
    console.log('nor an URL')
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
  const r = await axios.get(manifest)
  // todo check r
  console.log(r.status)

  res.status(200).send()
}
