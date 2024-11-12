import { NextApiRequest, NextApiResponse } from "next";
import { User } from "~/types";
// import { User } from "~/types";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if(!req.body) {
        res.statusCode = 404
        res.end("Error")
        return
    }

    const { email, password, username, age, language, isCybersecurityProfessional } = req.body

    if(process.env.MOCK === "true") {
        // Mock response
        res.status(200).json({ username, email, age } as User)
        return
    }

    // Request to server
    const response = await fetch(`${process.env.SERVER_URL}/api/signup`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                username: email,
                name: username,
                password, 
                age, 
                language, 
                working_professional: isCybersecurityProfessional
            }
        )
    })
    if(response.status === 201) {
        const data = await response.json()
        console.log("here")
        res.status(response.status).json({ success: true, user: { email } })
        return
    }
    res.status(response.status).json({ success: false, message: "Invalid Credentials" })
}