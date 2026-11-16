/**
 * Word Hunt Dictionary Database
 * Extensive vocabulary lists for English and Bahasa Melayu across 15 themes.
 * Each theme contains 50-70+ curated words suitable for word search puzzles.
 */

export type Language = 'ms' | 'en';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface ThemeDefinition {
  id: string;
  name: {
    en: string;
    ms: string;
  };
  icon: string; // Lucide icon identifier or emoji
  description: {
    en: string;
    ms: string;
  };
}

export const THEMES: ThemeDefinition[] = [
  {
    id: 'animals',
    name: { en: 'Animals', ms: 'Haiwan' },
    icon: 'Cat',
    description: { en: 'Creatures from the wild, ocean, and home', ms: 'Makhluk liar, lautan dan jinak' },
  },
  {
    id: 'fruits',
    name: { en: 'Fruits', ms: 'Buah-buahan' },
    icon: 'Apple',
    description: { en: 'Sweet and juicy gifts of nature', ms: 'Manis dan berkhasiat' },
  },
  {
    id: 'food',
    name: { en: 'Food & Drinks', ms: 'Makanan & Minuman' },
    icon: 'Utensils',
    description: { en: 'Tasty dishes and culinary delights', ms: 'Hidangan lazat menyelerakan' },
  },
  {
    id: 'nature',
    name: { en: 'Nature', ms: 'Alam Semulajadi' },
    icon: 'Trees',
    description: { en: 'Forests, oceans, and landscapes', ms: 'Hutan, lautan dan landskap' },
  },
  {
    id: 'sports',
    name: { en: 'Sports', ms: 'Sukan' },
    icon: 'Trophy',
    description: { en: 'Athletics, games, and competitions', ms: 'Olahraga dan permainan aktif' },
  },
  {
    id: 'technology',
    name: { en: 'Technology', ms: 'Teknologi' },
    icon: 'Laptop',
    description: { en: 'Computers, gadgets, and innovation', ms: 'Komputer dan inovasi digital' },
  },
  {
    id: 'school',
    name: { en: 'School & Learning', ms: 'Sekolah & Pembelajaran' },
    icon: 'GraduationCap',
    description: { en: 'Classroom tools and subjects', ms: 'Peralatan kelas dan subjek' },
  },
  {
    id: 'travel',
    name: { en: 'Travel & Adventure', ms: 'Pelancongan & Kembara' },
    icon: 'Compass',
    description: { en: 'Journeys, destinations, and gear', ms: 'Destinasi dan percutian' },
  },
  {
    id: 'colours',
    name: { en: 'Colours', ms: 'Warna-warni' },
    icon: 'Palette',
    description: { en: 'Shades, tints, and vibrant tones', ms: 'Rona dan warna kehidupan' },
  },
  {
    id: 'body_parts',
    name: { en: 'Body Parts', ms: 'Anggota Badan' },
    icon: 'Heart',
    description: { en: 'Anatomy and human body parts', ms: 'Anatomi dan tubuh manusia' },
  },
  {
    id: 'household',
    name: { en: 'Household Items', ms: 'Barangan Rumah' },
    icon: 'Home',
    description: { en: 'Everyday objects around the home', ms: 'Peralatan dan perabot rumah' },
  },
  {
    id: 'transport',
    name: { en: 'Transportation', ms: 'Pengangkutan' },
    icon: 'Car',
    description: { en: 'Vehicles on land, sea, and air', ms: 'Kenderaan darat, laut dan udara' },
  },
  {
    id: 'occupations',
    name: { en: 'Occupations', ms: 'Pekerjaan & Kerjaya' },
    icon: 'Briefcase',
    description: { en: 'Professions, jobs, and careers', ms: 'Kerjaya dan bidang tugas' },
  },
  {
    id: 'countries',
    name: { en: 'Countries', ms: 'Negara Dunia' },
    icon: 'Globe',
    description: { en: 'Nations across the globe', ms: 'Negara-negara di serata dunia' },
  },
  {
    id: 'random',
    name: { en: 'Random Mix', ms: 'Campuran Rawak' },
    icon: 'Sparkles',
    description: { en: 'A surprise mix from all themes', ms: 'Pilihan kejutan pelbagai tema' },
  },
];

