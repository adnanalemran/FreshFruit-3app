import ContentSection from '../components/content-section'
import Currency from './Currency'

const Setup = () => {
  return (
    <div className='min-h-[100vh]  w-full'>
      <ContentSection
        title='Set Up'
        desc=' This Set up Change the settings of the app. Global settings.'
      > 
 
        <><Currency   /></> 
      </ContentSection>    
       
    </div>
  )
}

export default Setup
