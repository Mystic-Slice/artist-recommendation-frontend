import React from 'react'

export default function Article({ title, content }: { title: string; content: string }) {
  return (
    <article className="prose lg:prose-xl mx-auto">
      <h2>{title}</h2>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  )
}