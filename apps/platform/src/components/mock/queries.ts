import { homePage, topic } from '@maany_shr/e-class-models';
import { TLocale } from '@maany_shr/e-class-translations';

export const getLogo = (): string => {
  return 'https://res.cloudinary.com/dowkwaxnn/image/upload/v1742810063/a_atmfwj.png';
}

export const getHomePage = (locale: TLocale): homePage.THomePage => {
  if (locale === 'en') {
    return {
      banner: {
        title: 'MarketMasters Academy',
        description: 'Elevate your marketing expertise with industry-leading courses and tools. Our platform combines cutting-edge strategies with practical applications, empowering professionals at every level to excel in today\'s dynamic digital landscape. Join thousands of successful marketers who have transformed their careers through our comprehensive learning ecosystem.',
        videoId: 'Eg3DPdKFxUjak00azanz8VpGV4uATNjwELeTpVIxM2tM',
        thumbnailUrl: 'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png'
      },
      carousel: [
        {
          title: 'Digital Marketing Fundamentals',
          description: 'Master the essential concepts and tools for successful digital marketing campaigns.',
          imageUrl: 'https://res.cloudinary.com/marketmasters/image/upload/v1742541100/digital-fundamentals.jpg',
          buttonText: 'Explore Course',
          buttonUrl: '/courses/digital-fundamentals'
        },
        {
          title: 'Content Strategy Masterclass',
          description: 'Learn how to create compelling content that drives engagement and conversions.',
          imageUrl: 'https://res.cloudinary.com/marketmasters/image/upload/v1742541101/content-strategy.jpg',
          buttonText: 'Start Learning',
          buttonUrl: '/courses/content-strategy'
        },
        {
          title: 'Data-Driven Marketing',
          description: 'Harness the power of analytics to optimize your marketing efforts.',
          imageUrl: 'https://res.cloudinary.com/marketmasters/image/upload/v1742541102/data-marketing.jpg',
          buttonText: 'View Details',
          buttonUrl: '/courses/data-marketing'
        },
        {
          title: 'Social Media Mastery',
          description: 'Build effective strategies for all major platforms and maximize your social presence.',
          imageUrl: 'https://res.cloudinary.com/marketmasters/image/upload/v1742541103/social-media.jpg',
          buttonText: 'Learn More',
          buttonUrl: '/courses/social-media'
        },
        {
          title: 'Brand Development Workshop',
          description: 'Create and nurture brands that resonate with your target audience.',
          imageUrl: 'https://res.cloudinary.com/marketmasters/image/upload/v1742541104/brand-workshop.jpg',
          buttonText: 'Register Now',
          buttonUrl: '/courses/brand-workshop'
        },
        {
          title: 'Advanced SEO Techniques',
          description: 'Stay ahead of algorithm changes and dominate search rankings.',
          imageUrl: 'https://res.cloudinary.com/marketmasters/image/upload/v1742541105/seo-advanced.jpg',
          buttonText: 'Enroll Today',
          buttonUrl: '/courses/seo-advanced'
        },
        {
          title: 'Email Marketing Excellence',
          description: 'Craft campaigns that boost open rates, conversions, and customer loyalty.',
          imageUrl: 'https://res.cloudinary.com/marketmasters/image/upload/v1742541106/email-marketing.jpg',
          buttonText: 'Get Started',
          buttonUrl: '/courses/email-marketing'
        }
      ],
      coachingOnDemand: {
        title: 'Expert Coaching On Demand',
        description: 'Connect with industry veterans for personalized guidance on your specific marketing challenges. Our coaches provide actionable insights tailored to your business goals and market conditions.',
        desktopImageUrl: 'https://res.cloudinary.com/marketmasters/image/upload/v1742541107/coaching-desktop.jpg',
        tabletImageUrl: 'https://res.cloudinary.com/marketmasters/image/upload/v1742541108/coaching-tablet.jpg',
        mobileImageUrl: 'https://res.cloudinary.com/marketmasters/image/upload/v1742541109/coaching-mobile.jpg'
      },
      accordion: {
        title: 'Explore Our Course Topics',
        showNumbers: true,
        items: [
        ]
      }
    };
  } else {
    return {
      banner: {
        title: 'MarketMasters Akademie',
        description: 'Erweitern Sie Ihre Marketing-Expertise mit branchenführenden Kursen und Tools. Unsere Plattform kombiniert modernste Strategien mit praktischen Anwendungen und befähigt Fachleute auf jeder Ebene, in der heutigen dynamischen digitalen Landschaft zu glänzen. Schließen Sie sich Tausenden erfolgreicher Vermarkter an, die ihre Karriere durch unser umfassendes Lernökosystem transformiert haben.',
        videoId: 'Eg3DPdKFxUjak00azanz8VpGV4uATNjwELeTpVIxM2tM',
        thumbnailUrl: 'https://res.cloudinary.com/dryynqhao/image/upload/v1742541099/lrpuzzgdayhoirs4gqgj.png'
      },
      carousel: [
        {
          title: 'Grundlagen des Digitalmarketings',
          description: 'Beherrschen Sie die wesentlichen Konzepte und Werkzeuge für erfolgreiche digitale Marketingkampagnen.',
          imageUrl: 'https://res.cloudinary.com/marketmasters/image/upload/v1742541100/digital-fundamentals.jpg',
          buttonText: 'Kurs erkunden',
          buttonUrl: '/kurse/digitalmarketing-grundlagen'
        },
        {
          title: 'Content-Strategie Meisterkurs',
          description: 'Lernen Sie, wie Sie überzeugende Inhalte erstellen, die Engagement und Conversions fördern.',
          imageUrl: 'https://res.cloudinary.com/marketmasters/image/upload/v1742541101/content-strategy.jpg',
          buttonText: 'Jetzt lernen',
          buttonUrl: '/kurse/content-strategie'
        },
        {
          title: 'Datengesteuertes Marketing',
          description: 'Nutzen Sie die Kraft der Analytik zur Optimierung Ihrer Marketingaktivitäten.',
          imageUrl: 'https://res.cloudinary.com/marketmasters/image/upload/v1742541102/data-marketing.jpg',
          buttonText: 'Details ansehen',
          buttonUrl: '/kurse/daten-marketing'
        },
        {
          title: 'Social Media Meisterschaft',
          description: 'Entwickeln Sie effektive Strategien für alle wichtigen Plattformen und maximieren Sie Ihre Social-Media-Präsenz.',
          imageUrl: 'https://res.cloudinary.com/marketmasters/image/upload/v1742541103/social-media.jpg',
          buttonText: 'Mehr erfahren',
          buttonUrl: '/kurse/social-media'
        },
        {
          title: 'Markenentwicklungs-Workshop',
          description: 'Erstellen und pflegen Sie Marken, die bei Ihrer Zielgruppe Anklang finden.',
          imageUrl: 'https://res.cloudinary.com/marketmasters/image/upload/v1742541104/brand-workshop.jpg',
          buttonText: 'Jetzt anmelden',
          buttonUrl: '/kurse/marken-workshop'
        },
        {
          title: 'Fortgeschrittene SEO-Techniken',
          description: 'Bleiben Sie Algorithmus-Änderungen einen Schritt voraus und dominieren Sie die Suchrankings.',
          imageUrl: 'https://res.cloudinary.com/marketmasters/image/upload/v1742541105/seo-advanced.jpg',
          buttonText: 'Heute einschreiben',
          buttonUrl: '/kurse/seo-fortgeschritten'
        },
        {
          title: 'Email-Marketing Exzellenz',
          description: 'Erstellen Sie Kampagnen, die Öffnungsraten, Conversions und Kundentreue steigern.',
          imageUrl: 'https://res.cloudinary.com/marketmasters/image/upload/v1742541106/email-marketing.jpg',
          buttonText: 'Loslegen',
          buttonUrl: '/kurse/email-marketing'
        }
      ],
      coachingOnDemand: {
        title: 'Experten-Coaching auf Abruf',
        description: 'Verbinden Sie sich mit Branchenveteranen für personalisierte Beratung zu Ihren spezifischen Marketing-Herausforderungen. Unsere Coaches bieten umsetzbare Erkenntnisse, die auf Ihre Geschäftsziele und Marktbedingungen zugeschnitten sind.',
        desktopImageUrl: 'https://res.cloudinary.com/marketmasters/image/upload/v1742541107/coaching-desktop.jpg',
        tabletImageUrl: 'https://res.cloudinary.com/marketmasters/image/upload/v1742541108/coaching-tablet.jpg',
        mobileImageUrl: 'https://res.cloudinary.com/marketmasters/image/upload/v1742541109/coaching-mobile.jpg'
      },
      accordion: {
        title: 'Entdecken Sie unsere Kursthemen',
        showNumbers: true,
        items: [
        ]
      }
    };
  }
};

