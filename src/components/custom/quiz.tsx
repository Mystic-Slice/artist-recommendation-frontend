"use client"

import { useState, useEffect } from 'react'
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Label } from "~/components/ui/label"
import { Loader2 } from "lucide-react"
import { apiReq } from '~/utils'
import ClipLoader from 'react-spinners/ClipLoader'

interface Question {
  question: string
  options: string[]
  answer: number
}

export default function QuizComponent({ presentationId }: { presentationId: string }) {
  const [question, setQuestion] = useState<Question | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuestion()
  }, [])

  const fetchQuestion = async () => {
      setLoading(true)
      // Replace this URL with your actual API endpoint
      const res = await apiReq('getQuestion', { presentationId })
      if(!res.success) {
        console.error(res.error);
        alert('Failed to fetch question');
        return;
      }
      setQuestion(res.quiz)
      setLoading(false)
  }

  const clearState = () => {
    setQuestion(null)
    setSelectedAnswer(null)
    setScore(null)
    fetchQuestion()
  }

  const handleAnswerSelection = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleSubmit = () => {
    if (question && selectedAnswer !== null) {
      setScore(selectedAnswer === question.answer ? 1 : 0)
    }
  }

  if (loading) {
    return (
      <ClipLoader size={20}/>
    )
  }

  if (score !== null) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {score === 1 ? "Correct!" : "Incorrect!"}
          </p>
            {score === 0 ? `The correct answer was: `: null}
            <br/>
            {score === 0 ? `${question?.options[question.answer]}` : null}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={clearState}>Try Again</Button>
        </CardFooter>
      </Card>
    )
  }

  if (!question) return null

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Quiz Question</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{question.question}</p>
        <RadioGroup
          value={selectedAnswer?.toString()}
          onValueChange={(value) => handleAnswerSelection(parseInt(value))}
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmit} disabled={selectedAnswer === null}>
          Submit
        </Button>
      </CardFooter>
    </Card>
  )
}