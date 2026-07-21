export interface FaqItem {
  id: string;
  question: { en: string; am: string };
  answer: { en: string; am: string };
}

export interface FaqCategory {
  id: string;
  title: { en: string; am: string };
  description: { en: string; am: string };
  items: FaqItem[];
}

export const guestFaqs: FaqCategory = {
  id: "guests",
  title: {
    en: "For Guests",
    am: "ለእንግዶች"
  },
  description: {
    en: "Everything you need to know about finding and booking your perfect stay in Ethiopia.",
    am: "በኢትዮጵያ ውስጥ ተስማሚ ቤትዎን ስለማግኘት እና ስለመያዝ ማወቅ ያለብዎት ነገር ሁሉ።"
  },
  items: [
    {
      id: "g1",
      question: {
        en: "How do I search for a property?",
        am: "ንብረት እንዴት መፈለግ እችላለሁ?"
      },
      answer: {
        en: "Use the home page to browse listings. Filter by location and number of guests. Click any property card to see full details.",
        am: "ቤቶችን ለማየት ዋናውን ገጽ ይጠቀሙ። በአካባቢ እና በእንግዶች ብዛት ያጣሩ። ሙሉ ዝርዝሩን ለማየት ማንኛውንም የቤት ካርድ ጠቅ ያድርጉ።"
      }
    },
    {
      id: "g2",
      question: {
        en: "Do I need an account to browse?",
        am: "ቤቶችን ለማየት መለያ ያስፈልገኛል?"
      },
      answer: {
        en: "No, anyone can browse properties without signing in. You only need an account to send inquiries to hosts.",
        am: "አያስፈልግም፣ ማንኛውም ሰው ሳይገባ ቤቶችን ማየት ይችላል። ለአስተናጋጆች ጥያቄ ለመላክ ብቻ መለያ ያስፈልግዎታል።"
      }
    },
    {
      id: "g3",
      question: {
        en: "How do I send an inquiry to a host?",
        am: "ለአስተናጋጅ ጥያቄ እንዴት መላክ እችላለሁ?"
      },
      answer: {
        en: "Go to the property detail page, select your check-in/out dates and number of guests, write a message, and click \"Send Inquiry.\" You must be signed in.",
        am: "ወደ ቤቱ ዝርዝር ገጽ ይሂዱ፣ የመግቢያ እና መውጫ ቀናትን እንዲሁም የእንግዳ ብዛትን ይምረጡ፣ መልእክት ይፃፉ እና \"ጥያቄ ይላኩ\" የሚለውን ጠቅ ያድርጉ። ይህን ለማድረግ መግባት አለብዎት።"
      }
    },
    {
      id: "g4",
      question: {
        en: "What should I include in my inquiry?",
        am: "በጥያቄዬ ውስጥ ምን ማካተት አለብኝ?"
      },
      answer: {
        en: "Include your travel dates, number of guests, purpose of your visit, and any special needs (e.g. early check-in, parking needs, dietary requirements).",
        am: "የጉዞዎን ቀናት፣ የእንግዶችን ብዛት፣ የጉብኝትዎን ዓላማ እና ማንኛውንም ልዩ ፍላጎቶች (ለምሳሌ፡ ቀድሞ መግባት፣ የመኪና ማቆሚያ፣ የምግብ ፍላጎቶች) ያካትቱ።"
      }
    },
    {
      id: "g5",
      question: {
        en: "How do I check my inquiry status?",
        am: "የጥያቄዬን ሁኔታ እንዴት ማረጋገጥ እችላለሁ?"
      },
      answer: {
        en: "Go to your Dashboard and click \"My Trips.\" Each inquiry shows its status: Pending (host hasn't responded) or Replied (host has responded). You can view messages for each inquiry.",
        am: "ወደ ዳሽቦርድዎ ይሂዱ እና \"ጉዞዎቼ\" የሚለውን ጠቅ ያድርጉ። እያንዳንዱ ጥያቄ ሁኔታውን ያሳያል፡ በመጠባበቅ ላይ (አስተናጋጁ አልመለሰም) ወይም ተመልሷል (አስተናጋጁ መልሷል)። ለእያንዳንዱ ጥያቄ መልዕክቶችን ማየት ይችላሉ።"
      }
    },
    {
      id: "g6",
      question: {
        en: "What is the cancellation policy?",
        am: "የስረዛ ፖሊሲው ምንድን ነው?"
      },
      answer: {
        en: "Cancellation policies vary by host. Common tiers are Flexible (free cancellation 24 hours before check-in), Moderate (3 days), and Strict (7 days). Check the host's policy before booking.",
        am: "የስረዛ ፖሊሲዎች እንደ አስተናጋጁ ይለያያሉ። የተለመዱት ደረጃዎች ተለዋዋጭ (ከመግባትዎ 24 ሰዓት በፊት ነፃ ስረዛ)፣ መካከለኛ (3 ቀናት) እና ጥብቅ (7 ቀናት) ናቸው። ከመያዝዎ በፊት የአስተናጋጁን ፖሊሲ ያረጋግጡ።"
      }
    },
    {
      id: "g7",
      question: {
        en: "How does check-in/check-out work?",
        am: "የመግቢያ/መውጫ ሂደት እንዴት ነው የሚሰራው?"
      },
      answer: {
        en: "The host will provide check-in instructions after confirming your booking. Typical check-in is 2-4 PM and checkout is 10-11 AM. Follow the host's specific instructions.",
        am: "ቦታ ማስያዝዎን ካረጋገጡ በኋላ አስተናጋጁ የመግቢያ መመሪያዎችን ይሰጣል። የተለመደው የመግቢያ ሰዓት ከቀኑ 8-10 ሰዓት (2-4 PM) እና መውጫ ከጠዋቱ 4-5 ሰዓት (10-11 AM) ነው። የአስተናጋጁን የተወሰኑ መመሪያዎች ይከተሉ።"
      }
    },
    {
      id: "g8",
      question: {
        en: "What if something goes wrong during my stay?",
        am: "በቆይታዬ ወቅት ችግር ቢፈጠርስ?"
      },
      answer: {
        en: "Contact your host immediately through EthioStay's messaging system. Document any issues with photos. If the host is unresponsive, contact EthioStay support.",
        am: "በኢትዮስቴይ (EthioStay) የመልእክት ስርዓት በኩል አስተናጋጅዎን ወዲያውኑ ያነጋግሩ። ማንኛውንም ችግር በፎቶዎች ያስመዝግቡ። አስተናጋጁ ምላሽ የማይሰጥ ከሆነ፣ የኢትዮስቴይ ድጋፍን ያነጋግሩ።"
      }
    },
    {
      id: "g9",
      question: {
        en: "What if I damage the property?",
        am: "ንብረቱን ብጎዳው ምን ይሆናል?"
      },
      answer: {
        en: "Inform the host immediately and work toward a fair resolution. Under Ethiopian Civil Code Article 2970, guests may be liable for fire damage unless caused by force majeure. Document everything.",
        am: "ለአስተናጋጁ ወዲያውኑ ያሳውቁ እና ፍትሃዊ መፍትሄ ለማግኘት ይሞክሩ። በኢትዮጵያ የፍትሐ ብሔር ሕግ አንቀጽ 2970 መሠረት፣ ከአቅም በላይ በሆነ ምክንያት ካልሆነ በስተቀር እንግዶች ለእሳት አደጋ ተጠያቂ ሊሆኑ ይችላሉ። ሁሉንም ነገር በሰነድ ያስቀምጡ።"
      }
    },
    {
      id: "g10",
      question: {
        en: "How are prices displayed?",
        am: "ዋጋዎች እንዴት ነው የሚታዩት?"
      },
      answer: {
        en: "All prices are listed in Ethiopian Birr (ETB) per night. The total cost depends on the number of nights you stay. Some hosts may charge additional fees (cleaning fee, extra guests) — these should be disclosed in the listing.",
        am: "ሁሉም ዋጋዎች በኢትዮጵያ ብር (ETB) በአንድ ሌሊት ተዘርዝረዋል። አጠቃላይ ወጪው በሚያድሩበት የቀናት ብዛት ላይ የተመሠረተ ነው። አንዳንድ አስተናጋጆች ተጨማሪ ክፍያዎችን (የጽዳት ክፍያ፣ ተጨማሪ እንግዶች) ሊያስከፍሉ ይችላሉ — እነዚህ በማስታወቂያው ውስጥ መገለጽ አለባቸው።"
      }
    },
    {
      id: "g11",
      question: {
        en: "Is my personal information safe?",
        am: "የግል መረጃዬ ደህንነቱ የተጠበቀ ነው?"
      },
      answer: {
        en: "Yes. EthioStay is committed to protecting your personal data in accordance with Ethiopia's Personal Data Protection Proclamation No. 1321/2024. See our Privacy Policy for details.",
        am: "አዎ። ኢትዮስቴይ በኢትዮጵያ የግል መረጃ ጥበቃ አዋጅ ቁጥር 1321/2016 መሠረት የእርስዎን የግል መረጃ ለመጠበቅ ቁርጠኛ ነው። ለተጨማሪ ዝርዝሮች የግላዊነት መመሪያችንን ይመልከቱ።"
      }
    },
    {
      id: "g12",
      question: {
        en: "How do I communicate with my host?",
        am: "ከአስተናጋጄ ጋር እንዴት መገናኘት እችላለሁ?"
      },
      answer: {
        en: "Use the messaging system within EthioStay. Go to your Dashboard → My Trips → click on an inquiry to view and send messages. Keep all communication on the platform for your protection.",
        am: "በኢትዮስቴይ ውስጥ ያለውን የመልእክት ስርዓት ይጠቀሙ። ወደ ዳሽቦርድዎ ይሂዱ → ጉዞዎቼ → መልዕክቶችን ለማየት እና ለመላክ በጥያቄ ላይ ጠቅ ያድርጉ። ለደህንነትዎ ሲባል ሁሉንም ግንኙነቶች በመድረኩ ላይ ብቻ ያድርጉ።"
      }
    }
  ]
};