export const WORD_DATABASE: Record<Language, Record<string, string[]>> = {
  en: {
    animals: [
      'LION', 'TIGER', 'ELEPHANT', 'GIRAFFE', 'ZEBRA', 'MONKEY', 'PANDA', 'RABBIT',
      'DOLPHIN', 'WHALE', 'KANGAROO', 'KOALA', 'CHEETAH', 'LEOPARD', 'EAGLE', 'FALCON',
      'PENGUIN', 'TURTLE', 'OCTOPUS', 'SHARK', 'WOLF', 'BEAR', 'OTTER', 'BEAVER',
      'HAMSTER', 'PARROT', 'FLAMINGO', 'BADGER', 'SQUIRREL', 'HEDGEHOG', 'CHAMELEON',
      'WALRUS', 'PANTHER', 'BUFFALO', 'GAZELLE', 'JAGUAR', 'PEACOCK', 'RACCOON',
      'SEAL', 'SEAHORSE', 'STINGRAY', 'JELLYFISH', 'LOBSTER', 'CRAB', 'IGUANA', 'GECKO',
      'TOAD', 'FROG', 'COYOTE', 'BISON', 'MOOSE', 'REINDEER', 'ANTELOPE', 'HYENA',
      'MEERKAT', 'LEMUR', 'SLOTH', 'ARMADILLO', 'PLATYPUS', 'DINGO', 'GORILLA', 'BABOON',
      'ORANGUTAN', 'OSTRICH', 'EMU', 'PELICAN', 'CANARY', 'SPARROW', 'SWAN', 'HIPPO'
    ],
    fruits: [
      'APPLE', 'BANANA', 'ORANGE', 'MANGO', 'STRAWBERRY', 'PINEAPPLE', 'WATERMELON',
      'GRAPES', 'PAPAYA', 'BLUEBERRY', 'RASPBERRY', 'PEACH', 'CHERRY', 'AVOCADO',
      'LEMON', 'LIME', 'COCONUT', 'GUAVA', 'DRAGONFRUIT', 'POMEGRANATE', 'APRICOT',
      'BLACKBERRY', 'FIG', 'PLUM', 'KIWI', 'DURIAN', 'RAMBUTAN', 'MANGOSTEEN',
      'LYCHEE', 'PASSIONFRUIT', 'CRANBERRY', 'CANTALOUPE', 'GRAPEFRUIT', 'TANGERINE',
      'HONEYDEW', 'JACKFRUIT', 'KUMQUAT', 'MULBERRY', 'NECTARINE', 'OLIVE', 'PERSIMMON',
      'QUINCE', 'STARFRUIT', 'TAMARIND', 'YUZU', 'SALAK', 'POMELO', 'PLANTAIN',
      'LONGAN', 'DATE', 'CURRANT', 'ELDERBERRY', 'GOOSEBERRY', 'BOYSENBERRY', 'CLEMENTINE'
    ],
    food: [
      'PIZZA', 'BURGER', 'NOODLES', 'SUSHI', 'SANDWICH', 'PANCAKE', 'WAFFLE', 'SALAD',
      'SOUP', 'PASTA', 'STEAK', 'BREAD', 'CHEESE', 'OMELET', 'CURRY', 'DUMPLING',
      'TACO', 'BURRITO', 'POPCORN', 'COOKIE', 'MUFFIN', 'PUDDING', 'CUPCAKE', 'PIE',
      'BROWNIE', 'COFFEE', 'TEA', 'SMOOTHIE', 'JUICE', 'CHOCOLATE', 'HONEY', 'YOGURT',
      'BAGEL', 'CROISSANT', 'LASAGNA', 'RISOTTO', 'SPAGHETTI', 'RAVIOLI', 'GNOCCHI',
      'TART', 'CREPE', 'FONDUE', 'STEW', 'ROAST', 'BARBECUE', 'KEBAB', 'FALAFEL',
      'HUMMUS', 'GUACAMOLE', 'PRETZEL', 'CHEESECAKE', 'MACARON', 'TIRAMISU', 'GELATO',
      'SORBET', 'SUNDAE', 'MILKSHAKE', 'ESPRESSO', 'CAPPUCCINO', 'LATTE', 'LEMONADE'
    ],
    nature: [
      'MOUNTAIN', 'RIVER', 'VALLEY', 'OCEAN', 'FOREST', 'DESERT', 'VOLCANO', 'ISLAND',
      'WATERFALL', 'SUNSHINE', 'RAINBOW', 'THUNDER', 'GLACIER', 'CANYON', 'MEADOW',
      'STREAM', 'LAGOON', 'REEF', 'CAVE', 'JUNGLE', 'PRAIRIE', 'HORIZON', 'BREEZE',
      'SUNRISE', 'SUNSET', 'TORNADO', 'GALAXY', 'AURORA', 'COSMOS', 'COMET', 'BLOSSOM',
      'ESTUARY', 'DELTA', 'PLATEAU', 'ARCHIPELAGO', 'PENINSULA', 'FJORD', 'TUNDRA',
      'SAVANNA', 'STEPPE', 'WATERWAY', 'GEYSER', 'HOTSPRING', 'ATOLL', 'SANDDUNE',
      'OASIS', 'TROPICS', 'EQUATOR', 'SOLSTICE', 'EQUINOX', 'ECLIPSE', 'METEOR',
      'NEBULA', 'CONSTELLATION', 'STORM', 'DRIZZLE', 'BLIZZARD', 'FROST', 'HAIL'
    ],
    sports: [
      'SOCCER', 'BASKETBALL', 'BADMINTON', 'TENNIS', 'SWIMMING', 'BASEBALL', 'VOLLEYBALL',
      'CRICKET', 'RUGBY', 'GOLF', 'HOCKEY', 'CYCLING', 'RUNNING', 'BOXING', 'ARCHERY',
      'SURFING', 'SKATING', 'SKIING', 'ROWING', 'KARATE', 'JUDO', 'BOWLING', 'ATHLETICS',
      'TRIATHLON', 'MARATHON', 'FENCING', 'GYMNASTICS', 'HANDBALL', 'KICKBOXING',
      'SNOOKER', 'BILLIARDS', 'DARTS', 'LACROSSE', 'POLO', 'WATERPOLO', 'BOBSLEIGH',
      'LUGE', 'SKELETON', 'BIATHLON', 'SNOWBOARDING', 'SKATEBOARDING', 'WRESTLING',
      'EQUESTRIAN', 'WEIGHTLIFTING', 'CANOEING', 'KAYAKING', 'PADDLEBOARD', 'WINDSURFING',
      'PARAGLIDING', 'SKYDIVING', 'MOTORSPORT', 'MOTOCROSS', 'KARTING', 'SQUASH'
    ],
    technology: [
      'COMPUTER', 'INTERNET', 'SOFTWARE', 'HARDWARE', 'SMARTPHONE', 'DATABASE', 'ROBOT',
      'ALGORITHM', 'NETWORK', 'BROWSER', 'SERVER', 'MONITOR', 'KEYBOARD', 'CHIPSET',
      'DISPLAY', 'SATELLITE', 'ROUTER', 'CYBER', 'TABLET', 'LAPTOP', 'PROCESSOR',
      'BATTERY', 'FIREWALL', 'BLUETOOTH', 'QUANTUM', 'CODING', 'CLOUD', 'WIRELESS',
      'MICROCHIP', 'TRANSISTOR', 'FIBEROPTIC', 'MAINFRAME', 'BLOCKCHAIN', 'CRYPTOGRAPHY',
      'CYBERSECURITY', 'BANDWIDTH', 'GIGABYTE', 'TERABYTE', 'MALWARE', 'ANTIVIRUS',
      'FIRMWARE', 'BACKEND', 'FRONTEND', 'COMPILER', 'EMULATOR', 'VIRTUAL', 'INTERFACE',
      'PROTOCOL', 'PIXEL', 'RESOLUTION', 'SMARTWATCH', 'WEARABLE', 'DRONE', 'ROBOTICS'
    ],
    school: [
      'TEACHER', 'STUDENT', 'LIBRARY', 'CLASSROOM', 'PENCIL', 'NOTEBOOK', 'HOMEWORK',
      'SCIENCE', 'HISTORY', 'ENGLISH', 'CALCULATOR', 'RULER', 'ERASER', 'BACKPACK',
      'ALGEBRA', 'CHEMISTRY', 'BIOLOGY', 'PHYSICS', 'GEOGRAPHY', 'LECTURE', 'DIPLOMA',
      'EXAMINATION', 'CAMPUS', 'BLACKBOARD', 'GLOSSARY', 'PROJECT', 'RECESS', 'DICTIONARY',
      'CURRICULUM', 'SYLLABUS', 'ASSIGNMENT', 'ESSAY', 'THESIS', 'ACADEMY', 'INSTITUTE',
      'COLLEGE', 'UNIVERSITY', 'FACULTY', 'DEAN', 'PROFESSOR', 'SCHOLAR', 'RESEARCH',
      'EXPERIMENT', 'LABORATORY', 'AUDITORIUM', 'GYMNASIUM', 'SEMESTER', 'TUTORIAL',
      'SEMINAR', 'WORKSHOP', 'TEXTBOOK', 'STATIONERY', 'PROTRACTOR', 'WHITEBOARD'
    ],
    travel: [
      'AIRPORT', 'PASSPORT', 'LUGGAGE', 'BACKPACK', 'HOTEL', 'RESORT', 'CRUISE', 'FLIGHT',
      'JOURNEY', 'DESTINATION', 'CAMPING', 'EXPLORE', 'TICKETS', 'TOURIST', 'SOUVENIR',
      'HIGHWAY', 'LANDMARK', 'ITINERARY', 'TERMINAL', 'SUITCASE', 'MONUMENT', 'EXCURSION',
      'ADVENTURE', 'SAFARI', 'CARAVAN', 'LIGHTHOUSE', 'BEACH', 'HOSTEL', 'GUIDE',
      'BACKPACKING', 'WAYFARER', 'WANDERLUST', 'VOYAGE', 'CRUISELINER', 'METROPOLIS',
      'COUNTRYSIDE', 'GUESTHOUSE', 'CHALET', 'COTTAGE', 'MOUNTAINPASS', 'VIEWPOINT',
      'SIGHTSEEING', 'CABLECAR', 'TREKKING', 'HIKING', 'NAVIGATOR', 'BOARDINGPASS',
      'CUSTOMS', 'IMMIGRATION', 'CURRENCY', 'EXCHANGE', 'EXPATRIATE'
    ],
    colours: [
      'YELLOW', 'PURPLE', 'ORANGE', 'VIOLET', 'INDIGO', 'TURQUOISE', 'MAGENTA', 'CRIMSON',
      'EMERALD', 'SAPPHIRE', 'AMBER', 'SCARLET', 'MAROON', 'LAVENDER', 'CYAN', 'BRONZE',
      'SILVER', 'GOLDEN', 'PEACH', 'FUCHSIA', 'COPPER', 'TEAL', 'CHARCOAL', 'SALMON',
      'CORAL', 'MUSTARD', 'AQUAMARINE', 'BURGUNDY', 'PLATINUM', 'OLIVE', 'ROSE',
      'CERULEAN', 'PERIWINKLE', 'OCHRE', 'SIENNA', 'UMBER', 'SEPIA', 'MAUVE',
      'CHARTREUSE', 'VERMILION', 'CARMINE', 'TAUPE', 'BEIGE', 'KHAKI', 'COBALT',
      'MINT', 'SAGE', 'LIMEGREEN', 'GOLD', 'BRASS', 'PEWTER', 'RUST', 'EBONY', 'IVORY'
    ],
    body_parts: [
      'SHOULDER', 'ELBOW', 'WRIST', 'FINGER', 'THUMB', 'STOMACH', 'ANKLE', 'KNEE',
      'HEEL', 'BRAIN', 'LUNGS', 'KIDNEY', 'SPINE', 'MUSCLE', 'TONGUE', 'CHEEK',
      'FOREHEAD', 'EYEBROW', 'EYELASH', 'THROAT', 'KNUCKLE', 'COLLARBONE', 'RIBCAGE',
      'HEART', 'LIVER', 'SKELETON', 'ARTERIES', 'TENDON', 'PALM', 'CHEST',
      'FOREARM', 'BICEPS', 'TRICEPS', 'HAMSTRING', 'CALF', 'SHIN', 'PELVIS',
      'CLAVICLE', 'SCAPULA', 'STERNUM', 'CRANIUM', 'VERTEBRA', 'CARTILAGE', 'LIGAMENT',
      'EPIDERMIS', 'CAPILLARIES', 'AORTA', 'TRACHEA', 'ESOPHAGUS', 'PANCREAS', 'SPLEEN',
      'BLADDER', 'THYROID', 'CORNEA', 'RETINA', 'PUPIL', 'EARLOBE', 'NOSTRIL', 'CHIN', 'JAW'
    ],
    household: [
      'BLANKET', 'PILLOW', 'CURTAIN', 'WARDROBE', 'CABINET', 'MIRROR', 'REFRIGERATOR',
      'MICROWAVE', 'BLENDER', 'TOASTER', 'TEAPOT', 'KETTLE', 'CARPET', 'SOFA',
      'CHANDELIER', 'BOOKSHELF', 'MATTRESS', 'DRAWER', 'CUSHION', 'TELEVISION',
      'WASHING', 'VACUUM', 'DUSTER', 'HANGERS', 'DUVET', 'CLOCK', 'BEDSHEET', 'SHOWER',
      'ARMCHAIR', 'FOOTSTOOL', 'SIDEBOARD', 'NIGHTSTAND', 'CHEST', 'LAMP', 'SCONCE',
      'FIREPLACE', 'MANTEL', 'VASE', 'TAPESTRY', 'TABLECLOTH', 'NAPKIN', 'CUTLERY',
      'SAUCEPAN', 'SKILLET', 'COLANDER', 'WHISK', 'SPATULA', 'LADLE', 'CORKSCREW',
      'GRATER', 'DUSTPAN', 'BROOM', 'MOP', 'BUCKET', 'SPONGE', 'LAUNDRY', 'IRON'
    ],
    transport: [
      'AIRPLANE', 'HELICOPTER', 'SUBWAY', 'TRAMCAR', 'FERRY', 'SPEEDBOAT', 'SCOOTER',
      'BICYCLE', 'MOTORCYCLE', 'AMBULANCE', 'FIRETRUCK', 'STEAMSHIP', 'CONTAINER',
      'TRACTOR', 'LOCOMOTIVE', 'CRUISER', 'SPACECRAFT', 'SUBMARINE', 'GONDOLA',
      'TAXI', 'MONORAIL', 'SEAPLANE', 'CARAVAN', 'DIRIGIBLE', 'BULLET',
      'TRICYCLE', 'UNICYCLE', 'QUADBIKE', 'SEGWAY', 'TROLLEYBUS', 'CABLECAR', 'FUNICULAR',
      'HYDROFOIL', 'CATAMARAN', 'HOVERCRAFT', 'BARGE', 'TUGBOAT', 'YACHT', 'SAILBOAT',
      'CANOE', 'KAYAK', 'JETSKI', 'GLIDER', 'BLIMP', 'ZEPPELIN', 'PARAGLIDER', 'ROCKET', 'CARGO'
    ],
    occupations: [
      'DOCTOR', 'ENGINEER', 'ARCHITECT', 'PILOT', 'CHEF', 'SCIENTIST', 'JOURNALIST',
      'FIREFIGHTER', 'POLICEMAN', 'LAWYER', 'ASTRONAUT', 'MUSICIAN', 'CARPENTER',
      'PLUMBER', 'ELECTRICIAN', 'MECHANIC', 'SURGEON', 'DENTIST', 'VETERINARIAN',
      'PHARMACIST', 'PHOTOGRAPHER', 'PROGRAMMER', 'DETECTIVE', 'ACCOUNTANT', 'DESIGNER',
      'BIOLOGIST', 'CHEMIST', 'PHYSICIST', 'ASTRONOMER', 'GEOLOGIST', 'METEOROLOGIST',
      'BOTANIST', 'ZOOLOGIST', 'ECOLOGIST', 'PEDIATRICIAN', 'CARDIOLOGIST', 'NEUROLOGIST',
      'PSYCHIATRIST', 'THERAPIST', 'NURSE', 'PARAMEDIC', 'OPTOMETRIST', 'BAKER',
      'BUTCHER', 'BARISTA', 'SOMMELIER', 'CONFECTIONER', 'FLORIST', 'GARDENER', 'LANDSCAPER',
      'LIBRARIAN', 'ARCHIVIST', 'CURATOR'
    ],
    countries: [
      'MALAYSIA', 'SINGAPORE', 'INDONESIA', 'THAILAND', 'JAPAN', 'CANADA', 'AUSTRALIA',
      'FRANCE', 'GERMANY', 'BRAZIL', 'ARGENTINA', 'MEXICO', 'ITALY', 'SPAIN', 'ENGLAND',
      'NORWAY', 'SWITZERLAND', 'EGYPT', 'TURKEY', 'VIETNAM', 'PORTUGAL', 'SWEDEN',
      'FINLAND', 'NETHERLANDS', 'GREECE', 'IRELAND', 'ICELAND', 'CHILE', 'COLOMBIA',
      'NEWZEALAND', 'SOUTHAFRICA', 'NIGERIA', 'KENYA', 'MOROCCO', 'GHANA', 'ETHIOPIA',
      'INDIA', 'PAKISTAN', 'BANGLADESH', 'SRILANKA', 'NEPAL', 'BHUTAN', 'MALDIVES',
      'MYANMAR', 'CAMBODIA', 'LAOS', 'TAIWAN', 'MONGOLIA', 'KAZAKHSTAN', 'AUSTRIA',
      'BELGIUM', 'DENMARK', 'POLAND', 'CZECHIA', 'HUNGARY', 'ROMANIA', 'CROATIA', 'PERU'
    ],
    random: [] // Filled dynamically below
  },
  ms: {
    animals: [
      'SINGA', 'HARIMAU', 'GAJAH', 'ZIRAFAH', 'KERA', 'MONYET', 'ARNAB', 'LUMBA',
      'PAUS', 'KANGARU', 'KANCIL', 'TENGGILING', 'HELANG', 'BURUNG', 'PENYU', 'SOTONG',
      'HIU', 'SERIGALA', 'BERUANG', 'MEMBERANG', 'BURUNGHANTU', 'KUCING', 'ANJING',
      'KAMBING', 'LEMBU', 'KUDA', 'AYAM', 'ITIK', 'LANDAK', 'BADAK', 'BIAWAK',
      'RUSA', 'SELADANG', 'ENGGANG', 'TAPIR', 'KELASAU', 'BELALANG', 'RAMA',
      'KUPUKUPU', 'LABAHLABAH', 'CENDERAWASIH', 'KURA', 'KUANG', 'MERAK', 'KALAJENGKING',
      'CICAK', 'TOKEK', 'KELAWAR', 'MUSANG', 'PELANDUK', 'KIJANG', 'BERUK',
      'SIAMANG', 'LUTUNG', 'ORANGUTAN', 'BABUN', 'GORILA', 'SEBRA', 'CITA',
      'PARI', 'BUNTAL', 'YU', 'KERAPU', 'JENAHAK', 'BAWAL', 'KETAM', 'UDANG', 'SIPUT', 'BELUKAR'
    ],
    fruits: [
      'EPAL', 'PISANG', 'TEMBIKAI', 'MANGGA', 'BETIK', 'DURIAN', 'RAMBUTAN', 'MANGGIS',
      'NANAS', 'ANGGUR', 'JAMBU', 'LIMAU', 'CIKU', 'KELAPA', 'NANGKA', 'CEMPEDAK',
      'LANGSAT', 'DUKU', 'KEDONDONG', 'BELIMBING', 'STRAWBERI', 'AVOKADO', 'KIWI',
      'PULASAN', 'SALAK', 'DELIMA', 'BIDARA', 'CERMAI', 'KUNDANG', 'SUKUN', 'ASAM',
      'LONGAN', 'KABUNG', 'ENAU', 'SENTUL', 'BINJAI', 'KUINI', 'BACANG', 'BERANGAN',
      'KERANJI', 'NAMNAM', 'MENTEGA', 'KECAPI', 'LIMAUPURUT', 'LIMAUNIPIS', 'LIMAUKASTURI',
      'LIMAUBALI', 'TEMBIKAISUSU', 'MELON', 'KURMA', 'ZAITUN', 'PRUN', 'APRIKOT', 'RASBERI'
    ],
    food: [
      'NASILEMAK', 'RENDANG', 'SATAY', 'ROTIKAYA', 'LAKSA', 'MEEGORENG', 'KUIH',
      'KARIPAP', 'SAMBAL', 'AYAMGORENG', 'KARI', 'MURTABAK', 'LEMPENG', 'LONTONG',
      'SOTO', 'CENDOL', 'KETUPAT', 'LEMANG', 'APAM', 'PAU', 'SERIMUKA', 'PULUT',
      'OTAKOTAK', 'BAKSO', 'SUPTULANG', 'AISKACANG', 'TEHTARIK', 'KOPI', 'ROJAK',
      'NASIGORENG', 'NASIKERABU', 'NASIDAGANG', 'NASIBRIYANI', 'MEEREBUS', 'MEEKARI',
      'KUEYTEOW', 'BIHUN', 'ROTIJOHN', 'ROTICANAI', 'ROTIJALA', 'SAMBALBELACAN',
      'ASAMPEDAS', 'MASAKLEMAK', 'GULAIKAWAH', 'KERABU', 'PAISIKAN', 'SATAYAYAM',
      'KEROPOKLEKOR', 'PULUTPANGGANG', 'DODOL', 'WAJIK', 'BAHULU', 'KASWI', 'TALAM',
      'LOMPANG', 'AIRSIRAP', 'AIRBANDUNG', 'AIRKELAPA'
    ],
    nature: [
      'GUNUNG', 'SUNGAI', 'LEMBAH', 'LAUTAN', 'HUTAN', 'PANTAI', 'TASIK', 'PULAU',
      'AIRTERJUN', 'PELANGI', 'KILAT', 'GURUN', 'BUKIT', 'RANTING', 'POKOK', 'DAUN',
      'BUNGA', 'GUA', 'MATAHARI', 'BULAN', 'BINTANG', 'AWAN', 'ANGIN', 'OMBAK',
      'CAKERAWALA', 'KABUT', 'SENJA', 'FAJAR', 'EMBUN', 'BATUAN', 'TANAH',
      'RANTAU', 'SEMENANJUNG', 'GUGUSAN', 'TELUK', 'SELAT', 'KUALA', 'JERAM',
      'BENUA', 'KHATULISTIWA', 'GERHANA', 'BINTANGJATUH', 'ANGKASA', 'KOMET', 'GELOMBANG',
      'PUSARAN', 'BANJIR', 'KEMARAU', 'PUTINGBELIUNG', 'RIBUT', 'PETIR', 'GEMPA',
      'LAHAR', 'KAWAH', 'PUNCAK', 'TEBING', 'LERENG', 'LURAH', 'DATARAN', 'RUMPUT'
    ],
    sports: [
      'BOLASEPAK', 'BADMINTON', 'TAKRAW', 'HOKI', 'RENANG', 'BOLAJARING', 'BOLATAMPAR',
      'BOLABALING', 'BASIKAL', 'LARI', 'SILAT', 'TAEKWONDO', 'GOLF', 'TENIS', 'MEMANAH',
      'SKUASY', 'BOLING', 'KAYAK', 'GIMNASTIK', 'MARATON', 'RAGBI',
      'JUDO', 'KARATE', 'TINJU', 'LUMBA', 'MENEMBAK', 'PELAYARAN', 'CATUR',
      'TENISMEJA', 'PINGPONG', 'POLOAIR', 'BILIAR', 'SNOKER', 'DART', 'GUSTI',
      'ANGKATBERAT', 'BINABADAN', 'LARIANDESA', 'MERENTASDESA', 'LOMPATJAUH',
      'LOMPATTINGGI', 'LONTARPELURU', 'REJAMLEMBING', 'LEMPARCAKERA', 'BASIKALBUKIT',
      'PERAHUNAGA', 'SELAM', 'SEPAKTAKRAW', 'PETANQUE', 'MEMANCING', 'MENDAKI'
    ],
    technology: [
      'KOMPUTER', 'INTERNET', 'PERISIAN', 'PERKAKASAN', 'TELEFON', 'ROBOTIK', 'RANGKAIAN',
      'PELAYAR', 'SKRIN', 'PAPANKEKUNCI', 'TETIKUS', 'PENGATURCARAAN', 'SATELIT',
      'TABLET', 'KOMPUTERRIBA', 'CIP', 'BATERI', 'KABEL', 'KAMERA', 'DATA',
      'LAMANWEB', 'ALGORITMA', 'KOD', 'APLIKASI', 'STORAN', 'PENCETAK', 'PENGIMBAS',
      'CIPMIKRO', 'SERATOPTIK', 'KODSUMBER', 'PENGKOMPIL', 'KESELAMATAN', 'KECERDASAN',
      'AUTOMASI', 'JAMTAG', 'PENYULAM', 'PENERIMA', 'PEMANCAR', 'GELOMBANG',
      'PENGESAN', 'LEBARJALUR', 'GIGABAIT', 'TERABAIT', 'KODBINARI', 'PANGKALANDATA',
      'ANTARAMUKA', 'PENGATURCARA', 'DRON', 'ROBOT', 'SIMULASI', 'SENSOR', 'DIGITAL'
    ],
    school: [
      'GURU', 'MURID', 'PERPUSTAKAAN', 'KELAS', 'PENSEL', 'BUKUTULIS', 'KERJARUMAH',
      'SAINS', 'SEJARAH', 'MATEMATIK', 'GEOGRAFI', 'PEMBARIS', 'PEMADAM', 'BEGSEKOLAH',
      'KANTIN', 'PADANG', 'MAKMAL', 'PENTAS', 'PEPERIKSAAN', 'SIJIL', 'IJAZAH',
      'KAMUS', 'JAMILMU', 'LOCENG', 'LENCANA', 'SERAGAM', 'BENGKEL', 'DEWAN',
      'KURIKULUM', 'SUKATAN', 'TUGASAN', 'KERTASKERJA', 'TESIS', 'AKADEMI', 'INSTITUT',
      'KOLEJ', 'UNIVERSITI', 'FAKULTI', 'DEKAN', 'PROFESOR', 'PENSYARAH', 'CENDEKIAWAN',
      'PENYELIDIKAN', 'EKSPERIMEN', 'AUDITORIUM', 'GIMNASIUM', 'SEMESTER', 'TUTORIAL',
      'SEMINAR', 'BUKUTEKS', 'ALATTULIS', 'JANGKALUKIS', 'PAPANPUTIH', 'PAPANHITAM', 'KOKURIKULUM'
    ],
    travel: [
      'LAPANGANTERBANG', 'PASPORT', 'BEG', 'HOTEL', 'PERCUTIAN', 'PENERBANGAN', 'KEMBARA',
      'DESTINASI', 'BERKHEMAH', 'PELANCONG', 'CENDERAMATA', 'LEBUHRAYA', 'TIKET',
      'PANORAMA', 'KERETAPI', 'PELABUHAN', 'KAPAL', 'PANDUAN', 'PETA', 'KHEMAH',
      'PENGINAPAN', 'RESORT', 'LALUAN', 'PULAU', 'PANTAI', 'KENDERAAN', 'EKSPEDISI',
      'RANSEL', 'PENJELAJAH', 'PELAYARAN', 'KAPALMEWAH', 'KOTARAYA', 'DESA', 'RUMAHINAP',
      'CHALET', 'KOTEJ', 'LALUANGUNUNG', 'PANDANGAN', 'MENARATINJAU', 'MELAWAT',
      'KERETAKABEL', 'TREKKING', 'HIKING', 'JURUARAH', 'PASMASUK', 'KASTAM', 'IMIGRESEN',
      'MATAWANG', 'PERKHEMAHAN', 'SAFARI', 'RUMAHREHAT', 'TEMPATMENARIK'
    ],
    colours: [
      'MERAH', 'BIRU', 'KUNING', 'HIJAU', 'UNGU', 'JINGGA', 'PUTIH', 'HITAM',
      'KELABU', 'COKLAT', 'MERAHJAMBU', 'EMAS', 'PERAK', 'NILA', 'ZAMRUD', 'DELIMA',
      'GANGSA', 'KUNINGLANGSAT', 'BIRUPEKAT', 'HIJAUMUDA', 'RONA', 'CORAK', 'GELAP',
      'TERANG', 'WARNAWARNI', 'MUTIARA', 'AMBAR', 'TURKUIS', 'MAGENTA', 'KAPUR',
      'BIRULANGIT', 'BIRULAUT', 'HIJAUPUCUK', 'HIJAULUMUT', 'MERAHBATA', 'MERAHATI',
      'KUNINGEMAS', 'KUNINGKUNYIT', 'COKLATTUA', 'COKLATMUDA', 'KELABUASAP', 'PUTIHMUTIARA',
      'HITAMARANG', 'HITAMLEGAM', 'INDIGO', 'MAUV', 'SEPIA', 'BEIGE', 'GADING', 'KOBALT', 'TEMBAGA'
    ],
    body_parts: [
      'KEPALA', 'RAMBUT', 'MATA', 'HIDUNG', 'TELINGA', 'MULUT', 'GIGI', 'LIDAH',
      'LEHER', 'BAHU', 'TANGAN', 'JARI', 'DADA', 'PERUT', 'LUTUT', 'KAKI',
      'TUMIT', 'JANTUNG', 'PARUPARU', 'OTAK', 'TULANG', 'DARAH', 'KULIT', 'SENDI',
      'PIPI', 'DAGU', 'KENING', 'BULUMATA', 'SIKU', 'PERGELANGAN', 'PINGGANG',
      'LENGAN', 'BETIS', 'TULANGKERING', 'PINGGUL', 'TULANGRUSUK', 'TENGKORAK', 'RAHANG',
      'GUSI', 'ANAKTEKAK', 'PETISUARA', 'KERONGKONG', 'TRAKEA', 'PANKREAS', 'LIMPA',
      'PUNDIKENCING', 'KORNEA', 'RETINA', 'ANAKMATA', 'CUPINGTELINGA', 'LUBANGHIDUNG',
      'IBUJARI', 'JARITELUNJUK', 'JARITENGAH', 'JARIMANIS', 'JARIKELENGKENG', 'TAPAKTANGAN', 'PAHA'
    ],
    household: [
      'SELIMUT', 'BANTAL', 'LANGSIR', 'ALMARI', 'CERMIN', 'PETIAIS', 'KETUHAR',
      'PENGISAR', 'CERET', 'PERMAIDANI', 'SOFA', 'MEJA', 'KERUSI', 'TILAM',
      'LAMPU', 'PENGHAWADINGIN', 'KIPAS', 'TELEVISYEN', 'PINGGAN', 'MANGKUK',
      'SUDU', 'GARPU', 'PERIUK', 'KUALI', 'SABUN', 'TUALA', 'JAMDINDING', 'PENYAPU',
      'KERUSIMALAS', 'ALMARIBAJU', 'MEJASISI', 'MEJATULIS', 'LAMPUTIDUR', 'PELITA',
      'PASUBUNGA', 'ALASMEJA', 'SERBET', 'SENDUK', 'SUDUKAYU', 'PISAU', 'PAPANPEMOTONG',
      'PENYARING', 'PENGUPAS', 'PEMBUKABOTOL', 'PARUT', 'PENYODOK', 'MOP', 'BALDI',
      'SPAN', 'BAKULBAJU', 'SETERIKA', 'PAPANSETERIKA', 'PENYIDAI', 'PENGGANTUNG', 'JAMLOCENG'
    ],
    transport: [
      'KAPALTERBANG', 'HELIKOPTER', 'KERETAPI', 'BAS', 'KERETA', 'MOTOSIKAL', 'BASIKAL',
      'BOT', 'KAPAL', 'BECA', 'TEKSI', 'VAN', 'LORI', 'KREN', 'TRAKTOR', 'MONOREL',
      'KAPALSELAM', 'RAKIT', 'FERI', 'PERAHU', 'SKUTER', 'KOMUTER', 'LRT', 'MRT',
      'SKUTERELEKTRIK', 'KERETAKABEL', 'HOVERKRAF', 'KATAMARAN', 'BOTLAJU', 'BOTUNDUR',
      'KAPALTUNDUK', 'YACHT', 'KAPALLAYAR', 'KANO', 'JETSKI', 'PELUNCUR', 'KAPALUDARA',
      'ROKET', 'KAPALKARGO', 'KAPALTANGKI', 'LORIKONTEINER', 'TRAKTORPERTANIAN', 'JENTERA',
      'MOTOSIKALBESAR', 'BECARODATIGA', 'KERETAAPIKILAT', 'PERAHUPANJANG'
    ],
    occupations: [
      'DOKTOR', 'GURU', 'JURUTERA', 'ANGKASAWAN', 'POLIS', 'BOMBA', 'PEGUAM', 'HAKIM',
      'JURURAWAT', 'TUKANGMASAK', 'SAINTIS', 'WARTAWAN', 'PETANI', 'NELAYAN', 'ARKITEK',
      'PENULIS', 'PELUKIS', 'PENYANYI', 'MEKANIK', 'TUKANGKAYU', 'POSMEN', 'PEMANDU',
      'JURUTERBANG', 'FARMASIS', 'DOKTORGIGI', 'PEREKA', 'ANGGOTA',
      'AHLIBIOLOGI', 'AHLIKIMIA', 'AHLIFIZIK', 'AHLIASTRONOMI', 'AHLIGEOLOGI', 'PAKARBEDAH',
      'PAKARJANTUNG', 'DOKTORBEDAH', 'JURUTERAPI', 'PARAMEDIK', 'DOKTORHAIWAN',
      'OPTOMETRIS', 'TUKANGROTI', 'TUKANGDAGING', 'BARISTA', 'TUKANGBUNGA', 'TUKANGKEBUN',
      'PENGAWAS', 'KURATOR', 'PENULISNOVEL', 'PENTERJEMAH', 'EDITOR', 'PENGARAH', 'JURUAUDIO', 'JURUTEKNIK'
    ],
    countries: [
      'MALAYSIA', 'SINGAPURA', 'INDONESIA', 'THAILAND', 'BRUNEI', 'FILIPINA', 'VIETNAM',
      'JEPUN', 'KOREA', 'CHINA', 'AUSTRALIA', 'PERANCIS', 'JERMAN', 'SEPANYOL', 'ITALI',
      'MESIR', 'TURKI', 'BELANDA', 'SWITZERLAND', 'NORWAY', 'BRAZIL', 'KANADA',
      'ENGLAND', 'ARABSAUDI', 'NEWZEALAND', 'PORTUGAL', 'SWEDEN', 'GREECE',
      'AFRIKASELATAN', 'NIGERIA', 'KENYA', 'MAROKO', 'GHANA', 'HABSYAH', 'INDIA',
      'PAKISTAN', 'BANGLADESH', 'SRILANKA', 'NEPAL', 'BHUTAN', 'MALDIVES', 'MYANMAR',
      'KEMBOJA', 'LAOS', 'TAIWAN', 'MONGOLIA', 'KAZAKHSTAN', 'AUSTRIA', 'BELGIUM',
      'DENMARK', 'POLAND', 'CZECHIA', 'HUNGARY', 'ROMANIA', 'CROATIA', 'FINLAND',
      'ESTONIA', 'LATVIA', 'LITHUANIA', 'PERU', 'URUGUAY', 'QATAR', 'KUWAIT', 'OMAN'
    ],
    random: [] // Filled dynamically below
  }
};

// Populate random themes with a rich blend from all other themes
['en', 'ms'].forEach((lang) => {
  const l = lang as Language;
  const allWords = Object.entries(WORD_DATABASE[l])
    .filter(([key]) => key !== 'random')
    .flatMap(([, list]) => list);
  // Deduplicate and filter length
  WORD_DATABASE[l].random = Array.from(new Set(allWords));
});

// Common letter frequencies for realistic background fill
export const LETTER_FREQUENCIES: Record<Language, string> = {
  en: 'EEEEEEEEAAAAAAIIIIIOOOOOONNNNNNRRRRRRTTTTTTLLLLSSSSUUUDDDGGGBBCCMMPPFFHHVVWWYYKJXZQ',
  ms: 'AAAAAAAAAAAAEEEEEEEEIIIIIIUUUUUUNNNNNNKKKKKKSSSSSSRRRRRRTTTTTTMMMMMMBBBBBLLLLLDDDDGGPPHHYYCWJVFZQ'
};
