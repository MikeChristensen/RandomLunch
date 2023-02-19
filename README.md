# RandomLunch
NestJS app used to pair up participants at random to have lunch

# To use

First, you must have some people sign up for random lunch.  To do this, make a call to the `/signup` API and post a JSON
object with a name and team property.  This can be done in PowerShell as such:

```
iwr http://localhost:3000/signup -Method Post -Body @{name="Mike"; team=1}
iwr http://localhost:3000/signup -Method Post -Body @{name="Anne"; team=2}
iwr http://localhost:3000/signup -Method Post -Body @{name="Bob"; team=3}
iwr http://localhost:3000/signup -Method Post -Body @{name="Fred"; team=1}
iwr http://localhost:3000/signup -Method Post -Body @{name="Sue"; team=2}
iwr http://localhost:3000/signup -Method Post -Body @{name="Kathy"; team=3}
iwr http://localhost:3000/signup -Method Post -Body @{name="Dave"; team=1}
iwr http://localhost:3000/signup -Method Post -Body @{name="Frank"; team=2}
iwr http://localhost:3000/signup -Method Post -Body @{name="Irene"; team=3}
iwr http://localhost:3000/signup -Method Post -Body @{name="Megan"; team=1}
iwr http://localhost:3000/signup -Method Post -Body @{name="Harry"; team=2}
```

When everyone has signed up, you can generate random lunch pairs by calling the `/results` API:

```
iwr http://localhost:3000/results
```

(Since this is a GET call, you can also just use your web browser)

## Results

Pairs are not just random.  The `team` will be taken into account, and the algorithm will attempt to match
up people who are on separate teams.  This will result in more people eating lunch with co-workers they haven't
met, or don't typically work with.

Obviously, it's not always possible to get a perfect score.  For example, 9 people from Marketing might sign up and
1 person from R&D.  It would simply not be possible to have everyone eat lunch with someone on a different team.  For
that reason, a `score` property is also returned.  The lower the score, the better the results.  A score of 0 means
everyone is eating lunch with people on different teams.

# Testing

#### unit tests
$ npm run test

#### e2e tests
$ npm run test:e2e

#### test coverage
$ npm run test:cov

# Possible Improvements

I have a few ideas on how to make this program better:

1. General code cleanup improvements.  I'm currently learning TypeScript and NestJS, so there's probably nifty language features I could be using.
2. Store signups in a database, such as Redis or CosmosDB.  If you were running this in a real production environment, you'd need this.
3. Some sort of web based frontend?  I haven't looked into MVC frameworks for NestJS, but I'm sure there's many options.