export const hostFaqs: FaqCategory = {
  id: "hosts",
  title: {
    en: "For Hosts",
    am: "ለአስተናጋጆች"
  },
  description: {
    en: "Learn how to manage your listings, set rules, and provide a great experience for your guests.",
    am: "ማስታወቂያዎችዎን እንዴት እንደሚያስተዳድሩ፣ ህጎችን እንደሚያወጡ እና ለእንግዶችዎ ጥሩ ተሞክሮ እንዴት እንደሚሰጡ ይወቁ።"
  },
  items: [
    {
      id: "h1",
      question: {
        en: "How do I list my property?",
        am: "ቤቴን እንዴት ማከራየት እችላለሁ?"
      },
      answer: {
        en: "Sign in, go to your Dashboard, and click \"Add New Listing.\" Fill in the property details: title, description, location, price per night, bedrooms, bathrooms, max guests, amenities, and photos. Click Save to publish.",
        am: "ይግቡ፣ ወደ ዳሽቦርድዎ ይሂዱ እና \"አዲስ ማስታወቂያ ያክሉ\" የሚለውን ጠቅ ያድርጉ። የቤቱን ዝርዝር መረጃ ይሙሉ፡ ርዕስ፣ መግለጫ፣ ቦታ፣ የአንድ ሌሊት ዋጋ፣ መኝታ ቤቶች፣ መታጠቢያ ቤቶች፣ የእንግዶች ብዛት፣ አገልግሎቶች እና ፎቶዎች። ለማውጣት \"ያስቀምጡ\"ን ጠቅ ያድርጉ።"
      }
    },
    {
      id: "h2",
      question: {
        en: "How should I price my listing?",
        am: "ለማስታወቂያዬ ዋጋ እንዴት ማውጣት አለብኝ?"
      },
      answer: {
        en: "Research comparable properties in your area. Consider factors like location, amenities, season, and property size. Prices are in Ethiopian Birr (ETB) per night. Start competitive and adjust based on demand.",
        am: "በአካባቢዎ ያሉ ተመሳሳይ ቤቶችን ዋጋ ያጥኑ። እንደ ቦታ፣ አገልግሎቶች፣ ወቅት እና የቤቱ መጠን ያሉትን ነገሮች ግምት ውስጥ ያስገቡ። ዋጋዎች በኢትዮጵያ ብር (ETB) በአንድ ሌሊት ናቸው። ተወዳዳሪ በሆነ ዋጋ ይጀምሩ እና እንደ ፍላጎቱ ያስተካክሉ።"
      }
    },
    {
      id: "h3",
      question: {
        en: "How do I manage availability?",
        am: "የመገኘት ሁኔታን እንዴት ማስተዳደር እችላለሁ?"
      },
      answer: {
        en: "Use the Calendar feature accessible from your Dashboard. Click the calendar icon on any listing to view and manage availability. Drag to select dates to block, and click blocked dates to unblock them.",
        am: "ከዳሽቦርድዎ የሚገኘውን የቀን መቁጠሪያ ባህሪ ይጠቀሙ። የመገኘት ሁኔታን ለማየት እና ለማስተዳደር በማንኛውም ማስታወቂያ ላይ ያለውን የቀን መቁጠሪያ ምልክት ጠቅ ያድርጉ። ቀናትን ለማገድ ይጎትቱ፣ እና የታገዱ ቀናትን ለመክፈት በእነሱ ላይ ጠቅ ያድርጉ።"
      }
    },
    {
      id: "h4",
      question: {
        en: "How do I respond to inquiries?",
        am: "ለጥያቄዎች እንዴት ምላሽ መስጠት እችላለሁ?"
      },
      answer: {
        en: "Go to your Dashboard and check \"Received Inquiries\" on each listing. Click to view the guest's message, dates, and guest count. Reply with a message to move the status from Pending to Replied.",
        am: "ወደ ዳሽቦርድዎ ይሂዱ እና በእያንዳንዱ ማስታወቂያ ላይ \"የደረሱ ጥያቄዎች\"ን ያረጋግጡ። የእንግዳውን መልእክት፣ ቀናትን እና የእንግዳ ብዛትን ለማየት ጠቅ ያድርጉ። ሁኔታውን \"በመጠባበቅ ላይ\" ከሚለው ወደ \"ተመልሷል\" ለመቀየር መልእክት ይላኩ።"
      }
    },
    {
      id: "h5",
      question: {
        en: "What house rules should I set?",
        am: "ምን ዓይነት የቤት ህጎችን ማውጣት አለብኝ?"
      },
      answer: {
        en: "Common rules include: quiet hours (e.g. 10 PM - 7 AM), no smoking indoors, no parties/events, pet policy, maximum occupancy, check-in/out times, parking instructions, and waste disposal guidelines. Be clear and reasonable.",
        am: "የተለመዱ ህጎች የሚያካትቱት፡ የፀጥታ ሰዓታት (ለምሳሌ፡ ከምሽቱ 4 ሰዓት - ጠዋት 1 ሰዓት)፣ በቤት ውስጥ አለማጨስ، ድግስ አለማድረግ፣ የቤት እንስሳት ፖሊሲ፣ ከፍተኛ የእንግዶች ብዛት፣ የመግቢያ/መውጫ ሰዓታት፣ የመኪና ማቆሚያ መመሪያዎች እና የቆሻሻ አወጋገድ ናቸው። ግልጽ እና ምክንያታዊ ይሁኑ።"
      }
    },
    {
      id: "h6",
      question: {
        en: "How should I handle cleaning?",
        am: "የጽዳት ጉዳይን እንዴት ማስተናገድ አለብኝ?"
      },
      answer: {
        en: "Clean and sanitize thoroughly between each guest. Provide fresh linens, towels, and basic toiletries. Consider adding a cleaning fee to your listing price. Follow a cleaning checklist to ensure consistency.",
        am: "በእያንዳንዱ እንግዳ መካከል ቤቱን በደንብ ያጽዱ እና ፀረ-ተህዋሲያን ይጠቀሙ። አዳዲስ አንሶላዎችን፣ ፎጣዎችን እና መሰረታዊ የንጽህና መጠበቂያዎችን ያቅርቡ። በማስታወቂያዎ ዋጋ ላይ የጽዳት ክፍያ መጨመርን ያስቡበት። ወጥ የሆነ ጽዳት ለማድረግ የጽዳት ማረጋገጫ ዝርዝርን ይከተሉ።"
      }
    },
    {
      id: "h7",
      question: {
        en: "What are my tax obligations?",
        am: "የግብር ግዴታዎቼ ምንድን ናቸው?"
      },
      answer: {
        en: "Under Ethiopian Income Tax Proclamation No. 979/2016, hosts must report rental income. Individual tax rates range from 0% to 35% based on income brackets. Deductible expenses include repairs, maintenance, and depreciation. Consult a tax professional.",
        am: "በኢትዮጵያ የገቢ ግብር አዋጅ ቁጥር 979/2008 መሠረት፣ አስተናጋጆች የኪራይ ገቢያቸውን ማሳወቅ አለባቸው። የግለሰብ የግብር መጠኖች በገቢ ደረጃዎች ላይ ተመስርተው ከ0% እስከ 35% ይደርሳሉ። ተቀናሽ ወጪዎች ጥገና፣ እድሳት እና የእርጅና ቅናሽን ያካትታሉ። የግብር ባለሙያ ያማክሩ።"
      }
    },
    {
      id: "h8",
      question: {
        en: "How do I handle guest complaints?",
        am: "የእንግዳ ቅሬታዎችን እንዴት ማስተናገድ እችላለሁ?"
      },
      answer: {
        en: "Respond promptly and professionally. Listen to the guest's concern, offer a reasonable solution, and document everything. If you can't resolve it directly, contact EthioStay support.",
        am: "በፍጥነት እና በሙያዊ መንገድ ምላሽ ይስጡ። የእንግዳውን ስጋት ያዳምጡ፣ ምክንያታዊ መፍትሄ ያቅርቡ እና ሁሉንም ነገር በሰነድ ያስቀምጡ። በቀጥታ መፍታት ካልቻሉ የኢትዮስቴይ ድጋፍን ያነጋግሩ።"
      }
    },
    {
      id: "h9",
      question: {
        en: "Can I cancel a confirmed booking?",
        am: "የተረጋገጠ ምዝገባን መሰረዝ እችላለሁ?"
      },
      answer: {
        en: "Host cancellations are strongly discouraged and may affect your listing's visibility. Only cancel in genuine emergencies. If you must cancel, notify the guest as soon as possible and help them find alternative accommodation.",
        am: "በአስተናጋጅ በኩል የሚደረግ ስረዛ ፈጽሞ አይበረታታም እንዲሁም የማስታወቂያዎን ታይነት ሊጎዳ ይችላል። በእውነተኛ አስቸኳይ ጊዜ ብቻ ይሰርዙ። መሰረዝ ግዴታ ከሆነ፣ በተቻለ ፍጥነት ለእንግዳው ያሳውቁ እና አማራጭ ማረፊያ እንዲያገኙ ያግዟቸው።"
      }
    },
    {
      id: "h10",
      question: {
        en: "How do I take good listing photos?",
        am: "ለማስታወቂያዬ ጥሩ ፎቶዎችን እንዴት ማንሳት እችላለሁ?"
      },
      answer: {
        en: "Use natural light, clean and declutter spaces, photograph every room, capture outdoor areas, show the view if any, use landscape orientation, and include photos of amenities. Good photos significantly increase inquiries.",
        am: "የተፈጥሮ ብርሃን ይጠቀሙ፣ ክፍሎቹን ያጽዱ እና ያስተካክሉ፣ እያንዳንዱን ክፍል ፎቶ ያንሱ፣ የውጭ ቦታዎችን ያካትቱ፣ ካለ እይታውን ያሳዩ፣ ሰፋ ያለ አቅጣጫ ይጠቀሙ እና የአገልግሎቶችን ፎቶዎች ያካትቱ። ጥሩ ፎቶዎች የጥያቄዎችን ብዛት በእጅጉ ይጨምራሉ።"
      }
    },
    {
      id: "h11",
      question: {
        en: "What safety measures should I have?",
        am: "ምን ዓይነት የደህንነት እርምጃዎች ሊኖሩኝ ይገባል?"
      },
      answer: {
        en: "Recommended: working smoke detectors, fire extinguisher, first aid kit, secure locks on all doors/windows, well-lit entry/exit paths, emergency contact numbers posted visibly, and clear emergency exit routes.",
        am: "የሚመከሩት፡ የሚሰሩ የጭስ ጠቋሚዎች፣ የእሳት ማጥፊያ፣ የህክምና እርዳታ መስጫ፣ በሁሉም በሮች/መስኮቶች ላይ አስተማማኝ ቁልፎች፣ ጥሩ ብርሃን ያላቸው የመግቢያ/መውጫ መንገዶች፣ በግልጽ የተለጠፉ የአደጋ ጊዜ ስልክ ቁጥሮች እና ግልጽ የአደጋ ጊዜ መውጫ መንገዶች።"
      }
    },
    {
      id: "h12",
      question: {
        en: "How do I handle property damage?",
        am: "የንብረት ጉዳትን እንዴት ማስተናገድ እችላለሁ?"
      },
      answer: {
        en: "Document the property condition with photos before and after each guest stay. If damage occurs, contact the guest through EthioStay messaging, provide evidence (photos, repair estimates), and try to reach a fair resolution. As a last resort, disputes can be taken to Ethiopian courts.",
        am: "ከእያንዳንዱ እንግዳ ቆይታ በፊት እና በኋላ የንብረቱን ሁኔታ በፎቶዎች ያስመዝግቡ። ጉዳት ከደረሰ፣ በኢትዮስቴይ መልእክት በኩል እንግዳውን ያነጋግሩ፣ ማስረጃ (ፎቶዎች፣ የጥገና ግምቶች) ያቅርቡ እና ፍትሃዊ መፍትሄ ላይ ለመድረስ ይሞክሩ። እንደ መጨረሻ አማራጭ፣ አለመግባባቶች ወደ ኢትዮጵያ ፍርድ ቤቶች ሊወሰዱ ይችላሉ።"
      }
    }
  ]
};