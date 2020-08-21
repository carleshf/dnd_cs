String.prototype.trim = function() {
	return String(this).replace(/^\s+|\s+$/g, '')
}

function score2mod(score) {
	// Function that converts a score (sum of thee dice throw) to a modifier
	if(score <= 1) {
		return -5
	} else if(2 <= score & score <= 3) {
		return -4
	} else if(4 <= score & score <= 5) {
		return -3
	} else if(6 <= score & score <= 7) {
		return -2
	} else if(8 <= score & score <= 9) {
		return -1
	} else if(10 <= score & score <= 11) {
		return 0
	} else if(12 <= score & score <= 13) {
		return 1
	} else if(14 <= score & score <= 15) {
		return 2
	} else if(16 <= score & score <= 17) {
		return 3
	} else if(18 <= score & score <= 19) {
		return 4
	} else if(20 <= score & score <= 21) {
		return 5
	} else if(22 <= score & score <= 23) {
		return 6
	} else if(24 <= score & score <= 25) {
		return 7
	} else if(26 <= score & score <= 27) {
		return 8
	} else if(28 <= score & score <= 29) {
		return 9
	} else {
		return 10
	}
}

function str2dice(str) {
	// Transforms a string for a dice (aka, 1d20) to a vector.
	var pieces = str.split('d')
	if(pieces[0] == '') {
		pieces[0] = 1
	}
	return([pieces.length == 2, pieces[0], pieces[1]])
}

function dice2str(dice) {
	// Transforms a vector (aka, [1, 20]) to a string for dice (aka, 1d20).
	return dice[0] + 'd' + dice[1]
}

class Character {
	constructor(name, chars, hp, ca) {
		// Constructor for Character class
		//   . name (str): Identifier for the character.
		//   . chars (array): In order, scores for each characteristic.
		//         str, dex, con, int, wis, and cha
		//   . hp (integer): Hit points of the character.
		//   . ca (integer): Armor class of the character.
		// The initiative is taken into account as dex modifier.
		this.name = name
		this.chars = chars
		this.mods = chars.map((x) => score2mod(x))
		this.init = this.mods[1]
		this.hp = hp
		this.ca = ca
		this.default_action = []
		this.conditional_actions = []
	}

	show() {
		// Prints the definition of a character
		let x = '[CHARACTER] ' + this.name + ' (' + (this.default_action.length + this.conditional_actions.length) + ' action(s))'
		console.group()
		console.log(x)
		//console.log('-'.repeat(x.length))
		let charnam = ['str', 'dex', 'con', 'int', 'wis', 'cha']
		for(var ii = 0; ii < charnam.length; ii++) {
			console.log(charnam[ii] + ': ' + this.mods[ii] + ' (' + this.chars[ii] + ')')
		}
		//console.log('-'.repeat(x.length))
		console.groupEnd()
	}

	showActions() {
		var actions = this.default_action.concat(this.conditional_actions)
		for(var ii = 0; ii < actions.length; ii++) {
			actions[ii].show()
		}
	}

	addAction(action) {
		if(!action.valid) {
			console.log('Given action is invalid.')
		} else {
			if(action.constructor.name == 'DefaultAction') {
				if(this.default_action.length == 1) {
					console.warn('Current character already has a default action. It will be overwritten.')
				}
				this.default_action = [action]
			} else if(action.constructor.name == 'ConditionalAction') {
				this.conditional_actions.push(action)
			} else {
				console.log('Invalid action. Only DefaultAction and ConditionalAction can be added.')
			}
		}
	}
}

