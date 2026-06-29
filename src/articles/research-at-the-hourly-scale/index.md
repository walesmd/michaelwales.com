---
title: Research at the Hourly Scale
date: 2026-06-24
description: "We stress-tested a year-long fellowship by simulating a synthetic cohort before any real fellow showed up—and why that kind of research happens at the hourly scale at CodePath."
---

Talent is everywhere. Opportunity isn't. That sentence is most of the reason I joined [CodePath](https://www.codepath.org/) as Senior Director of AI Programs, and it sits underneath everything we build. CodePath has spent almost a decade taking first-generation and low-income computing students - most from households earning under $60,000 a year - and getting them into real tech careers, at about a two-in-three rate. The talent was always there. What was missing was a door.

The program I'm spending most of my time on right now is Claude Corps, a paid, year-long fellowship we're running with [Anthropic](https://www.anthropic.com/). We take early-career builders the hiring market would screen out, train them on the AI stack at an intensive in-person Base Camp, then embed them for a year inside nonprofits and mission-driven organizations that need that capability most and can least afford to buy it. CodePath owns the training and the bar for what a fellow can actually do; Anthropic brings the technology and the technical advisors. Every fellow leaves having actually done the job.

But this post isn't really about the program. It's about *how* we built it - and why that's only possible at a place like CodePath.

Before a single real fellow showed up, we ran the first month of the program as a simulation. [I wrote up the full thing separately](https://michaelwales.com/codepath-sim/), but the short version: we built a synthetic cohort - a hundred host organizations, three hundred applicants, fifty mentors, none of them real people - ran our actual selection and matching rules on them, formed the pods, and played the month forward week by week. A wind tunnel for a program design. You'd never fly a plane you'd only ever drawn on a slide.

A few things mattered about how it was built. The engine that decides what happens is plain, deterministic rules - no AI improvising outcomes - so every result is an assumption we wrote down and can argue with, and anyone can rerun it and get the same answer. AI wrote only the layer on top: the first-person journal entries that let you feel a fellow's week instead of reading a spreadsheet, every word pinned to the underlying facts and checked. And a human reviewed every simulated week before the next one ran. The simulation isn't an oracle; it's a thinking aid. The people and outcomes in it are synthetic - we say that loudly and up front, because the moment a made-up number gets to pose as a forecast, you've lost the plot.

What it surfaced was less a verdict than a set of places to look. The pattern that came through most consistently was reassuring: wherever the right person caught a problem in time, the simulated fellow tended to recover - the support model seemed to do its job. The things that gave me pause were the ones support alone didn't appear to resolve. The clearest was capacity - our planned mentor-to-fellow ratio looked stretched well before any simulated crisis, which *suggests* it could be among the first things to buckle under real load. Another we started calling the quiet fellows: a couple of simulated fellows who kept reporting they were fine while falling behind, and weren't noticed until their work broke. If a pattern like that holds up with real people, it would point to detection, rather than help, as the thing worth investing in early.

None of this is settled - it's a synthetic cohort, not a forecast, and I don't want to dress up a hypothesis as a finding. But it's more than enough to act on cheaply: we're building a proactive, week-one check-in for the people who don't raise their hand, and we'll walk into the first real cohort already knowing where to watch. Far better to surface those questions in a model than to first run into them with a real mentor and two dozen real fellows in week three.

I think poking at our own design this early is the opposite of embarrassing. I'd be embarrassed to launch a program at real people without stress-testing it first. Every weak point the simulation flags now is a question we get to ask before a real fellow ever lives the answer. Credibility means being the first to look for the holes in your own work.

And this is where the hourly-scale thing comes in. At a lot of organizations, "run a simulation to pressure-test a strategic decision" is a quarter-long initiative with a steering committee and a slide deck to justify the time. At CodePath, this kind of work happens at the *hourly* scale. The resources, the technology, the time, and - critically - the leadership support are all there by default. You have an idea about how to make a program better, and the path from idea to evidence is measured in hours, not months. That isn't a perk; it's the point. We don't just teach the future of tech - we live it, building tools to think with, running the experiment, and letting the evidence change our minds.

I've started to suspect the method is bigger than the program. Most program designs live on a slide and get tested on real people. We made the argument executable: you run your design forward under realistic conditions and watch where it bends before anyone's year depends on it. Any organization planning something high-stakes could do the same.

## We're Hiring

If any of this resonates, come build it with us. Working at CodePath, you get to directly impact the next generation of technologists and influence the lives of people the industry has historically overlooked - and you get the resources, technology, time, and leadership support to do rigorous, meaningful work while you're at it.

You can review and apply for open roles on our job board: [job-boards.greenhouse.io/codepath](https://job-boards.greenhouse.io/codepath).

Join me in the future of CS education.
