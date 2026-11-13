// The reels. Every real film in movies.js is filed under one option on each of the
// first three reels (who, where, what). The fourth reel, the mistake, only feeds the
// parody incident report. The extra fields on each option are joke material.

const WHO = [
  { id: "friends", label: "A Group of Friends", subj: "Five college friends", roster: ["The Jock", "The Skeptic", "The Couple", "The Funny One", "The One Who Knows the Legend"], survivor: "The Quiet One" },
  { id: "family", label: "A Family in a New House", subj: "A family of four", roster: ["Dad, who doesn't believe any of it", "The Realtor", "The Teenager", "The Contractor", "The Priest They Called Too Late"], survivor: "Mom" },
  { id: "couple", label: "A Couple", subj: "A couple on a make-or-break getaway", roster: ["The Friendly Neighbor", "The Local Sheriff", "The Ex Who Dropped By", "Their Relationship", "The Husband"], survivor: "The Wife" },
  { id: "woman", label: "A Woman on Her Own", subj: "A babysitter", roster: ["The Boyfriend Who Snuck Over", "The Best Friend on the Phone", "The First Cop", "The Second Cop", "The Neighbor With the Hedge Trimmer"], survivor: "The Babysitter" },
  { id: "kids", label: "Some Kids on Bikes", subj: "Four kids on bikes", roster: ["The Bully", "The Bully's Friend", "The Gym Teacher", "The Sheriff Who Wouldn't Listen", "The Town's Only Adult With Answers"], survivor: "All Four Kids, Somehow" },
  { id: "experts", label: "Paranormal Experts", subj: "A team of paranormal investigators", roster: ["The Cameraman", "The Tech Guy", "The Skeptical Professor", "The Medium", "The Younger Priest"], survivor: "The Older Priest" },
  { id: "crew", label: "A Crew on a Job", subj: "A seven-person research crew", roster: ["The One Two Days From Retirement", "The Company Man", "The Rookie", "The Medic", "The Captain"], survivor: "The Engineer Nobody Listened To" },
  { id: "town", label: "An Entire Town", subj: "The residents of a quiet town", roster: ["The Town Drunk Who Saw It First", "The Mayor Who Kept the Beaches Open", "The Deputy", "Half of Main Street", "The Scientist From Out of Town"], survivor: "The Sheriff" },
  { id: "filmmakers", label: "People With Cameras", subj: "A student documentary crew", roster: ["The Sound Guy", "The Producer", "The Local Guide", "The Director", "The Battery"], survivor: "The Footage" },
  { id: "cops", label: "Detectives", subj: "Two mismatched detectives", roster: ["The First Witness", "The Coroner", "The Rookie Partner", "The Captain Who Wanted Results", "The Veteran, One Case From Retirement"], survivor: "The One Who Broke the Rules" },
  { id: "travelers", label: "Travelers Who Stopped", subj: "A van of road-trippers", roster: ["The Hitchhiker", "The Driver", "The Navigator", "The One Who Wanted to Turn Back", "The Gas Station Attendant"], survivor: "The One in the Back Seat" },
  { id: "loner", label: "A Man With a Past", subj: "A novelist seeking solitude", roster: ["His Agent", "The Caretaker", "The Bartender", "His Typewriter", "His Grip on Events"], survivor: "Unclear" },
  { id: "other", label: "Someone Oddly Specific", subj: "A regional sales team on a retreat", roster: ["The Team-Building Facilitator", "Gary From Accounts", "The Intern", "The Regional Manager", "Morale"], survivor: "The Temp" },
];