class Action {
	constructor(type, target, tar_con, hab_dic, hab_mod, hab_dc, dam_dic, dam_mod) {
		// Construction for Action class
		//    . type (str): Defines the type of action.
		//        attack, heal
		//    . target (array): Indicated the target of the action.
		//        enemy, own, ally
		//    . tar_con (str): If not empty, indicated a condition to
		//      define the target when "enemy" or "ally" is provided. By 
		//      default is set to "closest".
		//        farthest, closest, lowestAC, lowestHP
		//    . hab_dic (str): Defines the ability dice to roll. If empty it 
		//      assumes that no ability throw is required.
		//    . hab_mod (int): Modifier to be added or subtracted to the 
		//      ability throw.
		//    . hab_dc (int): Difficultly class required to overcome (>=) in 
		//      order to be able to perform this action. If empty, DC of 
		//      enemy will be used.
		//    . dam_dic (str): Defined the damage dice (for attach), and damage
		//      healing. Follows the format (num)d(sides).
		//    . dam_mod (int): Modifier to be added or subtracted to the
		//      damage, or healing, throw.
		this.valid = true
		
		type = type.toLowerCase().trim()
		target = target.toLowerCase().trim()
		tar_con = tar_con.toLowerCase().trim()
		hab_dic = hab_dic.toLowerCase().trim()
		dam_dic = dam_dic.toLowerCase().trim()
		
		if(type != 'attack' & type != 'heal') {
			this.valid = false
			console.error('Created action of type "' + type + '". Action type must take "attack" or "heal".')
		}
		this.type = type

		if(target != 'enemy' & target != 'own' & target != 'ally') {
			this.valid = false
			console.error('Created action of target "' + target + '". Action target must take "enemy", "own", or "ally".')
		}
		this.target = target

		if(tar_con != '' & tar_con != 'farthest' & tar_con != 'closest' & tar_con != 'lowestac' & tar_con != 'lowesthp') {
			this.valid = false
			console.error('Created action of tar_con "' + tar_con + '". Action tar_con must take "farthest", "closest", "lowestAC", or "lowestHP".')
		}
		this.tar_con = tar_con

        if(hab_dic != '') {
			hab_dic = str2dice(hab_dic)
			if(!hab_dic[0]) {
				this.valid = false
				console.error('Created action with an incorrect hab_dic.')
			}
			this.hab_dic = [hab_dic[1], hab_dic[2]]
		} else {
			this.hab_dic = ''
		}

		dam_dic = str2dice(dam_dic)
		if(!dam_dic[0]) {
			this.valid = false
			console.error('Created action with an incorrect dam_dic.')
		}
		this.dam_dic = [dam_dic[1], dam_dic[2]]

		if(hab_mod == '') {
			this.hab_mod = 0
		} else {
			this.hab_mod = parseInt(hab_mod)
		}

		if(hab_dc == '' & this.hab_dic != '') {
			this.hab_dc = ''
		} else {
			this.hab_dc = parseInt(hab_dc)
		}

		if(dam_mod == '') {
			this.dam_mod = 0
		} else {
			this.dam_mod = parseInt(dam_mod)
		}
	}

	show() {
		// Prints the definition of an action
		var str = this.type + ' '
		if(this.tar_con != '') {
			str = str + 'to ' + this.tar_con + ' '
		} else if(this.target != 'own') {
			str = str + 'to random '
		}
		str = str + this.target + ' '
		if(this.hab_dic != '') {
			str = str + 'with ability throw of a ' + dice2str(this.hab_dic)
			if(this.hab_mod > 0) {
				str = str + ' +' + this.hab_mod
			} else if(this.hab_mod < 0) {
				str = str + ' ' + this.hab_mod
			}
			if(this.hab_dc != '') {
				str = str + ' with a DC of ' + this.hab_dc + ' '
			} else {
				str = str + ' with a DC of "enemy AC" '
			}
		}
		if(this.type == 'attack') {
			str = str + 'to damage ' + dice2str(this.dam_dic)
		} else {
			str = str + 'to restore ' + dice2str(this.dam_dic)
		}
		if(this.dam_mod > 0) {
			str = str + ' +' + this.dam_mod
		} else if(this.dam_mod < 0) {
			str = str + ' ' + this.dam_mod
		}

		str = str + ' points'

		return(str)
	}
}

class DefaultAction extends Action {
	constructor(...args) {
		// Allows to define a DefaultAction
		// All characters should have a default action to be used when no
		// other possibilities exists.
		super(...args)
		this.action_type = 'default'
	}

	show() {
		// Prints the definition of an action
		console.group()
		console.log('[DEFAULT ACTION]')
		console.log(super.show())
		console.groupEnd()
	}
}

class ConditionalAction extends Action {
	constructor(...args) {
		// Allows to define a ConditionalAction
		// Characters may have a series of conditional actions that represents
		// the use of objects (healing potions) or spells which number of
		// uses are limited and which performance may be conditional to a 
		// specific situation.
		super(...args)
		this.action_type = 'conditional'
		if(args.length != 9) {
			console.error('Invalid call to ConditionalAction constructor. 9 arguments are required being the last one the number of charges.')
			this.charges = 0
		} else {
			this.charges = args[8]
		}
		this.condition = []
	}

	show() {
		// Prints the definition of an action
		if(this.condition.length > 0) {
			var str = 'when ' + this.condition[0] + ' ' + this.condition[1] + ' ' + this.condition[2] + ' ' + this.condition[3] + ', '
		} else {
			var str = ''
		}
		console.group()
		console.log('[CONDITIONAL ACTION]')
		console.log(str + super.show() + ' (number of charges: ' + this.charges + ')')
		console.groupEnd()
	}

