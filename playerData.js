```javascript
"use strict";

/*
 * Super League Soccer
 * playerData.js
 *
 * Player and club database.
 * Uses built-in data so the game can run without an API key.
 */

(function () {
  var DATA = {};

  /* =========================================================
     CLUBS
  ========================================================= */

  var premierLeagueClubs = [
    "Arsenal",
    "Aston Villa",
    "Bournemouth",
    "Brentford",
    "Brighton",
    "Chelsea",
    "Crystal Palace",
    "Everton",
    "Fulham",
    "Ipswich Town",
    "Leicester City",
    "Liverpool",
    "Manchester City",
    "Manchester United",
    "Newcastle United",
    "Nottingham Forest",
    "Southampton",
    "Tottenham Hotspur",
    "West Ham United",
    "Wolverhampton Wanderers"
  ];

  var laLigaClubs = [
    "Athletic Club",
    "Atlético Madrid",
    "Barcelona",
    "Celta Vigo",
    "Espanyol",
    "Getafe",
    "Girona",
    "Las Palmas",
    "Leganés",
    "Mallorca",
    "Osasuna",
    "Rayo Vallecano",
    "Real Betis",
    "Real Madrid",
    "Real Sociedad",
    "Sevilla",
    "Valencia",
    "Valladolid",
    "Villarreal"
  ];

  var allClubs = premierLeagueClubs.concat(laLigaClubs);

  /* =========================================================
     CLUB RATINGS
  ========================================================= */

  var clubRatings = {
    "Arsenal": 88,
    "Aston Villa": 84,
    "Bournemouth": 78,
    "Brentford": 78,
    "Brighton": 79,
    "Chelsea": 84,
    "Crystal Palace": 77,
    "Everton": 76,
    "Fulham": 78,
    "Ipswich Town": 72,
    "Leicester City": 74,
    "Liverpool": 89,
    "Manchester City": 91,
    "Manchester United": 83,
    "Newcastle United": 82,
    "Nottingham Forest": 76,
    "Southampton": 73,
    "Tottenham Hotspur": 84,
    "West Ham United": 79,
    "Wolverhampton Wanderers": 76,

    "Athletic Club": 81,
    "Atlético Madrid": 87,
    "Barcelona": 89,
    "Celta Vigo": 76,
    "Espanyol": 73,
    "Getafe": 75,
    "Girona": 80,
    "Las Palmas": 73,
    "Leganés": 72,
    "Mallorca": 76,
    "Osasuna": 76,
    "Rayo Vallecano": 75,
    "Real Betis": 80,
    "Real Madrid": 92,
    "Real Sociedad": 81,
    "Sevilla": 78,
    "Valencia": 77,
    "Valladolid": 72,
    "Villarreal": 81
  };

  /* =========================================================
     PLAYER DATABASE
  ========================================================= */

  var players = [];

  function addPlayer(id, name, position, rating, club, league, rarity) {
    players.push({
      id: id,
      name: name,
      position: position,
      rating: rating,
      club: club,
      league: league,
      rarity: rarity || "common"
    });
  }

  /*
   * Premier League players
   */

  addPlayer("arsenal-saka", "Bukayo Saka", "FWD", 88, "Arsenal", "Premier League", "rare");
  addPlayer("arsenal-odegaard", "Martin Ødegaard", "MID", 88, "Arsenal", "Premier League", "rare");
  addPlayer("arsenal-rice", "Declan Rice", "MID", 87, "Arsenal", "Premier League", "rare");
  addPlayer("arsenal-saliba", "William Saliba", "DEF", 87, "Arsenal", "Premier League", "rare");
  addPlayer("arsenal-gabriel", "Gabriel Magalhães", "DEF", 86, "Arsenal", "Premier League", "rare");
  addPlayer("arsenal-raya", "David Raya", "GK", 85, "Arsenal", "Premier League", "rare");

  addPlayer("villa-watkins", "Ollie Watkins", "FWD", 85, "Aston Villa", "Premier League", "rare");
  addPlayer("villa-martinez", "Emiliano Martínez", "GK", 86, "Aston Villa", "Premier League", "rare");
  addPlayer("villa-rogers", "Morgan Rogers", "MID", 82, "Aston Villa", "Premier League", "rare");
  addPlayer("villa-tielemans", "Youri Tielemans", "MID", 82, "Aston Villa", "Premier League", "rare");
  addPlayer("villa-torres", "Pau Torres", "DEF", 82, "Aston Villa", "Premier League", "rare");
  addPlayer("villa-konsa", "Ezri Konsa", "DEF", 83, "Aston Villa", "Premier League", "rare");

  addPlayer("bournemouth-solanke", "Dominic Solanke", "FWD", 82, "Bournemouth", "Premier League", "rare");
  addPlayer("bournemouth-kepa", "Kepa Arrizabalaga", "GK", 80, "Bournemouth", "Premier League", "common");
  addPlayer("bournemouth-semenyo", "Antoine Semenyo", "FWD", 79, "Bournemouth", "Premier League", "common");
  addPlayer("bournemouth-cook", "Lewis Cook", "MID", 78, "Bournemouth", "Premier League", "common");
  addPlayer("bournemouth-senesi", "Marcos Senesi", "DEF", 79, "Bournemouth", "Premier League", "common");
  addPlayer("bournemouth-kerkez", "Milos Kerkez", "DEF", 80, "Bournemouth", "Premier League", "common");

  addPlayer("brentford-mbeumo", "Bryan Mbeumo", "FWD", 83, "Brentford", "Premier League", "rare");
  addPlayer("brentford-wissa", "Yoane Wissa", "FWD", 81, "Brentford", "Premier League", "rare");
  addPlayer("brentford-jensen", "Mathias Jensen", "MID", 78, "Brentford", "Premier League", "common");
  addPlayer("brentford-norgaard", "Christian Nørgaard", "MID", 80, "Brentford", "Premier League", "common");
  addPlayer("brentford-pinnock", "Ethan Pinnock", "DEF", 79, "Brentford", "Premier League", "common");
  addPlayer("brentford-flekken", "Mark Flekken", "GK", 78, "Brentford", "Premier League", "common");

  addPlayer("brighton-mitoma", "Kaoru Mitoma", "FWD", 82, "Brighton", "Premier League", "rare");
  addPlayer("brighton-minteh", "Yankuba Minteh", "FWD", 79, "Brighton", "Premier League", "common");
  addPlayer("brighton-pedro", "João Pedro", "FWD", 81, "Brighton", "Premier League", "rare");
  addPlayer("brighton-baleba", "Carlos Baleba", "MID", 80, "Brighton", "Premier League", "common");
  addPlayer("brighton-dunk", "Lewis Dunk", "DEF", 78, "Brighton", "Premier League", "common");
  addPlayer("brighton-verbruggen", "Bart Verbruggen", "GK", 78, "Brighton", "Premier League", "common");

  addPlayer("chelsea-palmer", "Cole Palmer", "MID", 89, "Chelsea", "Premier League", "rare");
  addPlayer("chelsea-jackson", "Nicolas Jackson", "FWD", 82, "Chelsea", "Premier League", "rare");
  addPlayer("chelsea-caicedo", "Moisés Caicedo", "MID", 85, "Chelsea", "Premier League", "rare");
  addPlayer("chelsea-fernandez", "Enzo Fernández", "MID", 85, "Chelsea", "Premier League", "rare");
  addPlayer("chelsea-colwill", "Levi Colwill", "DEF", 82, "Chelsea", "Premier League", "rare");
  addPlayer("chelsea-sanchez", "Robert Sánchez", "GK", 78, "Chelsea", "Premier League", "common");

  addPlayer("palace-eze", "Eberechi Eze", "MID", 84, "Crystal Palace", "Premier League", "rare");
  addPlayer("palace-mateta", "Jean-Philippe Mateta", "FWD", 82, "Crystal Palace", "Premier League", "rare");
  addPlayer("palace-wharton", "Adam Wharton", "MID", 80, "Crystal Palace", "Premier League", "common");
  addPlayer("palace-henderson", "Dean Henderson", "GK", 79, "Crystal Palace", "Premier League", "common");
  addPlayer("palace-guehi", "Marc Guéhi", "DEF", 82, "Crystal Palace", "Premier League", "rare");
  addPlayer("palace-munoz", "Daniel Muñoz", "DEF", 79, "Crystal Palace", "Premier League", "common");

  addPlayer("everton-pickford", "Jordan Pickford", "GK", 84, "Everton", "Premier League", "rare");
  addPlayer("everton-calvert-lewin", "Dominic Calvert-Lewin", "FWD", 78, "Everton", "Premier League", "common");
  addPlayer("everton-mcginn", "James Garner", "MID", 77, "Everton", "Premier League", "common");
  addPlayer("everton-tarkowski", "James Tarkowski", "DEF", 79, "Everton", "Premier League", "common");
  addPlayer("everton-branthwaite", "Jarrad Branthwaite", "DEF", 82, "Everton", "Premier League", "rare");
  addPlayer("everton-harrison", "Jack Harrison", "FWD", 77, "Everton", "Premier League", "common");

  addPlayer("fulham-igw", "Alex Iwobi", "MID", 79, "Fulham", "Premier League", "common");
  addPlayer("fulham-robinson", "Antonee Robinson", "DEF", 80, "Fulham", "Premier League", "common");
  addPlayer("fulham-palhinha", "João Palhinha", "MID", 84, "Fulham", "Premier League", "rare");
  addPlayer("fulham-leno", "Bernd Leno", "GK", 80, "Fulham", "Premier League", "common");
  addPlayer("fulham-muniz", "Rodrigo Muniz", "FWD", 79, "Fulham", "Premier League", "common");
  addPlayer("fulham-andersen", "Joachim Andersen", "DEF", 81, "Fulham", "Premier League", "rare");

  addPlayer("ipswich-delap", "Liam Delap", "FWD", 78, "Ipswich Town", "Premier League", "common");
  addPlayer("ipswich-hutchinson", "Omari Hutchinson", "MID", 78, "Ipswich Town", "Premier League", "common");
  addPlayer("ipswich-morsy", "Sam Morsy", "MID", 74, "Ipswich Town", "Premier League", "common");
  addPlayer("ipswich-tuanzebe", "Axel Tuanzebe", "DEF", 74, "Ipswich Town", "Premier League", "common");
  addPlayer("ipswich-walton", "Christian Walton", "GK", 73, "Ipswich Town", "Premier League", "common");
  addPlayer("ipswich-davis", "Leif Davis", "DEF", 76, "Ipswich Town", "Premier League", "common");

  addPlayer("leicester-vardy", "Jamie Vardy", "FWD", 78, "Leicester City", "Premier League", "common");
  addPlayer("leicester-fatawu", "Abdul Fatawu", "FWD", 76, "Leicester City", "Premier League", "common");
  addPlayer("leicester-faes", "Wout Faes", "DEF", 76, "Leicester City", "Premier League", "common");
  addPlayer("leicester-skipper", "Harry Winks", "MID", 77, "Leicester City", "Premier League", "common");
  addPlayer("leicester-herman", "Mads Hermansen", "GK", 76, "Leicester City", "Premier League", "common");
  addPlayer("leicester-dewsbury", "Kiernan Dewsbury-Hall", "MID", 80, "Leicester City", "Premier League", "common");

  addPlayer("liverpool-salah", "Mohamed Salah", "FWD", 90, "Liverpool", "Premier League", "rare");
  addPlayer("liverpool-van-dijk", "Virgil van Dijk", "DEF", 89, "Liverpool", "Premier League", "rare");
  addPlayer("liverpool-alisson", "Alisson", "GK", 89, "Liverpool", "Premier League", "rare");
  addPlayer("liverpool-alexanderarnold", "Trent Alexander-Arnold", "DEF", 87, "Liverpool", "Premier League", "rare");
  addPlayer("liverpool-macallister", "Alexis Mac Allister", "MID", 87, "Liverpool", "Premier League", "rare");
  addPlayer("liverpool-diaz", "Luis Díaz", "FWD", 86, "Liverpool", "Premier League", "rare");

  addPlayer("city-haaland", "Erling Haaland", "FWD", 91, "Manchester City", "Premier League", "rare");
  addPlayer("city-debruyne", "Kevin De Bruyne", "MID", 90, "Manchester City", "Premier League", "rare");
  addPlayer("city-rodri", "Rodri", "MID", 91, "Manchester City", "Premier League", "rare");
  addPlayer("city-foden", "Phil Foden", "MID", 89, "Manchester City", "Premier League", "rare");
  addPlayer("city-dias", "Rúben Dias", "DEF", 87, "Manchester City", "Premier League", "rare");
  addPlayer("city-ederson", "Ederson", "GK", 88, "Manchester City", "Premier League", "rare");

  addPlayer("united-fernandes", "Bruno Fernandes", "MID", 87, "Manchester United", "Premier League", "rare");
  addPlayer("united-yoro", "Leny Yoro", "DEF", 78, "Manchester United", "Premier League", "common");
  addPlayer("united-martinez", "Lisandro Martínez", "DEF", 84, "Manchester United", "Premier League", "rare");
  addPlayer("united-mainoo", "Kobbie Mainoo", "MID", 82, "Manchester United", "Premier League", "rare");
  addPlayer("united-amad", "Amad Diallo", "FWD", 79, "Manchester United", "Premier League", "common");
  addPlayer("united-onana", "André Onana", "GK", 80, "Manchester United", "Premier League", "common");

  addPlayer("newcastle-isak", "Alexander Isak", "FWD", 88, "Newcastle United", "Premier League", "rare");
  addPlayer("newcastle-gordon", "Anthony Gordon", "FWD", 84, "Newcastle United", "Premier League", "rare");
  addPlayer("newcastle-guimaraes", "Bruno Guimarães", "MID", 86, "Newcastle United", "Premier League", "rare");
  addPlayer("newcastle-tonali", "Sandro Tonali", "MID", 84, "Newcastle United", "Premier League", "rare");
  addPlayer("newcastle-burn", "Dan Burn", "DEF", 78, "Newcastle United", "Premier League", "common");
  addPlayer("newcastle-pope", "Nick Pope", "GK", 82, "Newcastle United", "Premier League", "rare");

  addPlayer("forest-gibbswhite", "Morgan Gibbs-White", "MID", 82, "Nottingham Forest", "Premier League", "rare");
  addPlayer("forest-wood", "Chris Wood", "FWD", 80, "Nottingham Forest", "Premier League", "common");
  addPlayer("forest-elanga", "Anthony Elanga", "FWD", 80, "Nottingham Forest", "Premier League", "common");
  addPlayer("forest-murillo", "Murillo", "DEF", 80, "Nottingham Forest", "Premier League", "common");
  addPlayer("forest-yates", "Ryan Yates", "MID", 76, "Nottingham Forest", "Premier League", "common");
  addPlayer("forest-sels", "Matz Sels", "GK", 78, "Nottingham Forest", "Premier League", "common");

  addPlayer("southampton-armstrong", "Adam Armstrong", "FWD", 76, "Southampton", "Premier League", "common");
  addPlayer("southampton-downes", "Flynn Downes", "MID", 76, "Southampton", "Premier League", "common");
  addPlayer("southampton-manning", "Ryan Manning", "DEF", 74, "Southampton", "Premier League", "common");
  addPlayer("southampton-bednarek", "Jan Bednarek", "DEF", 75, "Southampton", "Premier League", "common");
  addPlayer("southampton-ramsdale", "Aaron Ramsdale", "GK", 80, "Southampton", "Premier League", "common");
  addPlayer("southampton-dibling", "Tyler Dibling", "FWD", 77, "Southampton", "Premier League", "common");

  addPlayer("spurs-son", "Son Heung-min", "FWD", 88, "Tottenham Hotspur", "Premier League", "rare");
  addPlayer("spurs-maddison", "James Maddison", "MID", 84, "Tottenham Hotspur", "Premier League", "rare");
  addPlayer("spurs-romero", "Cristian Romero", "DEF", 86, "Tottenham Hotspur", "Premier League", "rare");
  addPlayer("spurs-vicario", "Guglielmo Vicario", "GK", 82, "Tottenham Hotspur", "Premier League", "rare");
  addPlayer("spurs-kulusevski", "Dejan Kulusevski", "MID", 83, "Tottenham Hotspur", "Premier League", "rare");
  addPlayer("spurs-udogie", "Destiny Udogie", "DEF", 80, "Tottenham Hotspur", "Premier League", "common");

  addPlayer("westham-bowen", "Jarrod Bowen", "FWD", 84, "West Ham United", "Premier League", "rare");
  addPlayer("westham-paqueta", "Lucas Paquetá", "MID", 84, "West Ham United", "Premier League", "rare");
  addPlayer("westham-kudus", "Mohammed Kudus", "FWD", 84, "West Ham United", "Premier League", "rare");
  addPlayer("westham-areola", "Alphonse Areola", "GK", 79, "West Ham United", "Premier League", "common");
  addPlayer("westham-kilman", "Max Kilman", "DEF", 79, "West Ham United", "Premier League", "common");
  addPlayer("westham-wanbissaka", "Aaron Wan-Bissaka", "DEF", 78, "West Ham United", "Premier League", "common");

  addPlayer("wolves-cunha", "Matheus Cunha", "FWD", 84, "Wolverhampton Wanderers", "Premier League", "rare");
  addPlayer("wolves-aitnouri", "Rayan Aït-Nouri", "DEF", 79, "Wolverhampton Wanderers", "Premier League", "common");
  addPlayer("wolves-lemina", "Mario Lemina", "MID", 77, "Wolverhampton Wanderers", "Premier League", "common");
  addPlayer("wolves-sa", "José Sá", "GK", 78, "Wolverhampton Wanderers", "Premier League", "common");
  addPlayer("wolves-collins", "Nathan Collins", "DEF", 76, "Wolverhampton Wanderers", "Premier League", "common");
  addPlayer("wolves-bellegarde", "Jean-Ricner Bellegarde", "MID", 76, "Wolverhampton Wanderers", "Premier League", "common");

  /*
   * LaLiga players
   */

  addPlayer("athletic-nico", "Nico Williams", "FWD", 86, "Athletic Club", "LaLiga", "rare");
  addPlayer("athletic-inaki", "Iñaki Williams", "FWD", 82, "Athletic Club", "LaLiga", "rare");
  addPlayer("athletic-sancet", "Oihan Sancet", "MID", 82, "Athletic Club", "LaLiga", "rare");
  addPlayer("athletic-yuri", "Yuri Berchiche", "DEF", 78, "Athletic Club", "LaLiga", "common");
  addPlayer("athletic-vivian", "Dani Vivian", "DEF", 80, "Athletic Club", "LaLiga", "common");
  addPlayer("athletic-simon", "Unai Simón", "GK", 84, "Athletic Club", "LaLiga", "rare");

  addPlayer("atleti-griezmann", "Antoine Griezmann", "FWD", 88, "Atlético Madrid", "LaLiga", "rare");
  addPlayer("atleti-alvarez", "Julián Álvarez", "FWD", 87, "Atlético Madrid", "LaLiga", "rare");
  addPlayer("atleti-depaul", "Rodrigo De Paul", "MID", 84, "Atlético Madrid", "LaLiga", "rare");
  addPlayer("atleti-koke", "Koke", "MID", 82, "Atlético Madrid", "LaLiga", "rare");
  addPlayer("atleti-oblak", "Jan Oblak", "GK", 89, "Atlético Madrid", "LaLiga", "rare");
  addPlayer("atleti-gimenez", "José María Giménez", "DEF", 84, "Atlético Madrid", "LaLiga", "rare");

  addPlayer("barca-yamal", "Lamine Yamal", "FWD", 90, "Barcelona", "LaLiga", "rare");
  addPlayer("barca-pedri", "Pedri", "MID", 88, "Barcelona", "LaLiga", "rare");
  addPlayer("barca-lewandowski", "Robert Lewandowski", "FWD", 89, "Barcelona", "LaLiga", "rare");
  addPlayer("barca-raphinha", "Raphinha", "FWD", 87, "Barcelona", "LaLiga", "rare");
  addPlayer("barca-dejong", "Frenkie de Jong", "MID", 86, "Barcelona", "LaLiga", "rare");
  addPlayer("barca-araujo", "Ronald Araújo", "DEF", 86, "Barcelona", "LaLiga", "rare");

  addPlayer("celta-aspas", "Iago Aspas", "FWD", 80, "Celta Vigo", "LaLiga", "common");
  addPlayer("celta-mingueza", "Óscar Mingueza", "DEF", 78, "Celta Vigo", "LaLiga", "common");
  addPlayer("celta-bamba", "Jonathan Bamba", "FWD", 78, "Celta Vigo", "LaLiga", "common");
  addPlayer("celta-belanova", "Marcos Alonso", "DEF", 77, "Celta Vigo", "LaLiga", "common");
  addPlayer("celta-moriba", "Ilaix Moriba", "MID", 75, "Celta Vigo", "LaLiga", "common");
  addPlayer("celta-guaita", "Vicente Guaita", "GK", 77, "Celta Vigo", "LaLiga", "common");

  addPlayer("espanyol-puado", "Javi Puado", "FWD", 77, "Espanyol", "LaLiga", "common");
  addPlayer("espanyol-jofre", "Jofre Carreras", "MID", 75, "Espanyol", "LaLiga", "common");
  addPlayer("espanyol-cabrera", "Leandro Cabrera", "DEF", 75, "Espanyol", "LaLiga", "common");
  addPlayer("espanyol-olivan", "Brian Oliván", "DEF", 74, "Espanyol", "LaLiga", "common");
  addPlayer("espanyol-veliz", "Alejo Véliz", "FWD", 76, "Espanyol", "LaLiga", "common");
  addPlayer("espanyol-garcia", "Joan García", "GK", 77, "Espanyol", "LaLiga", "common");

  addPlayer("getafe-mayoral", "Borja Mayoral", "FWD", 80, "Getafe", "LaLiga", "common");
  addPlayer("getafe-milla", "Luis Milla", "MID", 77, "Getafe", "LaLiga", "common");
  addPlayer("getafe-aramarri", "Djené", "DEF", 77, "Getafe", "LaLiga", "common");
  addPlayer("getafe-urdales", "Carles Pérez", "FWD", 76, "Getafe", "LaLiga", "common");
  addPlayer("getafe-alderete", "Omar Alderete", "DEF", 77, "Getafe", "LaLiga", "common");
  addPlayer("getafe-soria", "David Soria", "GK", 78, "Getafe", "LaLiga", "common");

  addPlayer("girona-dovbyk", "Artem Dovbyk", "FWD", 85, "Girona", "LaLiga", "rare");
  addPlayer("girona-savinho", "Savinho", "FWD", 83, "Girona", "LaLiga", "rare");
  addPlayer("girona-gutierrez", "Miguel Gutiérrez", "DEF", 82, "Girona", "LaLiga", "rare");
  addPlayer("girona-martin", "Iván Martín", "MID", 79, "Girona", "LaLiga", "common");
  addPlayer("girona-yangel", "Yangel Herrera", "MID", 79, "Girona", "LaLiga", "common");
  addPlayer("girona-gazzaniga", "Paulo Gazzaniga", "GK", 79, "Girona", "LaLiga", "common");

  addPlayer("laspalmas-moleiro", "Alberto Moleiro", "MID", 79, "Las Palmas", "LaLiga", "common");
  addPlayer("laspalmas-sandros", "Sandro Ramírez", "FWD", 76, "Las Palmas", "LaLiga", "common");
  addPlayer("laspalmas-kirian", "Kirian Rodríguez", "MID", 77, "Las Palmas", "LaLiga", "common");
  addPlayer("laspalmas-marmol", "Mika Mármol", "DEF", 76, "Las Palmas", "LaLiga", "common");
  addPlayer("laspalmas-mcKenna", "Scott McKenna", "DEF", 75, "Las Palmas", "LaLiga", "common");
  addPlayer("laspalmas-cillessen", "Jasper Cillessen", "GK", 76, "Las Palmas", "LaLiga", "common");

  addPlayer("leganes-raba", "Dani Raba", "MID", 76, "Leganés", "LaLiga", "common");
  addPlayer("leganes-miguel", "Miguel de la Fuente", "FWD", 75, "Leganés", "LaLiga", "common");
  addPlayer("leganes-brasanac", "Darko Brašanac", "MID", 74, "Leganés", "LaLiga", "common");
  addPlayer("leganes-serantes", "Sergio González", "DEF", 74, "Leganés", "LaLiga", "common");
  addPlayer("leganes-soriano", "Juan Soriano", "GK", 75, "Leganés", "LaLiga", "common");
  addPlayer("leganes-tapia", "Renato Tapia", "MID", 76, "Leganés", "LaLiga", "common");

  addPlayer("mallorca-muriqi", "Vedat Muriqi", "FWD", 82, "Mallorca", "LaLiga", "rare");
  addPlayer("mallorca-darder", "Sergi Darder", "MID", 81, "Mallorca", "LaLiga", "rare");
  addPlayer("mallorca-llabres", "Javi Llabrés", "FWD", 75, "Mallorca", "LaLiga", "common");
  addPlayer("mallorca-raillo", "Antonio Raíllo", "DEF", 79, "Mallorca", "LaLiga", "common");
  addPlayer("mallorca-maffeo", "Pablo Maffeo", "DEF", 77, "Mallorca", "LaLiga", "common");
  addPlayer("mallorca-greve", "Dominik Greif", "GK", 77, "Mallorca", "LaLiga", "common");

  addPlayer("osasuna-budimir", "Ante Budimir", "FWD", 81, "Osasuna", "LaLiga", "rare");
  addPlayer("osasuna-aimar", "Aimar Oroz", "MID", 79, "Osasuna", "LaLiga", "common");
  addPlayer("osasuna-torro", "Lucas Torró", "MID", 78, "Osasuna", "LaLiga", "common");
  addPlayer("osasuna-crociata", "Enzo Boyomo", "DEF", 76, "Osasuna", "LaLiga", "common");
  addPlayer("osasuna-castellanos", "Rubén Peña", "DEF", 75, "Osasuna", "LaLiga", "common");
  addPlayer("osasuna-herrera", "Sergio Herrera", "GK", 78, "Osasuna", "LaLiga", "common");

  addPlayer("rayo-palazon", "Isi Palazón", "MID", 80, "Rayo Vallecano", "LaLiga", "common");
  addPlayer("rayo-defrutos", "Jorge de Frutos", "FWD", 78, "Rayo Vallecano", "LaLiga", "common");
  addPlayer("rayo-alvaro", "Álvaro García", "FWD", 78, "Rayo Vallecano", "LaLiga", "common");
  addPlayer("rayo-lejeune", "Florian Lejeune", "DEF", 79, "Rayo Vallecano", "LaLiga", "common");
  addPlayer("rayo-espino", "Alfonso Espino", "DEF", 75, "Rayo Vallecano", "LaLiga", "common");
  addPlayer("rayo-batalla", "Augusto Batalla", "GK", 76, "Rayo Vallecano", "LaLiga", "common");

  addPlayer("betis-isco", "Isco", "MID", 86, "Real Betis", "LaLiga", "rare");
  addPlayer("betis-fekir", "Nabil Fekir", "MID", 82, "Real Betis", "LaLiga", "rare");
  addPlayer("betis-fornals", "Pablo Fornals", "MID", 81, "Real Betis", "LaLiga", "rare");
  addPlayer("betis-ruibal", "Aitor Ruibal", "DEF", 76, "Real Betis", "LaLiga", "common");
  addPlayer("betis-bartra", "Marc Bartra", "DEF", 78, "Real Betis", "LaLiga", "common");
  addPlayer("betis-silva", "Rui Silva", "GK", 78, "Real Betis", "LaLiga", "common");

  addPlayer("madrid-vinicius", "Vinícius Júnior", "FWD", 91, "Real Madrid", "LaLiga", "rare");
  addPlayer("madrid-bellingham", "Jude Bellingham", "MID", 91, "Real Madrid", "LaLiga", "rare");
  addPlayer("madrid-mbappe", "Kylian Mbappé", "FWD", 92, "Real Madrid", "LaLiga", "rare");
  addPlayer("madrid-valverde", "Federico Valverde", "MID", 89, "Real Madrid", "LaLiga", "rare");
  addPlayer("madrid-courtois", "Thibaut Courtois", "GK", 90, "Real Madrid", "LaLiga", "rare");
  addPlayer("madrid-rudiger", "Antonio Rüdiger", "DEF", 87, "Real Madrid", "LaLiga", "rare");

  addPlayer("sociedad-kubo", "Takefusa Kubo", "FWD", 84, "Real Sociedad", "LaLiga", "rare");
  addPlayer("sociedad-odegaard", "Mikel Oyarzabal", "FWD", 84, "Real Sociedad", "LaLiga", "rare");
  addPlayer("sociedad-merino", "Mikel Merino", "MID", 84, "Real Sociedad", "LaLiga", "rare");
  addPlayer("sociedad-zubimendi", "Martín Zubimendi", "MID", 85, "Real Sociedad", "LaLiga", "rare");
  addPlayer("sociedad-le-normand", "Robin Le Normand", "DEF", 82, "Real Sociedad", "LaLiga", "rare");
  addPlayer("sociedad-remiro", "Álex Remiro", "GK", 82, "Real Sociedad", "LaLiga", "rare");

  addPlayer("sevilla-ocampos", "Lucas Ocampos", "FWD", 80, "Sevilla", "LaLiga", "common");
  addPlayer("sevilla-sow", "Djibril Sow", "MID", 77, "Sevilla", "LaLiga", "common");
  addPlayer("sevilla-bade", "Loïc Badé", "DEF", 79, "Sevilla", "LaLiga", "common");
  addPlayer("sevilla-pedrosa", "Adrià Pedrosa", "DEF", 77, "Sevilla", "LaLiga", "common");
  addPlayer("sevilla-lukebakio", "Dodi Lukebakio", "FWD", 81, "Sevilla", "LaLiga", "rare");
  addPlayer("sevilla-nyland", "Ørjan Nyland", "GK", 77, "Sevilla", "LaLiga", "common");

  addPlayer("valencia-gaya", "José Gayà", "DEF", 82, "Valencia", "LaLiga", "rare");
  addPlayer("valencia-mamardashvili", "Giorgi Mamardashvili", "GK", 85, "Valencia", "LaLiga", "rare");
  addPlayer("valencia-javi-guerra", "Javi Guerra", "MID", 79, "Valencia", "LaLiga", "common");
  addPlayer("valencia-diego-lopez", "Diego López", "FWD", 77, "Valencia", "LaLiga", "common");
  addPlayer("valencia-tarrega", "Cristhian Mosquera", "DEF", 78, "Valencia", "LaLiga", "common");
  addPlayer("valencia-almeida", "André Almeida", "MID", 78, "Valencia", "LaLiga", "common");

  addPlayer("valladolid-raul-moro", "Raúl Moro", "FWD", 76, "Valladolid", "LaLiga", "common");
  addPlayer("valladolid-juma", "Juma Bah", "DEF", 74, "Valladolid", "LaLiga", "common");
  addPlayer("valladolid-monchu", "Monchu", "MID", 75, "Valladolid", "LaLiga", "common");
  addPlayer("valladolid-kenedy", "Kenedy", "FWD", 74, "Valladolid", "LaLiga", "common");
  addPlayer("valladolid-comert", "Eray Cömert", "DEF", 74, "Valladolid", "LaLiga", "common");
  addPlayer("valladolid-heinz", "Karl Hein", "GK", 75, "Valladolid", "LaLiga", "common");

  addPlayer("villarreal-baena", "Álex Baena", "MID", 84, "Villarreal", "LaLiga", "rare");
  addPlayer("villarreal-gerard", "Gerard Moreno", "FWD", 84, "Villarreal", "LaLiga", "rare");
  addPlayer("villarreal-pino", "Yeremy Pino", "FWD", 82, "Villarreal", "LaLiga", "rare");
  addPlayer("villarreal-parejo", "Dani Parejo", "MID", 81, "Villarreal", "LaLiga", "rare");
  addPlayer("villarreal-albiol", "Raúl Albiol", "DEF", 79, "Villarreal", "LaLiga", "common");
  addPlayer("villarreal-conde", "Diego Conde", "GK", 77, "Villarreal", "LaLiga", "common");

  /* =========================================================
     30 ICONS
  ========================================================= */

  var icons = [
    {
      id: "icon-pele",
      name: "Pelé",
      position: "FWD",
      rating: 98,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-maradona",
      name: "Diego Maradona",
      position: "MID",
      rating: 98,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-cruyff",
      name: "Johan Cruyff",
      position: "FWD",
      rating: 97,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-beckenbauer",
      name: "Franz Beckenbauer",
      position: "DEF",
      rating: 97,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-maldini",
      name: "Paolo Maldini",
      position: "DEF",
      rating: 97,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-zidane",
      name: "Zinedine Zidane",
      position: "MID",
      rating: 97,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-ronaldo",
      name: "Ronaldo Nazário",
      position: "FWD",
      rating: 98,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-ronaldinho",
      name: "Ronaldinho",
      position: "FWD",
      rating: 96,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-henry",
      name: "Thierry Henry",
      position: "FWD",
      rating: 96,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-xavi",
      name: "Xavi",
      position: "MID",
      rating: 96,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-iniesta",
      name: "Andrés Iniesta",
      position: "MID",
      rating: 96,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-beckham",
      name: "David Beckham",
      position: "MID",
      rating: 95,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-pirlo",
      name: "Andrea Pirlo",
      position: "MID",
      rating: 95,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-roberto-carlos",
      name: "Roberto Carlos",
      position: "DEF",
      rating: 96,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-cafu",
      name: "Cafu",
      position: "DEF",
      rating: 95,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-buffon",
      name: "Gianluigi Buffon",
      position: "GK",
      rating: 96,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-casillas",
      name: "Iker Casillas",
      position: "GK",
      rating: 95,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-yashin",
      name: "Lev Yashin",
      position: "GK",
      rating: 97,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-best",
      name: "George Best",
      position: "FWD",
      rating: 96,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-eusebio",
      name: "Eusébio",
      position: "FWD",
      rating: 97,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-van-basten",
      name: "Marco van Basten",
      position: "FWD",
      rating: 96,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-gullit",
      name: "Ruud Gullit",
      position: "MID",
      rating: 96,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-matthaus",
      name: "Lothar Matthäus",
      position: "MID",
      rating: 96,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-vieira",
      name: "Patrick Vieira",
      position: "MID",
      rating: 95,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-figo",
      name: "Luís Figo",
      position: "FWD",
      rating: 95,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-kaka",
      name: "Kaká",
      position: "MID",
      rating: 95,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-del-piero",
      name: "Alessandro Del Piero",
      position: "FWD",
      rating: 95,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-baresi",
      name: "Franco Baresi",
      position: "DEF",
      rating: 96,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-busquets",
      name: "Sergio Busquets",
      position: "MID",
      rating: 95,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    },
    {
      id: "icon-etoo",
      name: "Samuel Eto'o",
      position: "FWD",
      rating: 95,
      club: "Icons",
      league: "Icons",
      rarity: "icon"
    }
  ];

  /* =========================================================
     DATA API
  ========================================================= */

  DATA.getAllClubs = function () {
    return allClubs.slice();
  };

  DATA.getPremierLeagueClubs = function () {
    return premierLeagueClubs.slice();
  };

  DATA.getLaLigaClubs = function () {
    return laLigaClubs.slice();
  };

  DATA.getClubRating = function (club) {
    if (
      club &&
      Object.prototype.hasOwnProperty.call(clubRatings, club)
    ) {
      return clubRatings[club];
    }

    return 75;
  };

  DATA.getAllPlayers = function () {
    return players.slice();
  };

  DATA.getIcons = function () {
    return icons.slice();
  };

  DATA.getPlayersByClub = function (club) {
    if (!club) {
      return [];
    }

    return players.filter(function (player) {
      return player.club === club;
    });
  };

  DATA.getPlayersByRarity = function (rarity) {
    if (!rarity) {
      return [];
    }

    var target = String(rarity).toLowerCase();

    if (target === "icon") {
      return icons.slice();
    }

    return players.filter(function (player) {
      return player.rarity === target;
    });
  };

  DATA.getPlayerById = function (id) {
    if (!id) {
      return null;
    }

    var target = String(id);

    for (var i = 0; i < players.length; i += 1) {
      if (String(players[i].id) === target) {
        return players[i];
      }
    }

    for (var j = 0; j < icons.length; j += 1) {
      if (String(icons[j].id) === target) {
        return icons[j];
      }
    }

    return null;
  };

  DATA.getRandomPlayer = function (rarity) {
    var pool;

    if (rarity) {
      pool = DATA.getPlayersByRarity(rarity);
    } else {
      pool = players.concat(icons);
    }

    if (!pool.length) {
      return null;
    }

    return pool[Math.floor(Math.random() * pool.length)];
  };

  /* =========================================================
     GLOBAL EXPORTS
  ========================================================= */

  window.SLS_PLAYER_DATA = DATA;

  /*
   * game.js expects these directly.
   */
  window.getPlayersByClub = DATA.getPlayersByClub;
  window.getClubRating = DATA.getClubRating;

  /*
   * Make the database available through GAME_CONFIG too.
   * This keeps playerData.js compatible with config.js.
   */
  window.GAME_CONFIG = window.GAME_CONFIG || {};

  window.GAME_CONFIG.premierLeagueClubs =
    premierLeagueClubs.slice();

  window.GAME_CONFIG.laLigaClubs =
    laLigaClubs.slice();

  window.GAME_CONFIG.clubs =
    allClubs.slice();

  window.GAME_CONFIG.clubRatings =
    Object.assign({}, clubRatings);

  window.GAME_CONFIG.players =
    players.slice();

  window.GAME_CONFIG.icons =
    icons.slice();

  /*
   * Helpful debug information.
   */
  console.info(
    "Super League Soccer playerData.js loaded:",
    players.length,
    "players +",
    icons.length,
    "icons."
  );
})();
```