const WHERE = [
  { id: "house", label: "A House That Was Too Cheap", at: "at a five-bedroom house that was priced to move", names: ["1428 Marrow Lane", "The Ashgrove House", "Number Nine"] },
  { id: "cabin", label: "A Cabin in the Woods", at: "at a cabin with no neighbors and one road out", names: ["Hollow Pines", "Blackroot Cabin", "Mile Marker 13"] },
  { id: "camp", label: "A Summer Camp", at: "at a summer camp that reopened this year for some reason", names: ["Camp Whispering Oak", "Camp Stillwater", "Camp Lake Dismal"] },
  { id: "smalltown", label: "A Small Town With a Secret", at: "in a small town where everyone stops talking when you walk in", names: ["Harrow Falls", "Dunmore", "Quiet Creek"] },
  { id: "suburb", label: "The Suburbs", at: "on a cul-de-sac with excellent schools", names: ["Maple Court", "Sycamore Drive", "Willow Bend"] },
  { id: "city", label: "The Big City", at: "in an apartment building with a very reasonable rent", names: ["The Bramford Arms", "Apartment 7B", "The Night Bus"] },
  { id: "institution", label: "A Hospital or Asylum", at: "in an asylum that closed in 1974 and kept the files", names: ["Greymoor Asylum", "Ward Six", "St. Agatha's"] },
  { id: "school", label: "A School", at: "at a high school the week of prom", names: ["Westbrook High", "Dormitory C", "Prom Night"] },
  { id: "hotel", label: "A Hotel or Motel", at: "at a roadside motel with one car in the lot", names: ["The Vacancy Inn", "Room 237B", "The Lakeview Motel"] },
  { id: "road", label: "The Middle of Nowhere", at: "forty miles past the last gas station", names: ["Route 9", "Dead End Road", "The Shortcut"] },
  { id: "water", label: "On or Near the Water", at: "on an island the ferry visits twice a week", names: ["Blackwater Island", "The Lake", "Low Tide"] },
  { id: "remote", label: "Somewhere Very Remote", at: "at a research station eleven hours from help", names: ["Station Nine", "The Deep", "Outpost 31B"] },
  { id: "abroad", label: "An Old Country Village", at: "in a village abroad where the inn has no guests and many crosses", names: ["Valderheim", "The Old Abbey", "Castle Morvane"] },
  { id: "other", label: "Somewhere Unexpected", at: "in a furniture showroom after closing", names: ["Aisle 13", "The Showroom", "Level B2"] },
];

const WHAT = [
  { id: "slasher", label: "A Masked Killer", a: "a masked man who walks everywhere and still gets there first", things: ["The Stitcher", "The Night Clerk", "Mr. Quiet"] },
  { id: "ghost", label: "A Ghost With a Grievance", a: "a ghost with a grievance and no sense of time", things: ["The Woman in the Hall", "The Tenant", "What Stayed"] },
  { id: "demon", label: "A Demon", a: "a demon with a long name and a short temper", things: ["The Summoning", "The Invitation", "Possession Clause"] },
  { id: "zombie", label: "The Infected", a: "a fast-moving outbreak with poor manners", things: ["The Outbreak", "Day Nine", "The Hungry"] },
  { id: "vampire", label: "A Vampire", a: "a very old gentleman who never eats at dinner", things: ["The Count's Guest", "Nightfall", "The Invitation In"] },
  { id: "werewolf", label: "A Werewolf", a: "a neighbor with a monthly scheduling conflict", things: ["Full Moon", "The Change", "The Howling Hour"] },
  { id: "creature", label: "A Creature", a: "something large that the locals refuse to name", things: ["The Thing in the Lake", "It Hunts", "The Burrow"] },
  { id: "alien", label: "Something From Space", a: "a visitor from very far away with no interest in dialogue", things: ["The Signal", "The Arrival", "Not of This Earth, Again"] },
  { id: "cult", label: "A Cult or Coven", a: "a welcoming community with matching robes", things: ["The Gathering", "The Harvest", "The Neighbors"] },
  { id: "object", label: "A Doll or Cursed Object", a: "a porcelain doll that is never where they left it", things: ["The Doll", "The Music Box", "The Tape"] },
  { id: "mind", label: "Possibly Their Own Mind", a: "something that may or may not be happening", things: ["The Sleepless", "What She Saw", "The Quiet Room"] },
  { id: "humans", label: "Other People", a: "a family who has lived out here a long time and likes it", things: ["The Hosts", "The Neighbors", "Supper"] },
  { id: "curse", label: "A Curse That Follows", a: "a curse with a strict seven-day schedule", things: ["It Passes", "Seven Days", "The Chain Letter"] },
  { id: "science", label: "An Experiment Gone Wrong", a: "the result of a grant that should not have been renewed", things: ["Subject Zero", "The Trial", "Side Effects"] },
  { id: "other", label: "Something Oddly Specific", a: "a haunted item of patio furniture", things: ["The Recliner", "It Came From the Garage", "The Timeshare"] },
];

