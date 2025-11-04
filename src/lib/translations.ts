export const translations = {
  en: {
    // Header
    login: "Login",
    signUp: "Sign Up",
    
    // Dashboard
    dashboard: "Dashboard",
    weatherOverview: "Weather Overview",
    temperature: "Temperature",
    humidity: "Humidity",
    windSpeed: "Wind Speed",
    rainChance: "Rain Chance",
    viewFullForecast: "View Full Forecast",
    welcome: "Welcome back",
    quickActions: "Quick Actions",
    getCropRecommendation: "Get Crop Recommendation",
    diagnosePest: "Diagnose Pest",
    browseSchemes: "Browse Schemes",
    recentActivity: "Recent Activity",
    communityHighlights: "Community Highlights",
    needHelp: "Need Help?",
    chatWithAI: "Chat with our AI assistant for instant support",
    
    // Sidebar
    recommendations: "Recommendations",
    weather: "Weather",
    pestDiagnosis: "Pest Diagnosis",
    schemes: "Schemes",
    community: "Community",
    analytics: "Analytics",
    getSupport: "Get Support",
    
    // Profile Menu
    myAccount: "My Account",
    profileSettings: "Profile Settings",
    logout: "Logout",
  },
  hi: {
    // Header
    login: "लॉगिन",
    signUp: "साइन अप करें",
    
    // Dashboard
    dashboard: "डैशबोर्ड",
    weatherOverview: "मौसम अवलोकन",
    temperature: "तापमान",
    humidity: "नमी",
    windSpeed: "हवा की गति",
    rainChance: "बारिश की संभावना",
    viewFullForecast: "पूर्ण पूर्वानुमान देखें",
    welcome: "वापसी पर स्वागत है",
    quickActions: "त्वरित कार्य",
    getCropRecommendation: "फसल सिफारिश प्राप्त करें",
    diagnosePest: "कीट निदान करें",
    browseSchemes: "योजनाएं देखें",
    recentActivity: "हाल की गतिविधि",
    communityHighlights: "समुदाय मुख्य बातें",
    needHelp: "मदद चाहिए?",
    chatWithAI: "तत्काल सहायता के लिए हमारे AI सहायक से चैट करें",
    
    // Sidebar
    recommendations: "सिफारिशें",
    weather: "मौसम",
    pestDiagnosis: "कीट निदान",
    schemes: "योजनाएं",
    community: "समुदाय",
    analytics: "विश्लेषण",
    getSupport: "सहायता प्राप्त करें",
    
    // Profile Menu
    myAccount: "मेरा खाता",
    profileSettings: "प्रोफ़ाइल सेटिंग्स",
    logout: "लॉगआउट",
  },
  mr: {
    // Header
    login: "लॉगिन",
    signUp: "साइन अप करा",
    
    // Dashboard
    dashboard: "डॅशबोर्ड",
    weatherOverview: "हवामान विहंगावलोकन",
    temperature: "तापमान",
    humidity: "आर्द्रता",
    windSpeed: "वाऱ्याचा वेग",
    rainChance: "पावसाची शक्यता",
    viewFullForecast: "संपूर्ण अंदाज पहा",
    welcome: "पुन्हा स्वागत आहे",
    quickActions: "द्रुत कृती",
    getCropRecommendation: "पीक शिफारस मिळवा",
    diagnosePest: "कीटक निदान करा",
    browseSchemes: "योजना पहा",
    recentActivity: "अलीकडील क्रियाकलाप",
    communityHighlights: "समुदाय ठळक",
    needHelp: "मदत हवी आहे?",
    chatWithAI: "त्वरित समर्थनासाठी आमच्या AI सहाय्यकाशी चॅट करा",
    
    // Sidebar
    recommendations: "शिफारसी",
    weather: "हवामान",
    pestDiagnosis: "कीटक निदान",
    schemes: "योजना",
    community: "समुदाय",
    analytics: "विश्लेषण",
    getSupport: "समर्थन मिळवा",
    
    // Profile Menu
    myAccount: "माझे खाते",
    profileSettings: "प्रोफाइल सेटिंग्ज",
    logout: "लॉगआउट",
  },
  ta: {
    // Header
    login: "உள்நுழைய",
    signUp: "பதிவு செய்க",
    
    // Dashboard
    dashboard: "டாஷ்போர்டு",
    weatherOverview: "வானிலை கண்ணோட்டம்",
    temperature: "வெப்பநிலை",
    humidity: "ஈரப்பதம்",
    windSpeed: "காற்றின் வேகம்",
    rainChance: "மழை வாய்ப்பு",
    viewFullForecast: "முழு முன்னறிவிப்பைப் பார்க்கவும்",
    welcome: "மீண்டும் வரவேற்கிறோம்",
    quickActions: "விரைவு செயல்கள்",
    getCropRecommendation: "பயிர் பரிந்துரையைப் பெறுங்கள்",
    diagnosePest: "பூச்சி கண்டறியுங்கள்",
    browseSchemes: "திட்டங்களை உலாவுக",
    recentActivity: "சமீபத்திய செயல்பாடு",
    communityHighlights: "சமூக சிறப்பம்சங்கள்",
    needHelp: "உதவி தேவையா?",
    chatWithAI: "உடனடி ஆதரவுக்காக எங்கள் AI உதவியாளருடன் அரட்டை அடிக்கவும்",
    
    // Sidebar
    recommendations: "பரிந்துரைகள்",
    weather: "வானிலை",
    pestDiagnosis: "பூச்சி கண்டறிதல்",
    schemes: "திட்டங்கள்",
    community: "சமூகம்",
    analytics: "பகுப்பாய்வு",
    getSupport: "ஆதரவு பெறுக",
    
    // Profile Menu
    myAccount: "எனது கணக்கு",
    profileSettings: "சுயவிவர அமைப்புகள்",
    logout: "வெளியேறு",
  },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;
