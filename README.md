

# PetProject

## Tutrial Project Installation
https://dev.to/beeman/introduction-to-building-api-s-with-nestjs-and-nrwl-nx-1l2b
https://blog.nrwl.io/nx-now-supports-next-js-84ae3d0b2aed


## Run Command
nx serve api = run Api app

nx serve auth-project = run AuthProject app

nx dep-graph = show WorkSpace Graph

nx affected:apps =  The affected:apps looks at what you have changed and uses the project graph to figure out which apps are affected by this change.

nx affected:libs, and you should see auth printed out. This command works similarly, but instead of printing the affected apps, it prints the affected libs.

nx affected:test to retest only the projects affected by the change.