	addCondition(con_src, con_atr, con_chk) {
		// Allows to specify a condition to indicate when this action has to be
		// performed. If no condition is defined, it will be performed until 
		// all charges are used.
		//    . con_src (str): Defined the source of the condition.
		//        enemy, own
		//    . con_atr (str): Attribute to be checked.
		//        hp, ac
		//    . con_chk (str): Comparison to be done using to particles, the 
		//      first part the equality/inequality and the second the value,
		//      separated by semicolon. 
		//        particle 1: <, <=, =, >, >=, !=
		//        particle 2: (number), half, third
		if(this.condition.length == 1) {
			console.warn('Current action already has a condition. It will be overwritten.')
		}

		con_src = con_src.toLowerCase()
		con_atr = con_atr.toLowerCase()
		con_chk = con_chk.toLowerCase()

		if(con_src != 'enemy' & con_src != 'own') {
			this.valid = false
			console.error('Created a conditional action with con_src "' + con_src + '", which can only take "enemy" or "own".')
		}

		if(con_atr != 'hp' & con_atr != 'ac') {
			this.valid = false
			console.error('Created a conditional action with con_atr "' + con_atr + '", which can only take "hp" or "ac".')
		}

		con_chk = con_chk.split(';')
		if(con_chk[0] == '' | con_chk[1] == '' | con_chk[0] == undefined | con_chk[1] == undefined) {
			this.valid = false
			console.error('Created conditional action with invalid con_chk. No equality/inequality ("' + con_chk[0] + '") or value ("' + con_chk[1] + '") was given.')
		}

		this.condition = [con_src, con_atr, con_chk[0], con_chk[1]]
	}
}

function rollDice(dice) {
	let max = dice[1]
	let accm = 0
	for(var ii = 0; ii < dice[0]; ii++) {
		accm += Math.floor(Math.random() * (max - 1) + 1)
	}
	return accm
}



class Scenario {
	constructor() {
		this.teamA = []
		this.teamB = []
		this.players = []
	}

	addCharacter(char, team) {
		if(team.toLowerCase() == 'a') {
 			this.teamA.push(char)
 		} else if(team.toLowerCase() == 'b') {
 			this.teamB.push(char)
 		} else {
 			console.error('Invalid team provided (can only be "a", or "b"). Character is discarded.')
 		}
	}

	rollInitiative() {
		this.players = []
		for(var ii = 0; ii < this.teamA.length; ii++) {
			this.teamA[ii].init = rollDice([1, 20])
			this.teamA[ii].init = [this.teamA[ii].init + this.teamA[ii].mods[1], this.teamA[ii].init]
			this.teamA[ii].team = 'A'
			this.players.push(this.teamA[ii])
		}
		for(var ii = 0; ii < this.teamB.length; ii++) {
			this.teamB[ii].init = rollDice([1, 20])
			this.teamB[ii].init = [this.teamB[ii].init + this.teamB[ii].mods[1], this.teamB[ii].init]
			this.teamB[ii].team = 'B'
			this.players.push(this.teamB[ii])
		}

		this.players = this.players.sort((a, b) => b['init'][0] - a['init'][0])
	}

	runCombat() {
		this.rollInitiative()
		console.log(this.players)

	}
}


var raven = new Character('mage', [11, 12, 13, 11, 16, 15], 12, 11)
var da1 = new DefaultAction('attack', 'enemy', '', '', 1, 10, '1d4', 2)
//da1.show()
var ca1 = new ConditionalAction('heal', 'own', '', '', 1, 10, '2d4', 2, 3)
ca1.addCondition('own', 'hp', '=;half')
//ca1.show()

raven.addAction(da1)
raven.addAction(ca1)
//raven.show()
raven.showActions()



var hawk = new Character('Hawk', [5, 16, 8, 2, 14, 6], 1, 13)
//Talons. Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: (1d1) slashing damage.
hawk.addAction(new DefaultAction('attack', 'enemy', '', '1d20', 5, '', '1d1', 0))
//hawk.show()
//hawk.showActions()



var s = new Scenario()

s.addCharacter(raven, 'a')
s.addCharacter(hawk, 'b')

//s.runCombat()


var mage_lvl1 = new Character('Novice', [10, 10, 11, 17, 12, 10], 6, 10)
mage_lvl1.addAction(new DefaultAction('attack', 'enemy', 'lowestHP', '1d20', 2, '', '1d8', 0))
mage_lvl1.addAction(new ConditionalAction('attack', 'enemy', 'lowestAC', '1d20', 5, '', '3d8', 0, 1))

var healing = new ConditionalAction('heal', 'own', '', '', 0, '', '2d4', 2, 2)
healing.addCondition('own', 'hp', '<=;half')

mage_lvl1.addAction(healing)


mage_lvl1.show()
mage_lvl1.showActions()

