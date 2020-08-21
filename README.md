# D&D 5e Combat Simulator



## How to create a character

### Simple characters

#### Character definition

Let's start creating a low level monster, a [Hawk](https://roll20.net/compendium/dnd5e/Hawk#content). Its characteristics are:

 1. STR `->` 5 (-3)
 2. DEX `->` 16 (+3)
 3. CON `->` 8 (-1)
 4. INT `->` 2 (-4)
 5. WIS `->` 14 (+2)
 6. CHA `->`  6 (-2)

Also, its AC and its HP are 13 and 1 respectively.

Then, using this framework, this creature will be instantiated as:

```javascript
var hawk = new Character('Hawk', [5, 16, 8, 2, 14, 6], 1, 13)
```

The 'Character' class' constructor expects 4 arguments:

 1. `name` (_str_): Identifier for the character.
 2. `chars` (_array_): Scores for each characteristic of the character. Following this order: strength, dexterity, constitution, intelligence, wisdom, and charisma.
 3. `hp` (_integer_): Hit points of the character.
 4. `ca` (_integer_): Armor class of the character.

#### Adding character's actions

The Hawk has a single attach that has a `+5` modifier and deals a 1 point of damage. Since it has no other actions, this one will be a `DefaultAction`so:

```javascript
hawk.addAction(new DefaultAction('attack', 'enemy', '', '1d20', 5, '', '1d1', 0))
````

The 'DefaultAction' class' constructor expects 8 arguments:

 1. `type` (_str_): Defines the type of action (`"attack"`, or `"heal"`).
 2. `target` (_array_): Indicated the target of the action (`"enemy"`, `"own"`, or `"ally"`).
 3. `tar_con` (_str_): If not empty, indicated a condition to define the target when "enemy" or "ally" is provided. By  default is set to `"random"` and can take values `"farthest"`, `"closest"`, `"lowestAC"`, or `"lowestHP"`.
 4. `hab_dic` (_str_): Defines the ability dice to roll. If empty it assumes that no ability throw is required.
 5. `hab_mod` (_int_): Modifier to be added or subtracted to the ability throw.
 6. `hab_dc` (_int_): Difficultly class required to overcome (>=) in order to be able to perform this action. If empty, DC of enemy will be used.
 7. `dam_dic` (_str_): Defined the damage dice (for attach), and damage healing. Follows the format `(num)d(sides)`.
 8. `dam_mod` (_int_): Modifier to be added or subtracted to the damage, or healing, throw.

#### Visual inspection

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

### Complex characters

Now, let's see how to create a more complex characters. We are going to start crating a level 1 mage:

```javascript
var mage_lvl1 = new Character('Novice', [10, 10, 11, 17, 12, 10], 6, 10)
```

This mage is proficiency with _Quarterstaff_ so we add it as its default action. But the mage will use this action to attack the enemy with lowest HP. Hence:

```javascript
mage_lvl1.addAction(new DefaultAction('attack', 'enemy', 'lowestHP', '1d20', 2, '', '1d8', 0))
```

Moreover, this is not a simple mage. The mage knows the spell [_chromatic orb_](https://www.dnd-spells.com/spell/chromatic-orb), and it can be cast once. Therefore we will create a `ConditionalAction` since the spells have charged and are used along the combat.

```javascript
mage_lvl1.addAction(new ConditionalAction('attack', 'enemy', 'lowestAC', '1d20', 5, '', '3d8', 0, 1))
```

The `ConditionalAction` class' constructor expects the same arguments as the `DefaultAction`'s one, but with an extra ninth argument:

 9. `chag` (int): Number of charged/uses for the conditional action.

But since this is a mage from a rich family, it also has two [common healing potions](https://roll20.net/compendium/dnd5e/Potion%20of%20Healing#content). To add them, we will use, too, the `ContitionalAction` class:

```javascript
var healing = new ConditionalAction('heal', 'own', '', '', 0, '', '2d4', 2, 2)
healing.addCondition('own', 'hp', '<;half')
mage_lvl1.addAction(healing)
```

As we see, the `ConditionalAction` implements a method `addCondition` that expects three arguments:

 1. `con_src` (_str_): Defined the source of the condition (`"enemy"` or `"own"`).
 2. `con_atr` (_str_): Attribute to be checked (`"hp"`, `"ac"`).
 3. `con_chk` (_str_): Comparison to be done using to particles, the first part the equality/inequality and the second the value,separated by semicolon. 
    * particle 1: `<`, `=`, `>`, `!=`
	* particle 2: a number, `"half"`, `"third"`

Using `show` and `showActions` we can verify the powerful mage:

```javascript
mage_lvl1.show()
mage_lvl1.showActions()
```

```
  [CHARACTER] Novice (3 action(s))
  str: 0 (10)
  dex: 0 (10)
  con: 0 (11)
  int: 3 (17)
  wis: 1 (12)
  cha: 0 (10)
  [DEFAULT ACTION]
  attack to lowesthp enemy with ability throw of a 1d20 +2 with a DC of "enemy AC" to damage 1d8 points
  [CONDITIONAL ACTION]
  when undefined undefined undefined undefined, attack to lowestac enemy with ability throw of a 1d20 +5 with a DC of "enemy AC" to damage 3d8 points (number of charges: 1)
  [CONDITIONAL ACTION]
  when own hp <= half, heal own to restore 2d4 +2 points (number of charges: 2)
```