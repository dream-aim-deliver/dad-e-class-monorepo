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
          imageUrl: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3V0ZSUyMGNhdHxlbnwwfHwwfHx8MA%3D%3D',
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
          {
            title: 'Web Development Fundamentals',
            content: '[{"type":"paragraph","children":[{"text":"Learn the core technologies that power the modern web including HTML5, CSS3, and JavaScript.","highlight":true}]},{"type":"paragraph","children":[{"text":"This course covers responsive design principles, semantic markup, and cross-browser compatibility."}]}]',
            position: 1,
            iconImageUrl: '',
          },
          {
            title: 'Data Science & Analytics',
            content: '[{"type":"paragraph","children":[{"text":"Discover how to extract meaningful insights from complex datasets.","highlight":true}]},{"type":"paragraph","children":[{"text":"Use statistical methods, machine learning, and visualization techniques. Perfect for aspiring data scientists and analysts."}]}]',
            position: 2,
            iconImageUrl: '',
          },
          {
            title: 'Mobile App Development',
            content: '[{"type":"paragraph","children":[{"text":"Build native and cross-platform mobile applications for iOS and Android.","highlight":true}]},{"type":"paragraph","children":[{"text":"This comprehensive course covers UI/UX principles, API integration, and publishing to app stores."}]}]',
            position: 3,
            iconImageUrl: '',
          },
          {
            title: 'Cloud Computing & DevOps',
            content: '[{"type":"paragraph","children":[{"text":"Master cloud infrastructure and deployment pipelines.","highlight":true}]},{"type":"paragraph","children":[{"text":"Learn AWS, Azure, Google Cloud, containerization, CI/CD workflows, and infrastructure as code principles."}]}]',
            position: 4,
            iconImageUrl: '',
          },
          {
            title: 'Cybersecurity Essentials',
            content: '[{"type":"paragraph","children":[{"text":"Develop the skills to protect systems and networks from digital threats.","highlight":true}]},{"type":"paragraph","children":[{"text":"Topics include vulnerability assessment, encryption protocols, ethical hacking, and security compliance frameworks."}]}]',
            position: 5,
            iconImageUrl: '',
          }
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
          imageUrl: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3V0ZSUyMGNhdHxlbnwwfHwwfHx8MA%3D%3D',
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
          {
            title: 'Grundlagen der Webentwicklung',
            content: '[{"type":"paragraph","children":[{"text":"Lernen Sie die Kerntechnologien kennen, die das moderne Web antreiben, einschließlich HTML5, CSS3 und JavaScript.","highlight":true}]},{"type":"paragraph","children":[{"text":"Dieser Kurs behandelt responsive Design-Prinzipien, semantische Auszeichnungen und browserübergreifende Kompatibilität."}]}]',
            position: 1,
            iconImageUrl: '',
          },
          {
            title: 'Data Science & Analytik',
            content: '[{"type":"paragraph","children":[{"text":"Entdecken Sie, wie man aus komplexen Datensätzen aussagekräftige Erkenntnisse gewinnt.","highlight":true}]},{"type":"paragraph","children":[{"text":"Nutzen Sie statistische Methoden, maschinelles Lernen und Visualisierungstechniken. Perfekt für angehende Datenwissenschaftler und Analysten."}]}]',
            position: 2,
            iconImageUrl: '',
          },
          {
            title: 'Mobile App-Entwicklung',
            content: '[{"type":"paragraph","children":[{"text":"Entwickeln Sie native und plattformübergreifende mobile Anwendungen für iOS und Android.","highlight":true}]},{"type":"paragraph","children":[{"text":"Dieser umfassende Kurs behandelt UI/UX-Prinzipien, API-Integration und die Veröffentlichung in App-Stores."}]}]',
            position: 3,
            iconImageUrl: '',
          },
          {
            title: 'Cloud Computing & DevOps',
            content: '[{"type":"paragraph","children":[{"text":"Beherrschen Sie Cloud-Infrastruktur und Deployment-Pipelines.","highlight":true}]},{"type":"paragraph","children":[{"text":"Lernen Sie AWS, Azure, Google Cloud, Containerisierung, CI/CD-Workflows und Infrastructure-as-Code-Prinzipien kennen."}]}]',
            position: 4,
            iconImageUrl: '',
          },
          {
            title: 'Grundlagen der Cybersicherheit',
            content: '[{"type":"paragraph","children":[{"text":"Entwickeln Sie die Fähigkeiten, um Systeme und Netzwerke vor digitalen Bedrohungen zu schützen.","highlight":true}]},{"type":"paragraph","children":[{"text":"Zu den Themen gehören Schwachstellenbewertung, Verschlüsselungsprotokolle, ethisches Hacking und Frameworks für Sicherheitskonformität."}]}]',
            position: 5,
            iconImageUrl: '',
          }
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
