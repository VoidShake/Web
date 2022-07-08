import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import theme from '../../../themes/dark'

export default NextAuth({
   secret: process.env.JWT_SECRET,
   providers: [
      GitHub({
         clientId: process.env.GITHUB_ID,
         clientSecret: process.env.GITHUB_SECRET,
      }),
   ],
   theme: {
      colorScheme: 'dark',
      brandColor: theme.primary,
   },
})
