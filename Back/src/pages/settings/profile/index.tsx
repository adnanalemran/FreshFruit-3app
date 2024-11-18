import ProfileForm from './profile-form'
import ContentSection from '../components/content-section'

export default function SettingsProfile() {
  return (
    <ContentSection
      title='Profile'
      desc=' Manage your account settings and set e-mail preferences.'
    >
      <ProfileForm />
    </ContentSection>
  )
}
