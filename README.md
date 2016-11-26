# Proposal
![Alt text](https://github.com/CandylabS/Lollipop-Forest/blob/master/public/img/screenshots/demo.png?raw=true)
## SKELETON
### BEGINNER’s MODE
*Lollipops are pre-made.*
</br>Class A: Drums.
</br>Class B: Bass.
</br>Class C: Sounds.
</br>![Alt text](https://github.com/CandylabS/Lollipop-Forest/blob/master/public/img/screenshots/Madeon1.png?raw=true)
![Alt text](https://github.com/CandylabS/Lollipop-Forest/blob/master/public/img/screenshots/Madeon2.png?raw=true)
![Alt text](https://github.com/CandylabS/Lollipop-Forest/blob/master/public/img/screenshots/Madeon3.png?raw=true)
### LOOP-EDITOR MODE
*“dry” music*
* Drum Tempo
* Monophonic Rhythm
</br>Method A: **Sampler** (dots)
</br>Method B: **Synthesizer** (stripes)
</br>![Alt text](https://github.com/CandylabS/Lollipop-Forest/blob/master/public/img/screenshots/Sampler.png?raw=true)
![Alt text](https://github.com/CandylabS/Lollipop-Forest/blob/master/public/img/screenshots/Synthesizer.png?raw=true)

### COMPANION’s MODE
*arrange drums or baseline for an existing melody*
</br>start from a melody track (ON/OFF)
</br>melody can be (i)made from loop-editor (“lollipops”) OR (ii)~~feed from music box tape holes~~ **

### EVOLUTION MODE
*ambient music*
<br>RUN BY ITSELF (system music by Brian Eno)
![Alt text](https://github.com/CandylabS/Lollipop-Forest/blob/master/public/img/screenshots/discreetmusic.jpg?raw=true)
</br>**add self rotation
</br>**<strong>trajectory change</strong>
</br>![Alt text](https://github.com/CandylabS/Lollipop-Forest/blob/master/public/img/screenshots/Circles.png?raw=true)
![Alt text](https://github.com/CandylabS/Lollipop-Forest/blob/master/public/img/screenshots/MetaBalls.png?raw=true)

## UI
### I. Dynamics

##### User Scenario:
* Create the lollipop
* Get notes
* Set layers
* Playback
* Reset /Preset
* …

##### Checklist:
* Roll the tape (starting point)
* Roll different layers
* Import (music box holes) to lollipop
* **LOCK** the tape (“mute”)
* Preview of a lollipop playback
* move one layer to another???
* …

### II. Notes/Beats	
**AudioBuffer.SourceNode**
![Alt text](https://github.com/CandylabS/Lollipop-Forest/blob/master/public/img/screenshots/webaudio-graph-airports-system.png?raw=true)
1. Major / Minor
> key -> scale
> 3rd / 5th / 7th …
<br>2. Arpeggiator
> C2, C3, C4, C5, C6 …
<br>3. Arpeggiator
> up & down
> random
> …
<br>4. Chord Progression

### FX	
SYNTHI
![Alt text](https://github.com/CandylabS/Lollipop-Forest/blob/master/public/img/screenshots/SYNTHI.jpeg?raw=true)
AudioContext.FilterNode
![Alt text](https://github.com/CandylabS/Lollipop-Forest/blob/master/public/img/screenshots/webaudio-graph-discreet-full.png?raw=true)
* Reverberation
* EQ (convolution & graphic)
* Echo
* Chorus
* Fading (ASDR)
* …

### Mastering
Interaction in “forest”

##### Global:
* play / pause all
* set starting point
* set tempo
* settings…

##### While playing:
* pan & volume
* mute track
* delete / unable track
* add track (* wait until next available beat!! )
* switch background music to different mood
* throw in some “noise”

## VARIATION
spiral rasterization
![Alt text](https://github.com/CandylabS/Lollipop-Forest/blob/master/public/img/screenshots/Rasterize.png?raw=true)





