// src/mockEvents.ts
// Mock event data inspired by real-world event naming patterns
// This is completely original content for demonstration purposes

export const mockEventNames = [
  // Pop & Mainstream Artists
  "Olivia Rodrigo Guts Tour",
  "Harry Styles Love on Tour",
  "Billie Eilish Happier Than Ever",
  "Dua Lipa Future Nostalgia",
  "Ariana Grande Sweetener World",
  "Justin Bieber Justice World Tour",
  "Ed Sheeran Mathematics Tour",
  "Bruno Mars 24K Magic Experience",
  "The Weeknd After Hours Til Dawn",
  "Doja Cat Planet Her Tour",
  
  // Hip-Hop & Rap
  "Kendrick Lamar Mr. Morale Tour",
  "Drake It's All a Blur",
  "Travis Scott Circus Maximus",
  "Post Malone Twelve Carat Tour",
  "Lil Nas X Montero World Tour",
  "Cardi B Invasion of Privacy",
  "Megan Thee Stallion Hot Girl Summer",
  "Future I Never Liked You Tour",
  "Young Thug Punk Tour",
  "Lil Baby It's Only Me",
  
  // R&B & Soul
  "SZA SOS Tour",
  "Frank Ocean Blonde Nights",
  "The Weeknd Starboy Tour",
  "Chris Brown Breezy Tour",
  "Ne-Yo Year of the Gentleman",
  "Alicia Keys Keys to the City",
  "John Legend All of Me Tour",
  "Mary J. Blige Strength of a Woman",
  "Pharrell Williams Happy Night",
  "Usher My Way Tour",
  
  // Rock & Alternative
  "Arctic Monkeys The Car Tour",
  "The 1975 Being Funny Tour",
  "Twenty One Pilots Scaled and Icy",
  "Imagine Dragons Mercury Tour",
  "Coldplay Music of the Spheres",
  "Red Hot Chili Peppers Unlimited Love",
  "Foo Fighters But Here We Are",
  "Green Day Saviors Tour",
  "Weezer Van Weezer Tour",
  "Blink-182 One More Time",
  
  // Electronic & Dance
  "Calvin Harris Funk Wav Bounces",
  "Skrillex Quest for Fire",
  "Deadmau5 Cube V3 Tour",
  "Diplo Higher Ground",
  "Marshmello Shockwave Tour",
  "Zedd True Colors Tour",
  "Kygo Thrill of the Chase",
  "Martin Garrix Sentio Tour",
  "David Guetta Future Rave",
  "Swedish House Mafia Paradise Again",
  
  // Country & Folk
  "Taylor Swift Eras Tour",
  "Luke Combs Growin' Up Tour",
  "Morgan Wallen Dangerous Tour",
  "Carrie Underwood Denim & Rhinestones",
  "Miranda Lambert Palomino Tour",
  "Jason Aldean Macon Tour",
  "Florida Georgia Line Life Rolls On",
  "Kane Brown Different Man Tour",
  "Maren Morris Humble Quest",
  "Chris Stapleton All-American Road Show",
  
  // Latin & World Music
  "Bad Bunny World's Hottest Tour",
  "J Balvin Colores Tour",
  "Maluma Papi Juancho Tour",
  "Karol G Mañana Será Bonito",
  "Ozuna Nibiru Tour",
  "Daddy Yankee Legendaddy Tour",
  "Shakira El Dorado Tour",
  "Enrique Iglesias Final Tour",
  "Ricky Martin Movimiento Tour",
  "Marc Anthony Opus Tour",
  
  // Jazz & Blues
  "Norah Jones Visions Tour",
  "Diana Krall Turn Up the Quiet",
  "John Mayer Sob Rock Tour",
  "Robert Glasper Black Radio",
  "Kamasi Washington Heaven and Earth",
  "Esperanza Spalding Songwrights Apothecary",
  "Cécile McLorin Salvant Ghost Song",
  "Christian McBride New Jawn",
  "Brad Mehldau Suite: April 2020",
  "Pat Metheny From This Place",
  
  // Classical & Orchestral
  "Yo-Yo Ma Six Evolutions Tour",
  "Lang Lang The Disney Book",
  "Itzhak Perlman Beethoven Sonatas",
  "Joshua Bell Voice of the Violin",
  "Hilary Hahn Paris Concertos",
  "Yuja Wang The Berlin Recital",
  "Daniil Trifonov Silver Age",
  "Leif Ove Andsnes Chopin Ballades",
  "Mitsuko Uchida Mozart Sonatas",
  "Murray Perahia Bach Partitas",
  
  // Comedy & Spoken Word
  "Dave Chappelle The Closer",
  "Kevin Hart Reality Check",
  "Amy Schumer Emergency Contact",
  "John Mulaney From Scratch",
  "Trevor Noah Off the Record",
  "Hannah Gadsby Douglas",
  "Bo Burnham Inside Tour",
  "Ali Wong Don Wong",
  "Tom Segura Sledgehammer",
  "Bert Kreischer Fully Loaded",
  
  // Theater & Broadway
  "Hamilton: An American Musical",
  "The Lion King Broadway",
  "Wicked: The Untold Story",
  "Dear Evan Hansen Tour",
  "Come From Away Broadway",
  "The Book of Mormon Tour",
  "Les Misérables Revival",
  "Phantom of the Opera Final",
  "Chicago: The Musical",
  "Mamma Mia! Here We Go Again",
  
  // Sports & Entertainment
  "NBA All-Star Weekend",
  "Super Bowl Halftime Show",
  "WrestleMania Main Event",
  "UFC Championship Fight",
  "Olympic Opening Ceremony",
  "World Cup Final Match",
  "Champions League Final",
  "NBA Finals Game 7",
  "World Series Game 7",
  "Stanley Cup Finals",
  
  // Festival & Multi-Artist
  "Coachella Valley Music Festival",
  "Lollapalooza Chicago",
  "Bonnaroo Music Festival",
  "Austin City Limits Festival",
  "Governors Ball Music Festival",
  "Outside Lands Music Festival",
  "Firefly Music Festival",
  "Electric Daisy Carnival",
  "Ultra Music Festival",
  "Tomorrowland Festival"
];

// Generate mock ticket data with realistic pricing
export function generateMockTickets() {
  return mockEventNames.map((name, index) => ({
    id: `event-${index + 1}`,
    title: name,
    price: Math.round((Math.random() * 200 + 25) * 100) / 100, // $25-$225
    currency: ['USD', 'EUR', 'GBP'][Math.floor(Math.random() * 3)] as 'USD' | 'EUR' | 'GBP'
  }));
}

// Generate mock raw ticket data (for testing transformTickets)
export function generateMockRawTickets() {
  return mockEventNames.map((name, index) => ({
    id: index + 1,
    title: name,
    price_cents: Math.floor(Math.random() * 20000 + 2500), // 2500-22500 cents
    currency: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'][Math.floor(Math.random() * 5)]
  }));
}
