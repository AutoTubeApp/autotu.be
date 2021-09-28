/*
    Related to videos
 */

import express from 'express'
// import { ApiResponse } from '~/api/classes/ApiResponse'

export const getVideoMetaFromManifest = async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // const response = new ApiResponse()

  const { manifest } = req.body
  console.log(manifest)
  res.status(200).send()
}
