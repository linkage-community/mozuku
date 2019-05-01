import * as React from 'react'

import { Post } from '../models'

export default ({ post }: { post: Post }) => (<div>@{post.author.screenName} {post.text}</div>)
