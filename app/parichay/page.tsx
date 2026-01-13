import { PageContainer } from '@/components/ui/PageContainer'
import { SectionSpacing } from '@/components/ui/SectionSpacing'
import { Divider } from '@/components/ui/Divider'
import { TextButton } from '@/components/ui/TextButton'
import Link from 'next/link'

// Static data - will be managed from admin
const aboutData = {
  name: 'अमन अक्षर',
  title: 'कवि',
  imageUrl: undefined, // Will be added
  
  biography: `अमन अक्षर — इंदौर, मध्य प्रदेश के एक कवि जो शब्दों को मंच तक ले जाते हैं।

जन्म 13 जून 1991 को हुआ। शिक्षा में M.Tech की डिग्री हासिल की, लेकिन दिल हमेशा कविताओं में ही बसा रहा।

कविता मेरे लिए सिर्फ़ शब्द नहीं है — यह जीने का तरीका है। जो बातें कहीं नहीं कही जा सकतीं, वो कविता में उतर आती हैं।`,

  journey: `कवि-सम्मेलनों की शुरुआत छोटे मंचों से हुई। धीरे-धीरे आज तक, ज़ी न्यूज़ जैसे राष्ट्रीय मंचों तक पहुँचे।

हर प्रस्तुति में एक ही लक्ष्य — श्रोताओं के दिल तक पहुँचना। शब्दों को इस तरह कहना कि वो सुने नहीं जाएँ, महसूस किए जाएँ।

पिछले कई वर्षों में सैकड़ों कवि-सम्मेलनों में प्रस्तुति दी है। हर मंच ने कुछ सिखाया, हर श्रोता ने कुछ दिया।`,

  philosophy: `मेरी कविता में कोई नाटक नहीं है। जो महसूस होता है, वही लिखता हूँ। जो लिखता हूँ, वही कहता हूँ।

कविता पढ़ते समय यह महसूस न हो कि यह डिजिटल है — यही मेरा मानना है। शब्दों में वो गर्माहट होनी चाहिए जो हाथ से लिखी कविता में होती है।

प्रेम, भक्ति, जीवन, दर्शन — ये चार स्तंभ हैं मेरी कविताओं के। हर कविता इन्हीं भावों से जन्म लेती है।`,
}

export default function ParichayPage() {
  return (
    <main className="min-h-screen">
      <PageContainer>
        <SectionSpacing size="lg">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-bg-secondary mx-auto mb-6 flex items-center justify-center overflow-hidden">
              {aboutData.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={aboutData.imageUrl} 
                  alt={aboutData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-heading text-3xl text-text-muted">
                  अ
                </span>
              )}
            </div>
            
            <h1 className="font-heading text-4xl sm:text-5xl text-text-primary mb-2">
              {aboutData.name}
            </h1>
            <p className="font-ui text-text-secondary text-lg">
              {aboutData.title}
            </p>
          </header>
          
          <Divider />
          
          {/* Biography */}
          <section className="mb-12">
            <h2 className="font-heading text-2xl text-text-primary mb-6 text-center">
              परिचय
            </h2>
            <div className="font-poem text-text-secondary leading-relaxed text-lg whitespace-pre-line max-w-xl mx-auto">
              {aboutData.biography}
            </div>
          </section>
          
          <Divider />
          
          {/* Journey */}
          <section className="mb-12">
            <h2 className="font-heading text-2xl text-text-primary mb-6 text-center">
              मंच का सफर
            </h2>
            <div className="font-poem text-text-secondary leading-relaxed text-lg whitespace-pre-line max-w-xl mx-auto">
              {aboutData.journey}
            </div>
          </section>
          
          <Divider />
          
          {/* Philosophy */}
          <section className="mb-12">
            <h2 className="font-heading text-2xl text-text-primary mb-6 text-center">
              दृष्टिकोण
            </h2>
            <div className="font-poem text-text-secondary leading-relaxed text-lg whitespace-pre-line max-w-xl mx-auto">
              {aboutData.philosophy}
            </div>
          </section>
          
          <Divider />
          
          {/* CTA */}
          <div className="text-center space-y-4">
            <p className="font-ui text-text-muted">
              कवि-सम्मेलन के लिए आमंत्रित करें
            </p>
            <Link href="/sampark">
              <TextButton icon="→" iconPosition="right">
                संपर्क करें
              </TextButton>
            </Link>
          </div>
        </SectionSpacing>
      </PageContainer>
    </main>
  )
}

export const metadata = {
  title: 'परिचय — अमन अक्षर',
  description: 'अमन अक्षर के बारे में — कवि, मंच प्रस्तुतकर्ता, और शब्दों का साधक।',
}

