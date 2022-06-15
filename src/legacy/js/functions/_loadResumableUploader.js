function loadResumableUploader(data) {
    const html = templates.resumableUploader(data);

    $('body').append(html);

    console.log("INFO: loadResumableUploader()")

    startResumableUploader("resumable-uploader-app", data);

}