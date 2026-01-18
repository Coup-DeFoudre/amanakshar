import { PageContainer } from '@/components/ui/PageContainer'
import { SectionSpacing } from '@/components/ui/SectionSpacing'
import { Divider } from '@/components/ui/Divider'
import { TextButton } from '@/components/ui/TextButton'
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import Link from 'next/link'

// Static data - will be managed from admin
const aboutData = {
  name: 'अमन अक्षर',
  title: 'कवि • मंच प्रस्तुतकर्ता',
  imageUrl: '/images/poet/aman-akshar-portrait.svg',
  signatureUrl: '/images/poet/signature.svg',
  
  biography: `मध्य प्रदेश के खंडवा जिले के छोटे से गाँव मुंदी में 13 जून 1991 को जन्म हुआ। पिताजी किसान थे, माँ ने घर सँभाला। गाँव की मिट्टी में पले-बढ़े, पर सपने हमेशा बड़े थे।

पढ़ाई में होशियार था, IIT से M.Tech किया। कैंपस प्लेसमेंट में लाखों का पैकेज मिला — वो नौकरी जो परिवार के सपनों की पूर्ति थी। लेकिन रातों को जब कलम उठाता था, तब लगता था कि असली ज़िंदगी यहाँ है, स्प्रेडशीट्स में नहीं।

एक दिन हिम्मत जुटाई और सब छोड़ दिया। परिवार ने पूछा — "क्या करोगे?" कहा — "कविता।" उस दिन से आज तक, बस यही किया है।`,

  journey: `पहला मंच गाँव का था। दस-बीस लोग बैठे थे। काँपते हाथों से कविता पढ़ी थी। आज याद करता हूँ तो हँसी आती है।

फिर धीरे-धीरे शहर के मंच मिले। इंदौर, भोपाल, दिल्ली। हर मंच ने कुछ सिखाया। कहीं तालियाँ मिलीं, कहीं सन्नाटा। दोनों से सीखा।

जब पहली बार लाल किले के मंच पर खड़ा हुआ — हज़ारों की भीड़, ऐतिहासिक दीवारें, और माइक्रोफ़ोन सामने — उस पल समझ आया कि वो नौकरी छोड़ना सही फ़ैसला था।

आज IITs, IIMs, NITs से लेकर देश के हर कोने में कविता पहुँची है। लेकिन वो गाँव का पहला मंच अभी भी याद है।`,

  philosophy: `मेरी कविता में नाटक नहीं है। मंच पर जो खड़ा होता है, वो कवि नहीं — एक इंसान है जो अपने दिल की बात कह रहा है।

लिखते समय सोचता हूँ — क्या यह सच है? क्या यह वही है जो मैं महसूस करता हूँ? अगर जवाब "हाँ" है, तभी कलम चलती है।

प्रेम, भक्ति, जीवन, दर्शन — ये चार धागे हैं जो मेरी हर कविता में गुँथे हैं। "भाव सिर्फ़ राम हैं" — यह सिर्फ़ गीत नहीं, यह मेरा विश्वास है।

कविता पढ़ते समय यह महसूस न हो कि स्क्रीन पर शब्द हैं। लगना चाहिए कि कोई सामने बैठकर बात कर रहा है।`,
}

export default function ParichayPage() {
  return (
    <main className="min-h-screen">
      <PageContainer>
        <SectionSpacing size="lg">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-bg-secondary mx-auto mb-6 flex items-center justify-center overflow-hidden ring-2 ring-accent-gold/20 ring-offset-4 ring-offset-bg-primary">
              {aboutData.imageUrl ? (
                <OptimizedImage
                  src={aboutData.imageUrl}
                  alt={aboutData.name}
                  width={160}
                  height={160}
                  objectFit="cover"
                  fallback="/images/placeholders/poet.svg"
                  className="w-full h-full"
                  sizes="(max-width: 640px) 128px, 160px"
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
            <p className="font-ui text-text-secondary text-lg mb-4">
              {aboutData.title}
            </p>
            
            {/* Signature */}
            {aboutData.signatureUrl && (
              <div className="mt-4 opacity-60 hover:opacity-100 transition-opacity">
                <img 
                  src={aboutData.signatureUrl} 
                  alt="अमन अक्षर हस्ताक्षर" 
                  className="h-10 w-auto mx-auto"
                />
              </div>
            )}
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