// Reel four: contributing negligence. `did` finishes "they ...", `note` is the adjuster's finding.
const MISTAKES = [
  { label: "They Split Up", did: "split up to cover more ground", note: "The insured parties separated voluntarily to 'cover more ground.'" },
  { label: "They Read the Latin Aloud", did: "read the Latin out loud, twice, for pronunciation", note: "The policyholder read an incantation aloud after being asked not to by the book itself." },
  { label: "They Ignored the Gas Station Guy", did: "ignored a detailed warning from a man at a gas station", note: "The insured were warned, verbally and at length, by a local man at a gas station." },
  { label: "They Went Back for the Cat", did: "went back inside for the cat", note: "The policyholder re-entered the premises to retrieve a cat. The cat was fine." },
  { label: "They Said “I'll Be Right Back”", did: "said \"I'll be right back\" and meant it", note: "A covered party stated 'I'll be right back.' They were not." },
  { label: "They Bought the House Anyway", did: "bought the place anyway, well under asking", note: "The purchase price was 70% below market. No questions were asked." },
  { label: "They Opened the Box", did: "opened the one thing with a lock on it", note: "The item was sealed, chained, and labeled. It was opened with a butter knife." },
  { label: "They Took the Shortcut", did: "took a shortcut that was not on the map", note: "The insured left the highway for a route described only as 'the old road.'" },
  { label: "They Checked the Basement", did: "went down to the basement to check the noise", note: "The policyholder investigated a noise in the basement, alone, saying 'Hello?'" },
  { label: "They Assumed It Was Dead", did: "assumed it was dead and leaned in to check", note: "The threat was presumed neutralized. No second check was made. A first check was barely made." },
  { label: "They Moved the Grave", did: "moved the headstones but not, technically, the graves", note: "Construction proceeded over a burial ground. The headstones were relocated. That was all." },
  { label: "They Had No Signal", did: "kept walking around holding a phone in the air", note: "The policyholder's phone had no signal, as is customary." },
  { label: "They Fed It After Midnight", did: "broke the one rule they were given", note: "The insured received exactly one rule and a receipt. The rule was broken the same evening." },
  { label: "They Stayed for One More Night", did: "decided to stay one more night to be sure", note: "The insured had the opportunity to leave at dawn and chose to 'see what happens.'" },
];

// Projected losses: when each cast member leaves the film, and how. Kept non-graphic.
const EXITS = [
  { min: 12, how: "went to check the fuse box" },
  { min: 23, how: "mid-sentence, while explaining why there was nothing to worry about" },
  { min: 37, how: "went to get the car" },
  { min: 52, how: "heroically, but also avoidably" },
  { min: 68, how: "after saying \"We did it\"" },
];
const EXITS_ALT = [
  "investigating a noise, alone, with a flashlight that worked until it mattered",
  "seconds after the audience was told their plans for the future",
  "while walking backwards",
  "after a cat jumped out, which was fine, and then something else did",
  "shortly after tripping on flat ground",
  "while trying to reason with it",
];

const NAMES = ["Laurie", "Sidney", "Nancy", "Tommy", "Kirsty", "Ash", "Dana", "Marcus", "Jess", "Billy", "Ellen", "Ray"];

// Plot shapes. Past tense throughout, so every subject agrees.
const PLOTS = [
  "{subj} arrived {at}. On the first night, they {did}. Now {threat} would like a word.",
  "For {years} years, {threat} bothered nobody. Then {subjLower} showed up {at} and {did}.",
  "Everyone told {subjLower} not to go. The locals, the map, a child with a drawing. They went anyway, ended up {at}, and {did}. Enter {threat}.",
  "{subj} wanted one quiet weekend {at}. Instead they {did}, and {threat} took it personally.",
  "{subj} had exactly one job: do not get involved. Then, {at}, they {did}. This is how they met {threat}.",
];

const TITLE_TEMPLATES = [
  "{thing}", "{place}", "The {place} Incident", "Night of {thing}", "What Happened at {place}",
  "{thing} II: The Return of {thing}", "Don't Go to {place}", "{place}: The Beginning", "Last Night at {place}",
  "{thing} Wants In", "{place} Part VI: The Final Chapter (Again)", "{thing} vs. {place}",
];

const TAGLINES = [
  "They should have read the lease.",
  "Check-out is at eleven. Nobody checks out.",
  "Based on a true story, according to one guy.",
  "This time, it's avoidable.",
  "In {place}, no one can hear you ask for a manager.",
  "Evil never dies. It gets a sequel.",
  "You can't spell 'franchise' without 'an' and 'if'. We checked.",
  "The call is coming from inside the deductible.",
];

// Plain-English labels for the tags on real films (used in the tables).
const TAG_LABELS = {
  sequel: "It is a sequel",
  remake: "It is a remake",
  prequel: "It is a prequel",
  found_footage: "Somebody filmed all of it",
  true_story_claim: "Claims to be a true story",
  based_on_book: "It was a book first",
  holiday: "It happens on a holiday",
  comedy: "It is also a comedy",
  anthology: "It is several stories",
  twist: "There is a twist",
  new_house: "They just moved in",
  no_way_out: "They cannot leave",
  kids: "A child knows more than the adults",
  animal: "An animal is involved",
};

