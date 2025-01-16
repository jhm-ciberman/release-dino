const phrases = [
    'The dino just dropped a colossal release! Keep it roaring!',
    'RAWR-some job! A new release has stomped into the wild!',
    'This dino\'s got another egg-cellent release for you!',
    'Boom! Another dino-mite release has landed!',
    'The release is here, and it\'s dino-tastic!',
    'This release is dino-sized and packed with greatness!',
    'Keep up the T-Rex-ellent work, team! Another update out!',
    'The dino\'s not extinct yet! Check out this roaring new release.',
    'Stomp, stomp! Another incredible release marches in!',
    'Keep rocking those releases!',
    'You’re making history—one release at a time. RAWR!',
    'The dino salutes you for your hard work!',
    'Keep building, keep creating, keep roaring!',
    'This dino believes in you—never stop releasing!',
    'Great things take time, but releases keep us alive!',
    'From dino to dev: ‘You’re fossilizing greatness with each update!’',
    'Every release is a step toward dino-sized dreams!',
    'RAWR-some work! Keep pushing those boundaries.',
    'A dino-size thank-you for keeping the innovation alive!',
    'Devosaurs unite! Let’s keep those releases coming!',
    'This release is so good, it’s Jurassic-level awesome!',
    'RAWR! The dino’s roaring for this one!',
    'Another dino-egg has hatched into a full release!',
    'The dev-dino squad never disappoints!',
    'You’re stomping out bugs like a true pro!',
    'Every release gets us closer to being the apex dino!',
    'Hats off—or claws up—to the devs!',
    'Time to fossilize this release in the Hall of Fame!',
    'This update’s got a bite to it—nice work!',
    'You’re the VelociRaptor of releases—fast, smart, unstoppable!',
    'Another dino-sized effort by the team. RAWR-tastic!',
    'The herd is strong—teamwork makes the dino dream work!',
    'Stomping forward together with another roaring release!',
    'From one devosaur to another: keep crushing it!',
    'Dinos stick together, and so does this amazing team!',
    'Big cheers to the dino team—your work rocks!',
    'You’ve dug deep and unearthed another gem of a release!',
    'This dino salutes the whole pack—what a roaring success!',
    'RAWR-mazing work, everyone! Let’s keep the momentum!',
    'The dino is proud to lead such a creative herd!',
    'This release is so good, it’ll go down in history—like the dinosaurs!',
    'The dino is stomping in celebration for this one!',
    'Every update leaves dino-sized footprints of progress!',
    'RAWR-ing with pride for this release!',
    'With releases like this, the dino won’t go extinct!',
    'The devs are making dino-sized strides!',
    'From fossil to feature—this release is a treasure!',
    'Keep the releases flowing; the dino’s hungry for more!',
    'You’re unstoppable!',
    'One small step for dinos, one giant leap for releases!',
    'Roar your way to greatness—this release is just the beginning!',
    'Keep those updates stomping forward!',
    'Dino-sized dreams are built one release at a time!',
    'Another fossilized milestone in the making—great job!',
    'No meteor can stop this team’s momentum!',
    'Chomp away at those features—one release closer to perfection!',
    'This is one dino-mite step for developers, one giant leap for users!',
    'RAWR-ing with excitement over this release!',
    'Every update makes the herd stronger—keep it up!',
    'The future looks bright, and it’s dino-shaped!',
    'This release is a roaring success!',
    'The dino danced for joy—this update is amazing!',
    'Stomp, stomp, hooray! Another update lands!',
    'You’re building something that will stand the test of time!',
    'The dino is thrilled—keep those updates coming!',
    'You’re evolving faster than the dinosaurs ever did!',
    'A little roar goes a long way—this release is proof!',
    'Let’s keep stomping out greatness!',
    'The dino high-fives you with its tiny arms—awesome work!',
    'With each release, this dino gets happier!',
    'You’ve unleashed a dino-mite update—keep crushing it!',
    'Greatness doesn’t happen overnight, but you’re roaring closer!',
    'The dino believes in you—one release at a time!',
    'Every bug you squash is a step closer to perfection!',
    'The herd is proud—this release is a team victory!',
    'Keep innovating—the dino knows you’ve got this!',
    'RAWR for the progress—you’re unstoppable!',
    'The dino sees your hard work, and it’s roaring with pride!',
    'Each release is a masterpiece—keep creating!',
    'Even the smallest updates make a dino-sized difference!',
    'Roar louder, release better, dream bigger!',
    'This dino believes in your vision—keep pushing forward!',
    'You’ve just left another dino-sized footprint in history!',
    'Innovation is in your DNA—just like it’s in this dino’s!',
    'The release is live, and the dino is thriving!',
    'What’s next? The dino is on the edge of its seat!',
    'Every update is another roar heard around the world!',
    'The world appreciates your hard work!',
    'One small step for devs, one giant leap for dinos everywhere!',
    'With every release, you’re changing the game!',
];

export function getDinoPhrase() {
    return phrases[Math.floor(Math.random() * phrases.length)];
}

export function getDinoPhrases(count: number) {
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
        let phrase = getDinoPhrase();
        let tries = 0;
        while (result.includes(phrase) && tries++ < 10) {
            phrase = getDinoPhrase();
        }
        result.push(phrase);
    }
    return result;
}

const verbs = [
    'says', 'says',
    'says', 'says',
    'roars', 'roars',
    'roars', 'roars',
    'exclaims', 'exclaims',
    'whispers',
    'murmurs',
];

export function getDinoVerb() {
    return verbs[Math.floor(Math.random() * verbs.length)];
}


