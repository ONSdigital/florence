import React, { useEffect, useRef, useState } from 'react'
import Checkbox from '../../components/Checkbox'
import Input from '../../components/Input'

import FileUpload from '../../components/file-upload/FileUpload'

const UploadTest = () => {
  const fileUploadRef = useRef()
  const [progress, setProgress] = useState(null)
  const [filePathPrefix] = useState('/test-uploads')
  const [isUploading, setIsUploading] = useState(false)
  const [isPublishable, setIsPublishable] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    document.querySelectorAll('input[type="file"]').forEach((input) => {
      const r = new Resumable({
        target: "/upload-new",
        uploadMethod: "POST",
        chunkSize: 5 * 1024 * 1024,
        query: {},
        forceChunkSize: true,
        testChunks: false,
        simultaneousUploads: 1,
      })
      r.assignBrowse(input)
      r.assignDrop(input)
      r.on('fileAdded', (file) => {
        setIsUploading(true)
        r.opts.query['collectionId'] = 'test-collection'
        r.opts.query['isPublishable'] = isPublishable
        r.opts.query['licence'] = 'Open Government Licence v3.0'
        r.opts.query['licenceUrl'] =
          'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/'
        r.opts.query['path'] = `${filePathPrefix}/${file.fileName}`
        r.upload()
      })
      r.on('fileProgress', (file) => {
        setProgress(Math.round(Number(file.progress() * 100)))
      })
      r.on('fileError', () => {
        setError('An error occurred whilst uploading this file.')
        console.error('Error uploading file to server')
      })
      r.on('fileSuccess', (file) => {
        // http
        //   .get(`/upload-new/${file.uniqueIdentifier}`)
        //   .then(() => {
        //       setProgress(null)
        //   })
        //   .catch((error) => {
        //       console.error(error)
        //   })
      })
    })
  }, [isPublishable])

  const handleRetryClick = (event) => {
    console.log(event)
  }

  return (
    <main>
      <div className="grid grid--justify-space-around">
        <div className="grid__col-10 margin-top--2">
          <h1>Test upload page</h1>
          <div className="grid__col-10">
            <Checkbox
              id="file-is-publishable"
              onChange={() => setIsPublishable(!isPublishable)}
              isChecked={isPublishable}
              disable={isUploading}
              label="File publishable?"
            />
            <FileUpload
              ref={fileUploadRef}
              label="Upload file"
              type="file"
              id="generic-upload"
              key="generic-uploader"
              error={error || null}
              accept="*"
              onRetry={handleRetryClick}
              progress={progress >= 0 ? progress : null}
            />
          </div>
        </div>
      </div>
    </main>
  )
}

export default UploadTest
