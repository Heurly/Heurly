"use server"

import B2 from 'backblaze-b2';


async function sendData() {
    console.log(process.env.BUCKET_APP_KEY, process.env.BUCKET_KEY_ID)
    const b2 = new B2({
        applicationKeyId: process.env.BUCKET_KEY_ID ?? "",
        applicationKey: process.env.BUCKET_APP_KEY ?? ""
    });

    try {
        // Authorize with Backblaze B2
        await b2.authorize();
        console.log('Authorized with Backblaze B2');

        // Get upload URL and authorization token
        // const res = await b2.getUploadUrl({
        //     bucketId: process.env.BUCKET_ID ?? ""
        // });
        // console.log(res)
        // console.log('Upload URL:', uploadUrl);
        // console.log('Authorization Token:', authorizationToken);

        // // Upload file using the obtained URL and token
        // const response = await b2.uploadFile({
        //     uploadUrl: uploadUrl,
        //     uploadAuthToken: authorizationToken,
        //     fileName: 'test.txt',
        //     data: Buffer.from('Hello, World!'),
        //     onUploadProgress: (event) => {
        //         console.log('Progress:', event);
        //     }
        // });
        // console.log('File uploaded successfully:', response.data);
    } catch (error) {
        console.error('Error:', error);
    }
}

export { sendData }
