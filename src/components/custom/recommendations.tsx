import { Book } from "lucide-react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { set } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { UserContext } from "~/contexts/UserProvider";
import { apiReq } from "~/utils";

interface Recommendation {
    title: string;
    description: string;
}

const Recommendations = () => {
    const {user} = useContext(UserContext);
    const router = useRouter();

    const [recos, setRecos] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(false);
    const fetchRecommendations = async () => {
        if(!user) return;

        setLoading(true);
        const res = await apiReq('recommendations', {user});
        if (!res.success) {
            console.error('Failed to fetch recommendations');
            setRecos([]);
            return;
        }
        setRecos(res.data);
        setLoading(false);
    }
    useEffect(() => {
        fetchRecommendations();
    }, []);

    const handleSubmit = async (prompt: string) => {
        const res = await apiReq("genContent", { user, prompt });
        if(!res.success) {
          console.error(res.error);
          alert('Failed to fetch content');
          return;
        }
        console.log(res);
        router.push(`/learn/${res.presentationId}`);
    }

    return <div style={{ height: '40vh' }}>
        <div className="bg-white rounded-lg shadow-md p-4 flex-shrink-0 items-center">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Book className="w-5 h-5" />
            Recommended For You
            </h2>
            <div className="flex justify-between gap-4 overflow-hidden">
                
            {
                loading ?  
                    <div className="flex justify-center items-center w-full">
                        <ClipLoader size={50}/> 
                    </div> 
                : recos.map((rec, index) => (
                    <Card key={index} className="flex-1 flex flex-col" onClick={() => handleSubmit(rec.title)}>
                    <CardHeader className="p-4">
                        <CardTitle className="text-sm">{rec.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex-1 overflow-auto">
                        <CardDescription className="text-sm">{rec.description}</CardDescription>
                    </CardContent>
                    </Card>
                ))
            }
            </div>
        </div>
    </div>
}

export default Recommendations;