export const listTopics = (locale: TLocale): topic.TTopic[] => {
  if (locale === 'en') {
    return [
      {
        name: 'Branding'
      },
      {
        name: 'Graphic Design'
      },
      {
        name: 'Digital Marketing'
      },
      {
        name: 'Social Media'
      },
      {
        name: 'Content Strategy'
      },
      {
        name: 'SEO & SEM'
      },
      {
        name: 'Email Marketing'
      },
      {
        name: 'Video Production'
      },
      {
        name: 'Analytics & Data'
      },
      {
        name: 'Conversion Optimization'
      },
      {
        name: 'Mobile Marketing'
      },
      {
        name: 'Influencer Marketing'
      },
      {
        name: 'Marketing Automation'
      },
      {
        name: 'B2B Marketing'
      }
    ];
  } else if (locale === 'de') {
    return [
      {
        name: 'Markenbildung'
      },
      {
        name: 'Grafikdesign'
      },
      {
        name: 'Digitales Marketing'
      },
      {
        name: 'Social Media'
      },
      {
        name: 'Content-Strategie'
      },
      {
        name: 'SEO & SEM'
      },
      {
        name: 'E-Mail-Marketing'
      },
      {
        name: 'Videoproduktion'
      },
      {
        name: 'Analytik & Daten'
      },
      {
        name: 'Conversion-Optimierung'
      },
      {
        name: 'Mobile Marketing'
      },
      {
        name: 'Influencer-Marketing'
      },
      {
        name: 'Marketing-Automatisierung'
      },
      {
        name: 'B2B-Marketing'
      }
    ];
  } else {
    // Default fallback to English
    return [
      {
        name: 'Branding'
      },
      {
        name: 'Graphic Design'
      }
      // Add other English topics if needed for fallback
    ];
  }
};
