// pages/api/upload.js
import formidable from 'formidable';
import { mkdir, readFile, stat } from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next';
import { join } from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: 'Error parsing form data' })
      }
  
      const file = (files.file as any)[0];
      const type = fields.type as any as string
      const email = fields.email as any as string

      const formData = new FormData();
      const fileBuffer = await readFile(file.filepath);
      const blob = new Blob([fileBuffer]);
      formData.append('file', blob, file.originalFilename || "");
      formData.append('return_type', type);
      formData.append('text', "");
      formData.append('user_id', email);

      console.log("Hello")

      for (var key of formData.entries()) {
        console.log(key[0] + ', ' + key[1]);
    }
  
      const response = await fetch(`${process.env.SERVER_URL}/upload`, {
            method: "POST",
            body: formData,
        })
        const data = await response.json()
    console.log("Response", data);
  
  
      res.status(200).json(data)
    })
}