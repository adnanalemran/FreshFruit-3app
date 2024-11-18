import { SignUpForm } from '@/pages/auth/components/sign-up-form'
import ContentSection from '../components/content-section'

const index = () => {
  return (
    <ContentSection
      title='Create Account'
      desc=' This account will allow you to access the console platform.'
    >
      <SignUpForm />
    </ContentSection>
  )
}

export default index
