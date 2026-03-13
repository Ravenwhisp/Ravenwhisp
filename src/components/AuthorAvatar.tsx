import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { withBasePath } from '@/lib/paths'

interface AuthorMetadataProps {
  author: string
  avatarUrl?: string
}

export const AuthorMetadata = ({ author, avatarUrl }: AuthorMetadataProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <Avatar className='size-11.5'>
      <AvatarImage src={avatarUrl ? withBasePath(avatarUrl) : undefined} alt={author} />
      <AvatarFallback className='text-xs'>{getInitials(author)}</AvatarFallback>
    </Avatar>
  )
}
