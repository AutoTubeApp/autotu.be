/*
    Handlers related to videos
 */

import express from 'express'
import validator from 'validator'
import axios from 'axios'
import { decode } from 'js-base64'

import logger from '../logger'
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
  // eslint-disable-next-line import/no-named-as-default-member
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
  try {
    await axios.get(manifest)
  } catch (e:any) {
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
  const remoteRootPath: string = manifest.split('/').slice(0, -1).join('/')
  // try to fetch meta.json and return meta to client
  // on error return {}
  try {
    const r = await axios.get(`${remoteRootPath}/meta.json`)
    res.status(200).json(r.data)
  } catch (e:any) {
    if (e.response?.status === 404) {
      res.status(200).json({})
    } else {
      next(e)
    }
  }
}

// return video manifest from same hosts (CORS)
// duplicate code to fix
export const getProxyfiedManifest = async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
  let manifest = req.query.u
  if (typeof manifest !== 'string') {
    logger.error(`${req.ip}: hdl getProxyfiedManifest: u is not a string: ${manifest}`)
    res.status(400).send()
    return
  }
  manifest = manifest as string

  // decode base64
  // if manifest is not a base64 encoded string, error will be caught later
  manifest = decode(manifest)

  // https://v.autotube.app/DC6FirstLanding/dash.mpd
  // ECONNREFUSED
  // manifest = 'v.autotube.app/DC6FirstLanding/dash.mpd'
  // manifest = 'https://v.autotube.app/dc6-first-landing/dash.mp'

  // validate is URL && extension is .mpd
  // eslint-disable-next-line import/no-named-as-default-member
  if (!validator.isURL(manifest)) {
    logger.error(`${req.ip}: hdl getProxyfiedManifest: u is not an url: ${manifest}`)
    res.status(400).send()
    return
  }

  if (manifest.split('.')?.pop()?.toLowerCase() !== 'mpd') {
    logger.error(`${req.ip}: hdl getProxyfiedManifest: u extension is not mdp: ${manifest}`)
    res.status(400).send()
    return
  }

  // load mpd file
  let body: string = ''
  try {
    const r = await axios.get(manifest)
    // console.log(r)
    body = r.data
  } catch (e:any) {
    // 404 not found
    if (e.response.status === 404) {
      logger.error(`${req.ip}: hdl getProxyfiedManifest: u not found on remote: ${manifest}`)
      res.status(404).send()
    } else {
      logger.error(`${req.ip}: hdl getProxyfiedManifest: u remote return ${e.response.status} error : ${manifest}`)
      res.status(e.response.status).send()
    }
    return
  }
  res.setHeader('Content-Type', 'application/dash+xml')
  res.status(200).send(body)
}
