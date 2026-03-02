import React from 'react'
import { Button } from '../ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ArrowRight, FolderIcon } from 'lucide-react'

function MyProjects() {
  return (
    <div className='mx-32 mt-20'>
      <div className='flex justify-between items-center'>
        <h2 className="font-bold text-2xl">My Projects</h2>
        <Button>+ Create New Project</Button>
      </div>
      <div>
         <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderIcon />
        </EmptyMedia>
        <EmptyTitle>No Projects Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any projects yet. Get started by creating
          your first project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button>Create Project</Button>
        {/* <Button variant="outline">Import Project</Button> */}
      </EmptyContent>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <a href="#">
          Learn More <ArrowRight />
        </a>
      </Button>
    </Empty>
      </div>
    </div>
  )
}

export default MyProjects
