import { BotMessageSquare, Send } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "~/components/ui/input"
import { apiReq } from "~/utils";
import ClipLoader from "react-spinners/ClipLoader";

export default function ChatBox( { presentationId }: { presentationId: string }) {
    const [prompt, setPrompt] = useState('')
    const [output, setOutput] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        if(!prompt) return;

        setLoading(true);
        const res = await apiReq("askQuestion", { presentationId, prompt });
        if(!res.success) {
          console.error(res.error);
          alert('Failed to fetch content');
          return;
        }
        setOutput(res.answer);
        setLoading(false);
    }
    
    const handleKeyPress = useCallback((e: { key: string }) => {
    if (e.key === 'Enter') {
        handleSubmit()
    }
    }, [handleSubmit])

    return (
        <div className="flex flex-col w-full items-center justify-center">
            <div className="flex gap-2 mt-4 mb-4 shadow-md bg-white p-4 rounded-lg">
              <Input
                type="text"
                placeholder="Ask clarifying questions..."
                value={prompt}
                onKeyDown={handleKeyPress}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSubmit}>
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
            <div className="flex flex-col gap-2 mt-4 w-[500px] mb-10 text-justify">
              {output}
            </div>
        </div>
    )
}