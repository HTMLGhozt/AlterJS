I strive to defeat complexity in build systems and pipelines by making a way to work and produce content.
This is a boilerplate for people who hate frameworks, and the webpackers who understand external dependancies
present an unnessisary risk that should be minimized in the browser. The content of main is for testing
as I develop its capabiitys and demonstrating the latest compositional abilitys.

To immediate access a mongodb instance for your own feature development integrating a db I have only commented
out one that I was using in this codebase. I have not uploaded my auth but bcrypt is available aswell.

The only difference in execution is to have another terminal to run `npm run db` before `npm run test`.
Otherwise you only need the later.

As its setup at this moment I present an example of offering arbitrary html file editing between multiple users.
A way to edit unique instances is described as a very small difference in the code.
I would like to discuss and argue the merits of paths to take here out regarding the protection of this endpoint
and how it can be better composed or packages.

Changelog:
  Pushed what I'v got so far after borking the original project files with an install of LLVM. -_-
  Will be using version control now.

  12-10-18 - Going to clean and comment today.
  01-11-19 - I needed a very small change and as such got discouraged hunting for it while noone seemed
  interested. I have attempted about a dozen branch strategys to providing the abstraction to allow
  collaborative edits and finally succeeded in a minimalistic way preserving my intentions. I will now
  include a sample cert and key for testing to ease the requirements for review. I will need to test this
  in linux after I pull this commit but I do not predict any breaking changes. I will be making progress on
  this project again. My thanks to SudoKid for taking some time to review and discuss this project with me.
  01-13-19 - I have created an interim handler for paths to behave much like module 'path' does, avoiding the
  import. I have also added a few comments and I'll also be pruning previous ones. I made alterations to monolith
  having wanted to clean up the image import as it was left in a test state. A new file is being composed to
  handle the decomposition of a payload to a monolith instance. Some wording in the readme was outdated and
  pruned. Thanks goto Christopher Wheeler for pointing this out. <3