# D&D 5e Combat Simulator



## How to create a character

Let's start creating a low level monster, a [Hawk](https://roll20.net/compendium/dnd5e/Hawk#content). Its characteristics are:

 1. STR `->` 5 (-3)
 2. DEX `->` 16 (+3)
 3. CON `->` 8 (-1)
 4. INT `->` 2 (-4)
 5. WIS `->` 14 (+2)
 6. CHA `->`  6 (-2)

Also, the AC and its HP are 13 and 1 respectively.

Then, using this framework, this creature will be instantiated as:

```javascript
var hawk = new Character('Hawk', [5, 16, 8, 2, 14, 6], 1, 13)
```

The Hawk has a single attach that has a `+5` modifier and deals a 1 point of damage. Since it has no other actions, this one will be a `DefaultAction`so:

```javascript
hawk.addAction(new DefaultAction('attack', 'enemy', '', '1d20', 5, '', '1d1', 0))
````

The created hawk can be checked with:

```javascript
hawk.show()
```

```
  [CHARACTER] Hawk (1 action(s))
  str: -3 (5)
  dex: 3 (16)
  con: -1 (8)
  int: -4 (2)
  wis: 2 (14)
  cha: -2 (6)
```

And its actions with

```javascript
hawk.showActions()
```

```
  [DEFAULT ACTION]
  attack to random enemy with ability throw of a 1d20 +5 with a DC of "enemy AC" to damage 1d1 points
```
