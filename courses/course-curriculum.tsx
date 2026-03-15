"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { PlayCircle, FileText, Lock, Clock } from "lucide-react"

const curriculum: any[] = []

export function CourseCurriculum() {
  const totalLessons = curriculum.reduce((acc, section) => acc + section.lessons.length, 0)
  const totalDuration = "52h 30m"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Course Curriculum</CardTitle>
          <span className="text-sm text-muted-foreground">
            {curriculum.length} sections • {totalLessons} lessons • {totalDuration}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {curriculum.length > 0 ? (
          <Accordion type="multiple" className="w-full">
            {curriculum.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <span className="font-medium text-left">{section.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {section.lessons.length} lessons • {section.duration}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-1">
                    {section.lessons.map((lesson: any, index: number) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          {lesson.type === "video" ? (
                            <PlayCircle className="h-4 w-4 text-muted-foreground" />
                          ) : lesson.type === "quiz" ? (
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <FileText className="h-4 w-4 text-primary" />
                          )}
                          <span className="text-sm">{lesson.title}</span>
                          {lesson.free && (
                            <span className="text-xs text-primary font-medium">Preview</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {lesson.duration}
                          </span>
                          {!lesson.free && (
                            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="p-8 text-center text-muted-foreground italic bg-muted/30 rounded-lg">
            No curriculum items added yet.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
