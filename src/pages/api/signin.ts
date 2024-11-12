import { NextApiRequest, NextApiResponse } from "next";
// import { User } from "~/types";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if(!req.body) {
        res.statusCode = 404
        res.end("Error")
        return
    }

    const { email, password } = req.body

    if(process.env.MOCK === "true") {
        console.log(process.env.MOCK)
        console.log("here")
        // Mock response
        if(email === "123" && password === "123") {
            res.status(200).json({ 
                success: true, 
                message: "Login successful",
                user: {
                    username: "123",
                    email: "123@gmail.com",
                    age: 25,
                }
            })
        } else if (email === "456" && password === "456") {
            res.status(200).json({ 
                success: true, 
                message: "Login successful",
                user: {
                    username: "456",
                    email: "456@gmail.com",
                    age: 50,
                }
            })
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" })
        }
        return
    }

    // Request to server
    const response = await fetch(`${process.env.SERVER_URL}/api/login`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: email, password})
    })

    if(response.status === 200) {
        const data = await response.json()
        res.status(response.status).json({ success: true, user: { email } })
        return
    }
    res.status(response.status).json({ success: false, message: "Invalid Credentials" })
}