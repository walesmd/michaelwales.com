---
title: What Algorithm Runs an Elevator?
date: 2026-06-26
---

I was standing in the lobby of my resort at Universal Orlando, waiting for an elevator, when the question caught me. Six cars, a small crowd, buttons lighting up faster than the doors could open. One car sailed past my floor without stopping. The other doubled back for someone who'd pressed *down* after I'd pressed *up*. And I found myself doing the thing I always do when something in the world won't leave me alone: wondering exactly how it decides. What's the logic in there? When two people on different floors both want a car, who wins? Is it just first-come-first-served, or is something cleverer going on?

For most of my life, that's where a question like this goes to die. You feel the itch on vacation, maybe you skim a Wikipedia article on the plane home, and the curiosity quietly evaporates because the gap between "I wonder how this works" and "I actually understand how this works" is wide enough that you never cross it. There's reading *about* a thing, and there's *building* the thing, and the second one is where understanding actually lives — but building used to be expensive enough that you saved it for work.

That gap has collapsed. So this time, instead of reading about elevators, I built a little world where I could run them myself.

## Not really a game

What I ended up with is, nominally, a browser game: you write a JavaScript function that controls an elevator, run it against a simulated building full of impatient people, watch it play out, and get a score. But "game" undersells what I was actually after. I wanted a *learning environment* — something that would let me do three specific things:

- **Write my own algorithm** and immediately see whether my intuition was any good. You're handed a working-but-naive elevator and a code editor; your job is to write the brain that decides where it goes. Run it and watch passengers wait — or not.
- **Compare it against the algorithms that already exist.** The classic elevator-scheduling family — FCFS, SSTF, SCAN, LOOK — is built in. I can drop any of them into the editor, run them on the same building, and see their numbers side by side.
- **Actually *see* the difference.** This was the part I cared most about. The simulation draws the shaft, the cars, and the people waiting on each floor — and the longer someone waits, the more they warm from yellow to red, so you literally watch a bad algorithm strand somebody in the corner while it fusses over closer, easier riders.

That last point is the whole pedagogical bet. It's one thing to read that "first-come-first-served has poor worst-case latency." It's another to watch a single red passenger sit on floor 14, fuming, while your too-greedy car ping-pongs around the lobby. The problem becomes *felt* before it becomes a sentence.

## The answer I was actually looking for

Here's what I learned, which is the satisfying part. My resort question — *is it just first-come-first-served, or something cleverer?* — turns out to have a real, named answer with decades of computer science behind it.

First-come-first-served is the obvious idea, and it's terrible. It feels fair, but it makes the car thrash up and down the building chasing requests in the order they happened to arrive, blowing past people it's about to drive directly past. The thing real elevators actually do is called **directional collective control**, and the canonical version is the **SCAN / LOOK** family — affectionately, "the elevator algorithm." The car commits to a direction, *shows* you that direction, and serves every call going that way as it passes; if you want to go the other way, you wait for the return sweep. It only turns around when there's nothing left ahead of it. That single rule — commit to a direction and sweep — is most of why a real elevator feels orderly instead of frantic.

And then it gets deeper in exactly the way good problems do. Add a second car and the hard part stops being "where does *this* car go" and becomes *assignment*: which car should answer which call, so they don't both lunge for the same person and leave the rest of the building uncovered? Make the building tall and suddenly distance and energy matter as much as wait time, and you're trading objectives against each other — average wait versus worst-case wait versus floors traveled. There is no single "correct" elevator algorithm. There's a problem, a set of trade-offs, and a score to beat. That realization — that I'd wandered into a genuine optimization problem, not a trivia answer — was worth the whole trip.

## AI as the workshop, not the answer

I want to be precise about the role AI played here, because I think it's the actually-interesting part and it's easy to get wrong.

I did not ask Claude "how do elevators work" and read the reply. That would have been the Wikipedia path with extra steps, and it would have skipped the only part that teaches you anything — the building. What I did instead was use Claude to construct the *environment* in which I could figure it out myself. I told it, in effect, to act as a pedagogy expert and help me build a tool whose entire job was to make me struggle productively: one new idea per level, each level designed so the strategy that won the last one visibly breaks; name the concept but never hand over the code; let me earn the worked solutions only after I'd cleared a level on my own. The tool is opinionated about *not* telling me the answer — and I'm the one who pointed it that way.

The result is that the loop from "idle curiosity in a hotel lobby" to "interactive thing I can poke at for hours" took a couple of days of nights-and-weekends tinkering, not a couple of months. That compression is the headline. The cost of chasing a question all the way down to a working artifact has dropped far enough that it's worth doing for its own sake — not for a deliverable, not for work, just because you got curious about an elevator. We talk about AI mostly in terms of shipping features faster. I think the quieter, bigger story is that it makes *self-directed learning* cheap: when the world makes you wonder about something, you can now build your way to actually understanding it.

## On the fact that better elevator games exist

They do. There are elevator simulators and dispatch games out there that are richer, prettier, and more complete than mine, made by people who've spent far longer than four days on them. I want to be honest about that, because I think the honesty is the point rather than a disclaimer.

I didn't build this to compete with anything. I built it to answer *my* question, in a way that was engaging to *me*, scoped to exactly the things I was curious about and nothing I wasn't. That's a different goal than "make the best elevator game," and it's a goal that used to be uneconomical — you don't spin up a bespoke learning tool for an audience of one. Now you can. And because it's all client-side, runs offline, and lives in the open on [GitHub](https://github.com/walesmd/elevator-algorithm-game), maybe it scratches the same itch for someone else who walked out of a hotel lobby with the same question. If it does, great. If not, I still got exactly what I came for.

The elevator, for the record, was almost certainly running LOOK.