// "Would you survive?" Five questions. Higher risk, earlier exit.
const QUIZ = [
  { q: "You hear a noise in the basement.", a: [
    { t: "Go down, alone, calling “Hello?”", r: 5, cause: "went to check the basement, alone, calling “Hello?”", kind: "The Investigator" },
    { t: "Send someone else", r: 2, cause: "sent a friend to the basement and then went looking for the friend", kind: "The Delegator" },
    { t: "Turn the TV up", r: 3, cause: "ignored it. It did not ignore you", kind: "The Optimist" },
    { t: "Leave the house and call from the car", r: 0, kind: "The Realist" },
  ] },
  { q: "A man at the gas station says, “You don't want to go up there.”", a: [
    { t: "Laugh, buy jerky, go up there", r: 4, cause: "was warned at a gas station and bought jerky", kind: "The Skeptic" },
    { t: "Take his photo for the group chat", r: 3, cause: "posted the warning instead of following it", kind: "The Content Creator" },
    { t: "Ask him follow-up questions", r: 1, kind: "The One Who Knows the Legend" },
    { t: "Turn around. He seems informed", r: 0, kind: "The Realist" },
  ] },
  { q: "The group wants to split up to cover more ground.", a: [
    { t: "Great idea. I'll take the cellar", r: 5, cause: "volunteered for the cellar", kind: "The Team Player" },
    { t: "Agree to pairs, then lose your partner in under a minute", r: 3, cause: "turned around and the partner was gone", kind: "The Buddy" },
    { t: "Refuse, and get called boring", r: 1, kind: "The Boring One" },
    { t: "Fine, but I'm going with the dog", r: 0, kind: "The Dog Person" },
  ] },
  { q: "You find an old book bound in something that is not leather.", a: [
    { t: "Read it aloud, doing the voices", r: 5, cause: "read it aloud, doing the voices", kind: "The Performer" },
    { t: "List it online", r: 3, cause: "sold it online. The buyer came to collect", kind: "The Entrepreneur" },
    { t: "Photograph it for later", r: 2, cause: "kept the photos", kind: "The Researcher" },
    { t: "Put it back and wash your hands", r: 0, kind: "The Realist" },
  ] },
  { q: "It appears to be down, and it is not moving.", a: [
    { t: "Lean in close to check", r: 5, cause: "leaned in to check", kind: "The Thorough One" },
    { t: "Drop the weapon and hug someone", r: 4, cause: "dropped the weapon to hug someone", kind: "The Romantic" },
    { t: "Say something clever", r: 3, cause: "paused for a one-liner", kind: "The Funny One" },
    { t: "Keep going, get in the car, do not look back", r: 0, kind: "The Sole Survivor" },
  ] },
];

// Parts for the made-up sequel subtitles and plots in the Real or Fake? game.
const FAKE_SUBTITLES = [
  "The Homeowners Association", "Tax Season", "Spring Break", "The Musical", "Goes to College", "In 3D, Emotionally",
  "The Deposition", "Final Chapter II", "The Beginning of the End of the Beginning", "Timeshare", "Jury Duty",
  "The Reunion Tour", "Back to School Night", "The Outlet Mall", "Open House", "A New Lease", "Witness Protection",
  "The Cruise", "Homecoming Weekend", "The Wedding", "Daylight Saving", "The Franchise Opportunity",
];
const FAKE_PLOT_WHO = ["Five college friends", "Newlyweds", "Two estranged sisters", "Documentary filmmakers", "Paranormal investigators", "Government scientists", "A brother and sister", "Two small-town deputies"];
const FAKE_PLOT_GOES = [
  "rent a remote cabin for the weekend",
  "move into a farmhouse bought at auction",
  "take a job at a hospital with one working wing",
  "return to their hometown for a funeral",
  "set out to disprove a local legend",
  "accept an invitation to a stranger's island",
  "inherit a hotel that has been closed since the seventies",
];
const FAKE_PLOT_THEN = [
  "and discover the previous occupants never left",
  "and find that something in the woods has been waiting for them",
  "where a masked figure begins picking them off one by one",
  "and awaken something the town has kept quiet for decades",
  "only to learn the locals have plans for them",
  "and slowly realize one of them is not who they claim to be",
  "and find a box that should have stayed closed",
];
